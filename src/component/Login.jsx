import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch } from 'react-redux'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Important for cookies
      }
      
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        { email, password },
        config
      )

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user })
        navigate('/')
        toast.success("Login Successful!")
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed")
    }
  }

  return (
    <>
    <div className="container login">
        <div className="card shadow-sm p-4 mt-5 border-0">
            <form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 fw-bold text-center">Sign In</h1>

            <div className="form-floating mb-3">
            <input 
                type="email" 
                className="form-control" 
                id="floatingInput" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating position-relative">
            <input 
                type={showPassword ? "text" : "password"}
                className="form-control" 
                id="floatingPassword" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <label htmlFor="floatingPassword">Password</label>
            <span 
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute top-50 end-0 translate-middle-y me-3"
                style={{ cursor: 'pointer', zIndex: 10 }}
            >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </span>
            </div>

            <div className="form-check text-start my-3">
            <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
                Remember me
            </label>
            </div>
            
            <button className="btn btn-warning w-100 py-2 fw-bold text-dark" type="submit">Sign in</button>
            
            <div className="text-center mt-4">
                <p className="text-muted small">
                    Don't have an account? <Link to="/register" className="text-warning fw-bold text-decoration-none">Register Here</Link>
                </p>
            </div>
            
            <p className="mt-3 mb-0 text-center text-body-secondary small">&copy; 2024 BagShop</p>
        </form>
        </div>
    </div>
    </>
  )
}

export default Login