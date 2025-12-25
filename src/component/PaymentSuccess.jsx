import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [status, setStatus] = useState("Verifying...");
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const encodedData = searchParams.get('data');
            
            if (!encodedData) {
                setStatus("Failed");
                setError("No payment data found.");
                return;
            }

            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/payment/verify?encodedData=${encodedData}`,
                    { withCredentials: true }
                );

                if (data.success) {
                    // Clear Cart from Local Storage and Redux
                    localStorage.removeItem('cart');
                    dispatch({ type: 'SET_CART_COUNT', payload: 0 });

                    setStatus("Success");
                } else {
                    setStatus("Failed");
                    setError("Verification Failed from Backend");
                }
            } catch (err) {
                setStatus("Failed");
                setError(err.response?.data?.message || "Verification Request Failed");
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="container mt-5 text-center">
            <div className="card p-5 shadow">
                {status === "Verifying..." && (
                    <>
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h3 className="mt-3">Verifying Payment...</h3>
                    </>
                )}

                {status === "Success" && (
                    <>
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }}></i>
                        <h2 className="text-success mt-3">Payment Successful!</h2>
                        <p className="lead">Your order has been placed successfully.</p>
                        <Link to="/" className="btn btn-outline-warning mt-3">Go to Home</Link>
                    </>
                )}

                {status === "Failed" && (
                    <>
                        <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: "4rem" }}></i>
                        <h2 className="text-danger mt-3">Payment Failed!</h2>
                        <p className="lead">{error}</p>
                        <Link to="/cart" className="btn btn-warning mt-3">Try Again</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
