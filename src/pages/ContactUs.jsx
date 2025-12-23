import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const ContactUs = () => {
    const { user } = useSelector(state => state.auth);
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        product: '',
        subject: '',
        message: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Initial population of name and email from user context
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    // Handle Pre-filled state from other pages (e.g. Product Detail)
    useEffect(() => {
        if (location.state) {
            const { subject, productName } = location.state;
            if (subject) {
                setFormData(prev => ({ ...prev, subject }));
            }
            if (productName) {
                setFormData(prev => ({ ...prev, product: productName }));
            }
        }
    }, [location.search, location.state]);

    // Fetch product list for the dropdown
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('product', formData.product);
        data.append('subject', formData.subject);
        data.append('message', formData.message);
        if (user) {
            data.append('user', user._id);
        }
        if (image) {
            data.append('image', image);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/inquiry/new`, data, config);
            
            toast.success("Thank you for your inquiry! We will contact you shortly.");
            
            // Reset form fields except name and email
            setFormData(prev => ({
                ...prev,
                product: '',
                subject: '',
                message: ''
            }));
            
            // Clear image state and DOM input
            setImage(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            
        } catch (error) {
            console.error("Error submitting inquiry", error);
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        }
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

                            <form onSubmit={handleSubmit} encType="multipart/form-data">
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

                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">Upload Image (Optional)</label>
                                    <input 
                                        ref={fileInputRef}
                                        type="file" 
                                        className="form-control" 
                                        id="image" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <div className="form-text">e.g., Image of a damaged product. Max size 5MB.</div>
                                    
                                    {imagePreview && (
                                        <div className="mt-3">
                                            <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '200px' }} />
                                        </div>
                                    )}
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-dark btn-lg">Send Message</button>
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