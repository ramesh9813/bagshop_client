import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container py-5 my-5 text-center">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="mb-4">
                        <i className="bi bi-exclamation-octagon text-warning" style={{ fontSize: '10rem' }}></i>
                    </div>
                    <h1 className="display-1 fw-bold text-dark">404</h1>
                    <h2 className="mb-4 fw-light text-muted">Oops! The bag you're looking for isn't here.</h2>
                    <p className="lead mb-5 text-secondary">
                        The page you are looking for might have been removed, had its name changed, 
                        or is temporarily unavailable.
                    </p>
                    <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                        <Link to="/" className="btn btn-warning btn-lg px-5 fw-bold text-dark">
                            Back to Homepage
                        </Link>
                        <Link to="/products" className="btn btn-outline-dark btn-lg px-5">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
