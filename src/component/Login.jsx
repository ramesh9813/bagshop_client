import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch } from 'react-redux'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
        toast.success("Login Successful!")
        localStorage.setItem('user', JSON.stringify(data.user))
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user })
        setTimeout(() => {
            navigate('/')
        }, 1500)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed")
    }
  }

  return (
    <>
    <ToastContainer theme='colored' position='top-center'/>
    <div className="container login">
        <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

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
        <div className="form-floating">
        <input 
            type="password" 
            className="form-control" 
            id="floatingPassword" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="form-check text-start my-3">
        <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
        <label className="form-check-label" htmlFor="flexCheckDefault">
            Remember me
        </label>
        </div>
        <button className="btn btn-warning w-100 py-2" type="submit">Sign in</button>
        <p className="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
    </form>
    </div>
    </>
  )
}

export default Login