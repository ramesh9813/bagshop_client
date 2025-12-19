import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [shippingPrice, setShippingPrice] = useState(100); // Default shipping cost

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

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            };

            const orderData = {
                shippingInfo: {
                    address,
                    city,
                    phoneNo
                },
                shippingPrice,
                paymentInfo: {
                    status: "Pending" 
                }
            };

            // 1. Create Order
            const { data: orderResponse } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/order/new`,
                orderData,
                config
            );

            if (orderResponse.success) {
                // 2. Initiate Payment
                const { data: paymentResponse } = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/payment/initiate`,
                    { orderId: orderResponse.order._id },
                    config
                );

                if (paymentResponse.success) {
                    // 3. Redirect to eSewa
                    submitEsewaForm(paymentResponse.payment_url, paymentResponse.formData);
                }
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order");
        }
    };

    return (
        <>
            <ToastContainer theme='colored' position='top-center' />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow p-4">
                            <h2 className="text-center mb-4">Shipping Details</h2>
                            <form onSubmit={submitHandler}>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phoneNo" className="form-label">Phone Number</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="phoneNo"
                                        value={phoneNo}
                                        onChange={(e) => setPhoneNo(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Shipping Charges</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={`$${shippingPrice}`}
                                        disabled
                                    />
                                </div>

                                <button type="submit" className="btn btn-warning w-100 btn-lg">Place Order</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;