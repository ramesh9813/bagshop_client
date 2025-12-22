import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import SalesChart from '../components/SalesChart'

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        ordersCount: 0,
        productsCount: 0,
        usersCount: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/admin/stats`,
                    { withCredentials: true }
                )
                if (data.success) {
                    setStats(data)
                }
            } catch (error) {
                toast.error("Failed to load dashboard stats")
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

  return (
    <div>
        {loading ? (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        ) : (
            <>
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card text-white bg-primary mb-3 shadow">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            Total Sales
                            <i className="bi bi-cash-stack fs-4"></i>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">NRS {stats.totalSales.toLocaleString()}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-success mb-3 shadow">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            Total Orders
                            <i className="bi bi-bag-check fs-4"></i>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{stats.ordersCount}</h5>
                            <Link to="/admin/orders" className="text-white text-decoration-none small">View Details &rarr;</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-warning mb-3 shadow">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            Products
                            <i className="bi bi-box-seam fs-4"></i>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{stats.productsCount}</h5>
                            <Link to="/admin/products" className="text-white text-decoration-none small">View Details &rarr;</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-danger mb-3 shadow">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            Users
                            <i className="bi bi-people fs-4"></i>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{stats.usersCount}</h5>
                            <Link to="/admin/users" className="text-white text-decoration-none small">View Details &rarr;</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-lg-6">
                    <SalesChart />
                </div>
                {/* Future component placeholder */}
                <div className="col-lg-6">
                    {/* Add another chart or widget here later */}
                </div>
            </div>
            </>
        )}
    </div>
  )
}

export default Dashboard