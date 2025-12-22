import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    const location = useLocation();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [shippingPrice, setShippingPrice] = useState(100); // Default shipping cost
    const [showMap, setShowMap] = useState(false);
    const [position, setPosition] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('eSewa');

    useEffect(() => {
        if (location.state && location.state.useDefault) {
            fetchDefaultAddress();
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
                    status: "Pending",
                    method: paymentMethod
                }
            };

            // 1. Create Order
            const { data: orderResponse } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/order/new`,
                orderData,
                config
            );

            if (orderResponse.success) {
                // 1.5 Auto-save shipping info to user profile for next time
                try {
                    await axios.put(
                        `${import.meta.env.VITE_API_BASE_URL}/me/update`,
                        {
                            shippingInfo: {
                                address,
                                city,
                                phoneNo
                            }
                        },
                        config
                    );
                } catch (updateError) {
                    console.error("Failed to auto-save shipping info", updateError);
                }

                // Handle Logic based on Payment Method
                if (paymentMethod === 'COD') {
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
                                        value={`NRS ${shippingPrice}`}
                                        disabled
                                    />
                                </div>

                                <div className="d-flex gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-warning w-50 btn-lg"
                                        onClick={() => setPaymentMethod('eSewa')}
                                    >
                                        Place Order
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-secondary w-50 btn-lg"
                                        onClick={() => setPaymentMethod('COD')}
                                    >
                                        <i className="bi bi-cash-stack me-2"></i> Cash on Delivery
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