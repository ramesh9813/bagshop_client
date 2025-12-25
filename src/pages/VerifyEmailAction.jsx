import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Spinner from '../component/Spinner';

const VerifyEmailAction = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const verificationAttempted = useRef(false);

    useEffect(() => {
        const verify = async () => {
            if (verificationAttempted.current) return;
            verificationAttempted.current = true;

            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/verify-email/${token}`);
                
                if (data.success) {
                    toast.success("Email Verified Successfully! Welcome to BagShop.");
                    localStorage.setItem('user', JSON.stringify(data.user));
                    dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
                    navigate('/');
                }
            } catch (error) {
                // Only show error if it's not a "token already verified" type of situation caused by race conditions
                // However, since we are blocking double calls with useRef, any error here is a genuine failure.
                toast.error(error.response?.data?.message || "Verification failed. The link may be invalid or expired.");
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            verify();
        }
    }, [token, navigate, dispatch]);

    if (loading) return <Spinner />;

    return null;
};

export default VerifyEmailAction;
