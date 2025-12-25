import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Line, Pie, Bar } from 'react-chartjs-2'
import Spinner from '../../component/Spinner'
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
  BarElement
);

const OwnerAnalytics = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/admin/analytics`,
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
        fetchAnalytics()
    }, [])

    if (loading) return <Spinner />

    // Prepare Category Data
    const pieData = {
        labels: data?.categorySales.map(c => c._id),
        datasets: [{
            data: data?.categorySales.map(c => c.totalSales),
            backgroundColor: ['#ffc107', '#28a745', '#17a2b8', '#dc3545'],
            hoverOffset: 4
        }]
    };

    // Prepare Sales Trend Data (Simple grouping by date from allOrders)
    const salesByDate = {};
    data?.allOrders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString();
        salesByDate[date] = (salesByDate[date] || 0) + order.totalPrice;
    });

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
                                <Line data={trendData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Revenue by Category</h5>
                            <div style={{ height: '300px' }}>
                                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
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
                                        {data?.categorySales.map((c, i) => (
                                            <tr key={i}>
                                                <td className="fw-bold">{c._id}</td>
                                                <td>{c.totalQuantity} units</td>
                                                <td className="text-success fw-bold">NRS {c.totalSales.toLocaleString()}</td>
                                                <td>NRS {(c.totalSales / c.totalQuantity).toFixed(2)}</td>
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
