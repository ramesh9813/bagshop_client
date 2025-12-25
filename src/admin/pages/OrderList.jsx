import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSortableData } from '../../hooks/useSortableData'

const OrderList = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const { items: sortedOrders, requestSort, sortConfig } = useSortableData(orders);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/admin/orders`,
                { withCredentials: true }
            )
            if (data.success) {
                setOrders(data.orders)
            }
        } catch (error) {
            toast.error("Failed to fetch orders")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const updateStatus = async (id, status) => {
        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/admin/order/${id}`,
                { status },
                { withCredentials: true }
            )
            if (data.success) {
                toast.success("Order status updated")
                fetchOrders()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed")
        }
    }

    const deleteOrder = async (id) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                const { data } = await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/admin/order/${id}`,
                    { withCredentials: true }
                )
                if (data.success) {
                    toast.success("Order deleted")
                    fetchOrders()
                }
            } catch (error) {
                toast.error("Delete failed")
            }
        }
    }

    const SortIcon = ({ name }) => {
        if (sortConfig?.key === name) {
            return sortConfig.direction === 'ascending' ? <i className="bi bi-caret-up-fill ms-1"></i> : <i className="bi bi-caret-down-fill ms-1"></i>;
        }
        return <i className="bi bi-caret-up ms-1 text-muted opacity-25"></i>;
    };

  return (
    <div>
        {loading ? (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        ) : (
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th scope="col" onClick={() => requestSort('_id')} style={{cursor: 'pointer'}}>Order ID <SortIcon name="_id"/></th>
                            <th scope="col" onClick={() => requestSort('orderItems.length')} style={{cursor: 'pointer'}}>Items Qty <SortIcon name="orderItems.length"/></th>
                            <th scope="col" onClick={() => requestSort('totalPrice')} style={{cursor: 'pointer'}}>Amount <SortIcon name="totalPrice"/></th>
                            <th scope="col" onClick={() => requestSort('orderStatus')} style={{cursor: 'pointer'}}>Status <SortIcon name="orderStatus"/></th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedOrders && sortedOrders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
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
                                    <div className="btn-group">
                                        <select 
                                            className="form-select form-select-sm me-2" 
                                            value={order.orderStatus}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            style={{width: 'auto'}}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteOrder(order._id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  )
}

export default OrderList