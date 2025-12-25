import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const VerifyEmailNotice = () => {
    const location = useLocation();
    const email = location.state?.email || "your email";

    return (
        <div className="container py-5 my-5 text-center">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="mb-4">
                        <i className="bi bi-envelope-check text-warning" style={{ fontSize: '10rem' }}></i>
                    </div>
                    <h1 className="fw-bold text-dark">Check Your Email</h1>
                    <h4 className="mb-4 fw-light text-muted">We've sent a verification link to:</h4>
                    <div className="p-3 bg-light rounded border mb-4">
                        <strong className="text-primary">{email}</strong>
                    </div>
                    <p className="lead mb-5 text-secondary">
                        Please click the link in the email to verify your account and start shopping!
                    </p>
                    <div className="text-center">
                        <Link to="/login" className="btn btn-warning btn-lg px-5 fw-bold text-dark">
                            Go to Login
                        </Link>
                    </div>
                    <p className="mt-4 text-muted small">
                        Didn't receive the email? Check your spam folder or try registering again.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailNotice;
