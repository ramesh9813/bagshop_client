import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'

const AdminHeader = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const getTitle = (path) => {
        if (path.includes('/admin/dashboard')) return 'Dashboard'
        if (path.includes('/admin/product/add')) return 'Add Product'
        if (path.includes('/admin/products')) return 'Products'
        if (path.includes('/admin/orders')) return 'Orders'
        if (path.includes('/admin/users')) return 'Users'
        if (path.includes('/admin/inquiries')) return 'Inquiries'
        if (path.includes('/admin/analytics')) return 'Sales Analysis'
        if (path.includes('/admin/activity')) return 'Activity Log'
        if (path.includes('/admin/chat')) return 'AI Assistant'
        return 'Admin Panel'
    }

    const handleLogout = async () => {
        try {
          await axios.get(`${import.meta.env.VITE_API_BASE_URL}/logout`, { withCredentials: true })
          localStorage.removeItem('user')
          localStorage.removeItem('cart') // Clear cart
          dispatch({ type: 'LOGOUT' })
          dispatch({ type: 'SET_CART_COUNT', payload: 0 }) // Reset count
          toast.error("Logged out successfully")
          navigate('/')
        } catch (error) {
          console.error(error)
        }
      }

  return (
    <header className="p-3 bg-light border-bottom">
    <div className="container-fluid">
      <div className="d-flex flex-wrap align-items-center justify-content-between">
        <h1 className="h2 mb-0">{getTitle(location.pathname)}</h1>
        
        <div className="text-end">
          <button type="button" onClick={handleLogout} className="btn btn-outline-dark me-2">Logout</button>
        </div>
      </div>
    </div>
  </header>
  )
}

export default AdminHeader