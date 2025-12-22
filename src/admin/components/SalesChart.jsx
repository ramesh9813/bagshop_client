import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
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

    setChartData({
        labels,
        datasets: [
          {
            label: 'Sales (NRS)',
            data: dataPoints,
            borderColor: '#28a745', // Green line
            backgroundColor: 'rgba(40, 167, 69, 0.1)', // Light green fill
            pointBackgroundColor: 'red', // Red dots
            pointBorderColor: 'red',
            pointRadius: dataPoints.map(val => val > 0 ? 5 : 0), 
            pointHoverRadius: dataPoints.map(val => val > 0 ? 7 : 0),
            tension: 0.3,
            fill: true
          },
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
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">Sales Overview</h6>
            <select 
                className="form-select form-select-sm" 
                style={{width: 'auto'}}
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
            >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="lifetime">Lifetime</option>
            </select>
        </div>
        <div className="card-body">
            <div className="chart-area">
                {chartData.labels.length > 0 ? (
                    <Line options={options} data={chartData} height={300} />
                ) : (
                    <p className="text-center py-5">No sales data available for this period.</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default SalesChart;