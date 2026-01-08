import React from 'react';
import { useLocation } from 'react-router-dom';
import EmailNotice from '../component/EmailNotice';

const VerifyEmailNotice = () => {
    const location = useLocation();
    const email = location.state?.email || "your email";

    return (
        <EmailNotice
            subheading="We've sent a verification link to:"
            email={email}
            description="Please click the link in the email to verify your account and start shopping!"
            footerText="Didn't receive the email? Check your spam folder or try registering again."
        />
    );
};

export default VerifyEmailNotice;
