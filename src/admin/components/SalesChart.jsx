import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Dropdown from 'react-bootstrap/Dropdown';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const rangeLabels = {
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
    lifetime: 'Lifetime'
  };

  useEffect(() => {
    // Simulated data fetching based on timeRange
    // In a real app, you would fetch this from your backend: /api/v1/admin/sales-stats?range=${timeRange}
    
    // For now, generating placeholder data based on Orders
    const fetchSalesData = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/admin/orders`, 
                { withCredentials: true }
            );
            
            if (data.success) {
                processData(data.orders, timeRange);
            }
        } catch (error) {
            console.error("Error fetching sales data for chart", error);
        }
    }

    fetchSalesData();
  }, [timeRange]);

  const processData = (orders, range) => {
    const salesMap = {};
    const today = new Date();
    
    // 1. Initialize empty slots for better visualization
    if (range === 'today') {
        for (let i = 0; i <= today.getHours(); i++) {
            salesMap[`${i}:00`] = 0;
        }
    } else if (range === 'week') {
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            salesMap[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
        }
    }

    // Helper to format date keys
    const getFormattedKey = (date, range) => {
        if (range === 'today') {
            return date.getHours() + ':00';
        } else if (range === 'week' || range === 'month') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else if (range === 'year') {
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else if (range === 'lifetime') {
            return date.getFullYear().toString();
        }
        return date.toLocaleDateString();
    };

    // 2. Filter and group orders
    orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        let includeOrder = false;

        if (range === 'today') {
            if (orderDate.toDateString() === today.toDateString()) includeOrder = true;
        } else if (range === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            if (orderDate >= oneWeekAgo) includeOrder = true;
        } else if (range === 'month') {
             const oneMonthAgo = new Date();
             oneMonthAgo.setMonth(today.getMonth() - 1);
             if (orderDate >= oneMonthAgo) includeOrder = true;
        } else if (range === 'year') {
             const oneYearAgo = new Date();
             oneYearAgo.setFullYear(today.getFullYear() - 1);
             if (orderDate >= oneYearAgo) includeOrder = true;
        } else if (range === 'lifetime') {
            includeOrder = true;
        }

        if (includeOrder) {
            const key = getFormattedKey(orderDate, range);
            salesMap[key] = (salesMap[key] || 0) + order.totalPrice;
        }
    });

    // 3. Sort keys chronologically
    // For Today, sort by hour number
    const labels = Object.keys(salesMap).sort((a, b) => {
        if (range === 'today') {
            return parseInt(a) - parseInt(b);
        }
        if (range === 'week' || range === 'month') {
            return new Date(a) - new Date(b);
        }
        return 0; // Default sort for others
    });

    const dataPoints = labels.map(label => salesMap[label]);

    // --- Trendline / Projection Logic ---
    let projectedValue = 0;
    let nextLabel = "";
    
    if (dataPoints.length > 0) {
        // Simple Average Projection: Take the average of non-zero points to predict next
        const nonZeroPoints = dataPoints.filter(p => p > 0);
        const avgValue = nonZeroPoints.length > 0 
            ? nonZeroPoints.reduce((a, b) => a + b, 0) / nonZeroPoints.length 
            : 0;
        
        // Add a bit of "momentum" (last point vs average)
        const lastPoint = dataPoints[dataPoints.length - 1];
        projectedValue = (avgValue + lastPoint) / 2;

        if (range === 'today') nextLabel = "Next Hour";
        else if (range === 'week') nextLabel = "Next Day";
        else if (range === 'month') nextLabel = "Next Week";
        else if (range === 'year') nextLabel = "Next Month";
        else nextLabel = "Forecast";
    }

    const extendedLabels = [...labels, nextLabel];
    const projectionPoints = new Array(labels.length - 1).fill(null);
    projectionPoints.push(dataPoints[dataPoints.length - 1]); // Connect to last real point
    projectionPoints.push(projectedValue);

    setChartData({
        labels: extendedLabels,
        datasets: [
          {
            label: 'Actual Sales (NRS)',
            data: dataPoints,
            borderColor: '#28a745', 
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            pointBackgroundColor: '#28a745',
            pointRadius: 4,
            tension: 0.3,
            fill: true
          },
          {
            label: 'Projected Trend',
            data: projectionPoints,
            borderColor: '#ffc107', // Yellow for warning/prediction
            borderDash: [5, 5], // Dashed line
            pointBackgroundColor: '#ffc107',
            pointRadius: 6,
            tension: 0.3,
            fill: false
          }
        ],
      });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            min: -20,
            ticks: {
                padding: 10
            },
            grid: {
                drawBorder: false
            }
        },
        x: {
            grid: {
                display: false
            }
        }
    },
    plugins: {
        legend: {
            display: true,
            position: 'top'
        },
        datalabels: {
            display: false
        }
    },
    layout: {
        padding: {
            top: 20
        }
    }
  };

  return (
    <div className="card shadow mb-4">
        <style>
            {`
                .custom-chart-dropdown .dropdown-item:hover {
                    background-color: #ffc107 !important;
                    color: black !important;
                }
                .custom-chart-dropdown .dropdown-toggle::after {
                    margin-left: 10px;
                }
            `}
        </style>
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-secondary">Sales Overview</h6>
            
            <Dropdown onSelect={(val) => setTimeRange(val)} className="custom-chart-dropdown">
                <Dropdown.Toggle variant="white" className="btn-sm border text-dark shadow-none d-flex align-items-center">
                    {rangeLabels[timeRange]}
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-sm border-0">
                    {Object.keys(rangeLabels).map((key) => (
                        <Dropdown.Item key={key} eventKey={key}>
                            {rangeLabels[key]}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
        <div className="card-body">
            <div className="chart-area">
                {chartData.labels.length > 0 ? (
                    <Line options={options} data={chartData} height={400} />
                ) : (
                    <p className="text-center py-5">No sales data available for this period.</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default SalesChart;