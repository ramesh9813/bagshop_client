import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { token } = useParams()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/password/reset/${token}`,
                { password, confirmPassword },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )

            if (data.success) {
                toast.success("Password Updated Successfully")
                navigate('/login')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Password Reset Failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-sm border-0 p-4">
                        <h2 className="text-center mb-4">Reset Password</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                    <span
                                        className="input-group-text"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </span>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-group">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                    <span
                                        className="input-group-text"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </span>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-warning w-100 fw-bold" 
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
