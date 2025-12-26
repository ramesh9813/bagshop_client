import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const OrderDetails = () => {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/order/${id}`,
                    { withCredentials: true }
                )
                if (data.success) {
                    setOrder(data.order)
                }
            } catch (error) {
                toast.error("Failed to fetch order details")
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrderDetails()
    }, [id])

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-warning" /></div>
    if (!order) return <div className="text-center py-5">Order not found</div>

    const submitEsewaForm = (actionUrl, formData) => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = actionUrl;

        Object.keys(formData).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = formData[key];
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    };

    const handlePaymentRetry = async () => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            };
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/payment/initiate`,
                { orderId: order._id },
                config
            );

            if (data.success) {
                submitEsewaForm(data.payment_url, data.formData);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to initiate payment");
        }
    };

    const cancelOrder = async () => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                const { data } = await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/order/cancel/${order._id}`,
                    {},
                    { withCredentials: true }
                );

                if (data.success) {
                    toast.success("Order Cancelled Successfully");
                    setOrder({ ...order, orderStatus: 'Cancelled' });
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to cancel order");
            }
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Order Details: {order._id}</h2>
            
            <div className="row">
                <div className="col-lg-8">
                    {/* Shipping Info */}
                    <div className="card shadow mb-4">
                        <div className="card-header bg-light text-dark fw-bold">Shipping Info</div>
                        <div className="card-body">
                            <p><strong>Name:</strong> {order.user && order.user.name}</p>
                            <p><strong>Phone:</strong> {order.shippingInfo && order.shippingInfo.phoneNo}</p>
                            <p>
                                <strong>Address:</strong> {order.shippingInfo && 
                                `${order.shippingInfo.address}, ${order.shippingInfo.city}`}
                            </p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="card shadow mb-4">
                        <div className="card-header bg-light text-dark fw-bold">Payment</div>
                        <div className="card-body">
                            <p><strong>Status: </strong>
                                <span className={order.paymentInfo && order.paymentInfo.status.toLowerCase() === "succeeded" ? "text-success fw-bold" : "text-danger fw-bold"}>
                                    {order.paymentInfo && order.paymentInfo.status.toLowerCase() === "succeeded" ? "PAID" : "NOT PAID"}
                                </span>
                            </p>
                            <p><strong>Method:</strong> {order.paymentInfo && order.paymentInfo.method}</p>
                            <p><strong>Amount:</strong> NRS {order.totalPrice}</p>
                            
                            {/* Retry Payment Button */}
                            {order.paymentInfo && 
                             order.paymentInfo.status.toLowerCase() !== "succeeded" && 
                             order.paymentInfo.method === "eSewa" && 
                             order.orderStatus !== 'Cancelled' && (
                                <button 
                                    className="btn btn-success mt-3"
                                    onClick={handlePaymentRetry}
                                >
                                    <i className="bi bi-wallet2 me-2"></i> 
                                    Pay with eSewa
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="card shadow mb-4">
                        <div className="card-header bg-light text-dark fw-bold">Order Status</div>
                        <div className="card-body">
                            <p>
                                <span 
                                    className={`fw-bold ${
                                        order.orderStatus === 'Delivered' ? 'text-success' : 
                                        order.orderStatus === 'Processing' ? 'text-warning' : 
                                        order.orderStatus === 'Cancelled' ? 'text-danger' : ''
                                    }`}
                                    style={order.orderStatus === 'Shipped' ? { color: '#ff69b4' } : {}}
                                >
                                    {order.orderStatus}
                                </span>
                            </p>
                            {order.orderStatus === 'Processing' && (
                                <button 
                                    className="btn btn-outline-danger btn-sm mt-2"
                                    onClick={cancelOrder}
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                     {/* Order Items */}
                    <div className="card shadow mb-4">
                        <div className="card-header bg-light text-dark fw-bold">Order Items</div>
                        <div className="card-body">
                            {order.orderItems && order.orderItems.map(item => (
                                <div key={item.product} className="row mb-3 align-items-center">
                                    <div className="col-4">
                                        <img src={item.image} alt={item.name} className="img-fluid" />
                                    </div>
                                    <div className="col-8">
                                        <Link to={`/productdetails/${item.product}`} className="text-decoration-none text-dark">
                                            {item.name}
                                        </Link>
                                        <p className="mb-0 text-muted">
                                            {item.quantity} x NRS {item.price} = <b>NRS {item.quantity * item.price}</b>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails