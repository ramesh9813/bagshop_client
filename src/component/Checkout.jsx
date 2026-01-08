import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [shippingPrice, setShippingPrice] = useState(100); // Default shipping cost
    const [showMap, setShowMap] = useState(false);
    const [position, setPosition] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('eSewa');
    const [processing, setProcessing] = useState(false);
    const hasFetchedDefault = useRef(false);

    useEffect(() => {
        if (location.state && location.state.useDefault && !hasFetchedDefault.current) {
            fetchDefaultAddress();
            hasFetchedDefault.current = true;
        }
    }, [location.state]);

    const fetchDefaultAddress = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/me`, 
                { withCredentials: true }
            );
            if (data.success && data.user.shippingInfo) {
                setAddress(data.user.shippingInfo.address || '');
                setCity(data.user.shippingInfo.city || '');
                setPhoneNo(data.user.shippingInfo.phoneNo || '');
                toast.success("Default details loaded!");
            } else {
                toast.info("No default details found in your profile.");
            }
        } catch (error) {
            console.error(error);
        }
    }

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

    const submitHandler = async (e, forcedMethod = null) => {
        if (e) e.preventDefault();
        
        const methodToUse = forcedMethod || paymentMethod;

        // Nepali Phone Number Validation
        const phoneRegex = /^(97|98)\d{8}$/;
        if (!phoneRegex.test(phoneNo)) {
            setPhoneError("Check your number");
            toast.error("Please enter a valid Nepali phone number.");
            return;
        }

        if (phoneError) return;

        setProcessing(true);

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
                    status: "Pending",
                    method: methodToUse
                }
            };

            // 1. Create Order
            const { data: orderResponse } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/order/new`,
                orderData,
                config
            );

            if (orderResponse.success) {
                // 1.5 Auto-save shipping info to user profile for next time (non-blocking)
                axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/me/update`,
                    {
                        shippingInfo: {
                            address,
                            city,
                            phoneNo
                        }
                    },
                    config
                ).catch((updateError) => {
                    console.error("Failed to auto-save shipping info", updateError);
                });

                // Handle Logic based on Payment Method
                if (methodToUse === 'COD') {
                    // Clear Cart from Local Storage and Redux
                    localStorage.removeItem('cart');
                    dispatch({ type: 'SET_CART_COUNT', payload: 0 });
                    
                    toast.success("Order Placed Successfully!");
                    navigate('/orders/me');
                } else {
                    // 2. Initiate Payment (eSewa)
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
            }

        } catch (error) {
            setProcessing(false);
            toast.error(error.response?.data?.message || "Failed to place order");
        }
    };

    // Component to handle map clicks
    const LocationMarker = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setPosition(e.latlng);
                
                try {
                    // Reverse geocoding using OpenStreetMap Nominatim
                    const { data } = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                    );
                    
                    if (data && data.address) {
                        const street = data.address.road || data.address.pedestrian || data.address.suburb || data.address.neighbourhood || '';
                        const cityVal = data.address.city || data.address.town || data.address.village || data.address.county || '';
                        
                        setAddress(street ? `${street}, ${data.display_name.split(',')[0]}` : data.display_name);
                        setCity(cityVal);
                        toast.success("Address selected from map!");
                        setTimeout(() => setShowMap(false), 500); // Close map after short delay
                    }
                } catch (error) {
                    toast.error("Failed to get address from location");
                }
            },
        });

        return position === null ? null : (
            <Marker position={position}></Marker>
        )
    }

    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow p-4">
                            <h2 className="text-center mb-4">Shipping Details</h2>
                            <form onSubmit={submitHandler}>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                        />
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={() => setShowMap(true)}
                                        >
                                            <i className="bi bi-geo-alt-fill"></i> Pick on Map
                                        </button>
                                    </div>
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
                                        type="tel"
                                        className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                                        id="phoneNo"
                                        value={phoneNo}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setPhoneNo(val);
                                            const phoneRegex = /^(97|98)\d{8}$/;
                                            if (val.length > 0 && !phoneRegex.test(val)) {
                                                setPhoneError("Check your number (Must enter cell phone number)");
                                            } else {
                                                setPhoneError("");
                                            }
                                        }}
                                        placeholder="98XXXXXXXX"
                                        required
                                    />
                                    {phoneError && <div className="text-danger small mt-1">{phoneError}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Shipping Charges</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={`NRS ${shippingPrice}`}
                                        disabled
                                    />
                                </div>

                                <div className="d-flex gap-2">
                                    <button 
                                        type="button" 
                                        className="btn btn-warning w-50 btn-lg d-flex align-items-center justify-content-center"
                                        onClick={(e) => {
                                            setPaymentMethod('eSewa');
                                            submitHandler(e, 'eSewa');
                                        }}
                                        disabled={processing}
                                    >
                                        {processing && paymentMethod === 'eSewa' ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        ) : (
                                            <i className="bi bi-wallet2 me-2"></i>
                                        )}
                                        {processing && paymentMethod === 'eSewa' ? 'Processing...' : 'Pay with eSewa'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary w-50 btn-lg d-flex align-items-center justify-content-center"
                                        onClick={(e) => {
                                            setPaymentMethod('COD');
                                            submitHandler(e, 'COD');
                                        }}
                                        disabled={processing}
                                    >
                                        {processing && paymentMethod === 'COD' ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        ) : (
                                            <i className="bi bi-cash-stack me-2"></i>
                                        )}
                                        {processing && paymentMethod === 'COD' ? 'Processing...' : 'Cash on Delivery'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Modal Overlay */}
            {showMap && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 9999,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <div 
                        style={{
                            width: '70%',
                            height: '70%',
                            backgroundColor: 'white',
                            position: 'relative',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        <button 
                            onClick={() => setShowMap(false)}
                            className="btn btn-danger btn-sm"
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                zIndex: 1000
                            }}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                        
                        <MapContainer 
                            center={[27.7172, 85.3240]} // Default to Kathmandu
                            zoom={13} 
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker />
                        </MapContainer>
                    </div>
                </div>
            )}
        </>
    );
};

export default Checkout;
