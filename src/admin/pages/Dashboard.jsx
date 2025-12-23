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
                    <div className="card text-dark bg-light mb-3 shadow-sm border-0">
                        <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pb-0">
                            <span className="text-uppercase small fw-bold text-muted">Total Sales</span>
                            <i className="bi bi-cash-stack fs-4 text-success"></i>
                        </div>
                        <div className="card-body pt-0">
                            <h3 className="card-title fw-bold">NRS {stats.totalSales.toLocaleString()}</h3>
                            <Link to="/admin/orders" className="text-primary text-decoration-none small">View Details &rarr;</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-dark bg-light mb-3 shadow-sm border-0">
                        <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pb-0">
                            <span className="text-uppercase small fw-bold text-muted">Total Orders</span>
                            <i className="bi bi-bag-check fs-4 text-primary"></i>
                        </div>
                        <div className="card-body pt-0">
                            <h3 className="card-title fw-bold">{stats.ordersCount}</h3>
                            <Link to="/admin/orders" className="text-primary text-decoration-none small">View Details &rarr;</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-dark bg-light mb-3 shadow-sm border-0">
                        <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pb-0">
                            <span className="text-uppercase small fw-bold text-muted">Products</span>
                            <i className="bi bi-box-seam fs-4 text-warning"></i>
                        </div>
                        <div className="card-body pt-0">
                            <h3 className="card-title fw-bold">{stats.productsCount}</h3>
                            <Link to="/admin/products" className="text-primary text-decoration-none small">View Details &rarr;</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-dark bg-light mb-3 shadow-sm border-0">
                        <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pb-0">
                            <span className="text-uppercase small fw-bold text-muted">Users</span>
                            <i className="bi bi-people fs-4 text-danger"></i>
                        </div>
                        <div className="card-body pt-0">
                            <h3 className="card-title fw-bold">{stats.usersCount}</h3>
                            <Link to="/admin/users" className="text-primary text-decoration-none small">View Details &rarr;</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <SalesChart />
                </div>
            </div>
            </>
        )}
    </div>
  )
}

export default Dashboard