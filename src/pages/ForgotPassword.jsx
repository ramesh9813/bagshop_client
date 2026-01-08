import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/password/forgot`,
                { email },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )

            if (data.success) {
                navigate('/password/forgot/notice', { state: { email } })
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send reset email")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-sm border-0 p-4">
                        <h2 className="text-center mb-4">Forgot Password</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Enter Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-warning w-100 fw-bold" 
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
