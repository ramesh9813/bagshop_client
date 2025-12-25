import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Line, Pie } from 'react-chartjs-2'
import Spinner from '../../component/Spinner'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  ChartDataLabels
);

const OwnerAnalytics = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pieTimeRange, setPieTimeRange] = useState('all')

    const fetchAnalytics = async (range = 'all') => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/admin/analytics?range=${range}`,
                { withCredentials: true }
            )
            if (data.success) {
                setData(data)
            }
        } catch (error) {
            console.error("Error fetching analytics", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics(pieTimeRange)
    }, [pieTimeRange])

    if (loading && !data) return <Spinner />

    // Prepare Category Data
    const pieData = {
        labels: data?.categorySales?.map(c => c._id) || [],
        datasets: [{
            data: data?.categorySales?.map(c => c.totalSales) || [],
            backgroundColor: ['#ffc107', '#28a745', '#17a2b8', '#dc3545'],
            hoverOffset: 4
        }]
    };

    // Prepare Sales Trend Data (Simple grouping by date from allOrders)
    const salesByDate = {};
    if (data?.allOrders) {
        data.allOrders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString();
            salesByDate[date] = (salesByDate[date] || 0) + order.totalPrice;
        });
    }

    const trendData = {
        labels: Object.keys(salesByDate),
        datasets: [{
            label: 'Daily Revenue (NRS)',
            data: Object.values(salesByDate),
            borderColor: '#ffc107',
            tension: 0.1,
            fill: true,
            backgroundColor: 'rgba(255, 193, 7, 0.1)'
        }]
    };

    return (
        <div className="container-fluid">
            <div className="row g-4">
                {/* Revenue Trend */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Revenue Growth Trend</h5>
                            <div style={{ height: '300px' }}>
                                <Line 
                                    data={trendData} 
                                    options={{ 
                                        maintainAspectRatio: false,
                                        plugins: {
                                            datalabels: {
                                                display: false
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="card-title m-0">Revenue by Category</h5>
                                <select 
                                    className="form-select form-select-sm" 
                                    style={{ width: 'auto' }}
                                    value={pieTimeRange}
                                    onChange={(e) => setPieTimeRange(e.target.value)}
                                >
                                    <option value="today">Today</option>
                                    <option value="week">Week</option>
                                    <option value="month">Month</option>
                                    <option value="year">Year</option>
                                    <option value="all">All Time</option>
                                </select>
                            </div>
                            <div style={{ height: '300px' }}>
                                <Pie 
                                    data={pieData} 
                                    options={{ 
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'bottom'
                                            },
                                            datalabels: {
                                                color: '#fff',
                                                font: {
                                                    weight: 'bold',
                                                    size: 12
                                                },
                                                formatter: (value) => `NRS ${value.toLocaleString()}`,
                                                anchor: 'center',
                                                align: 'center'
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Table */}
                <div className="col-12 mt-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Category Performance Metrics</h5>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Category</th>
                                            <th>Total Items Sold</th>
                                            <th>Total Revenue</th>
                                            <th>Avg. Order Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.categorySales?.map((c, i) => (
                                            <tr key={i}>
                                                <td className="fw-bold">{c._id}</td>
                                                <td>{c.totalQuantity} units</td>
                                                <td className="text-success fw-bold">NRS {c.totalSales.toLocaleString()}</td>
                                                <td>NRS {(c.totalSales / (c.totalQuantity || 1)).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerAnalytics