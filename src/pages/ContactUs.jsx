import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ContactUs = () => {
    const { user } = useSelector(state => state.auth);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        product: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`)
            .then(res => {
                setProducts(res.data.products);
            })
            .catch(error => {
                console.error("Error fetching products", error);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send this data to your backend
        console.log('Form Submitted:', formData);
        toast.success("Thank you for your inquiry! We will contact you shortly.");
        setFormData({
            name: user ? user.name : '',
            email: user ? user.email : '',
            product: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4 fw-bold">Contact Us</h2>
                            <p className="text-center text-muted mb-5">
                                Have a question about a product? Need help with your order? 
                                Fill out the form below and our team will get back to you as soon as possible.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="name" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            id="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="product" className="form-label">Product Inquiry (Optional)</label>
                                    <select 
                                        className="form-select" 
                                        id="product" 
                                        name="product" 
                                        value={formData.product} 
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a product...</option>
                                        {products.map(product => (
                                            <option key={product._id} value={product.name}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="form-text">If you are asking about a specific product, please select it here.</div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="subject" className="form-label">Subject</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="subject" 
                                        name="subject" 
                                        value={formData.subject} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea 
                                        className="form-control" 
                                        id="message" 
                                        name="message" 
                                        rows="5" 
                                        value={formData.message} 
                                        onChange={handleChange} 
                                        required
                                    ></textarea>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
