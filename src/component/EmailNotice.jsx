import React from 'react';
import { Link } from 'react-router-dom';

const EmailNotice = ({
    heading = "Check Your Email",
    subheading,
    email = "your email",
    description,
    ctaText = "Go to Login",
    ctaTo = "/login",
    footerText,
}) => {
    return (
        <div className="container py-5 my-5 text-center">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="mb-4">
                        <i className="bi bi-envelope-check text-warning" style={{ fontSize: '10rem' }}></i>
                    </div>
                    <h1 className="fw-bold text-dark">{heading}</h1>
                    {subheading && <h4 className="mb-4 fw-light text-muted">{subheading}</h4>}
                    <div className="p-3 bg-light rounded border mb-4">
                        <strong className="text-primary">{email}</strong>
                    </div>
                    {description && (
                        <p className="lead mb-5 text-secondary">
                            {description}
                        </p>
                    )}
                    <div className="text-center">
                        <Link to={ctaTo} className="btn btn-warning btn-lg px-5 fw-bold text-dark">
                            {ctaText}
                        </Link>
                    </div>
                    {footerText && (
                        <p className="mt-4 text-muted small">
                            {footerText}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailNotice;
