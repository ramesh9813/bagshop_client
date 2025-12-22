import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const MyOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/orders/me`,
                    { withCredentials: true }
                )
                if (data.success) {
                    setOrders(data.orders)
                }
            } catch (error) {
                toast.error("Failed to fetch your orders")
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    return (
        <div className="container mt-5">
            <h2 className="mb-4">My Orders</h2>
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {orders.length === 0 ? (
                        <div className="alert alert-info">
                            You haven't placed any orders yet. <Link to="/products">Start Shopping!</Link>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">Order ID</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Items</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>{order.orderItems.length}</td>
                                            <td>NRS {order.totalPrice.toLocaleString()}</td>
                                            <td>
                                                <span 
                                                    className={`badge ${
                                                        order.orderStatus === 'Processing' ? 'bg-warning text-dark' : 
                                                        order.orderStatus === 'Delivered' ? 'bg-success' : ''
                                                    }`}
                                                    style={order.orderStatus === 'Shipped' ? { backgroundColor: '#ff69b4', color: 'white' } : {}}
                                                >
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <Link to={`/order/${order._id}`} className="btn btn-sm btn-primary">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default MyOrders