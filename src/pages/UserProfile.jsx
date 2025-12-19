import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    
    // Profile State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        // Fetch fresh user data
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/me`, { withCredentials: true });
                if (data.success) {
                    setUser(data.user);
                    setName(data.user.name);
                    setEmail(data.user.email);
                    localStorage.setItem('user', JSON.stringify(data.user)); // Keep local storage in sync
                }
            } catch (error) {
                toast.error("Failed to fetch user data. Please login again.");
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/me/update`,
                { name, email },
                config
            );
            
            if (data.success) {
                toast.success("Profile Updated Successfully");
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update Failed");
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/password/update`,
                { oldPassword, newPassword, confirmPassword },
                config
            );

            if (data.success) {
                toast.success("Password Updated Successfully");
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Password Update Failed");
        }
    };

    const handleLogout = async () => {
        try {
          await axios.get(`${import.meta.env.VITE_API_BASE_URL}/logout`, { withCredentials: true })
          localStorage.removeItem('user')
          toast.success("Logged out successfully")
          navigate('/login')
        } catch (error) {
          console.error(error)
        }
      }

    return (
        <div className="container mt-5">
            <ToastContainer theme='colored' position='top-center'/>
            <div className="row justify-content-center">
                <div className="col-md-4 text-center">
                    <div className="card p-3 mb-4">
                        <div className="d-flex justify-content-center mb-3">
                             {user.avatar && user.avatar.url && user.avatar.url !== "profilepicUrl" ? (
                                <img src={user.avatar.url} alt={user.name} className="rounded-circle img-fluid" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                            ) : (
                                <div className="rounded-circle bg-warning d-flex justify-content-center align-items-center" style={{width: '150px', height: '150px', fontSize: '3rem', color: 'black'}}>
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                        </div>
                        <h4>{user.name}</h4>
                        <p className="text-muted">{user.email}</p>
                        <p className="text-muted">Role: {user.role}</p>
                        <p className="text-muted">Joined: {String(user.createdAt).substring(0, 10)}</p>
                        <button className="btn btn-danger w-100 mt-2" onClick={handleLogout}>Logout</button>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card p-4 mb-4">
                        <h3>Update Profile</h3>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                            <button type="submit" className="btn btn-warning">Update Profile</button>
                        </form>
                    </div>

                    <div className="card p-4">
                        <h3>Change Password</h3>
                        <form onSubmit={handleUpdatePassword}>
                            <div className="mb-3">
                                <label className="form-label">Old Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={oldPassword} 
                                    onChange={(e) => setOldPassword(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                />
                            </div>
                            <button type="submit" className="btn btn-danger">Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
