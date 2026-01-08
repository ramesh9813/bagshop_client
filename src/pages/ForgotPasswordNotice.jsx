import React from 'react';
import { useLocation } from 'react-router-dom';
import EmailNotice from '../component/EmailNotice';

const ForgotPasswordNotice = () => {
    const location = useLocation();
    const email = location.state?.email || "your email";

    return (
        <EmailNotice
            subheading="We've sent a password reset link to:"
            email={email}
            description="Open the email and follow the link to reset your password."
            footerText="Didn't receive the email? Check your spam folder or try again."
        />
    );
};

export default ForgotPasswordNotice;
