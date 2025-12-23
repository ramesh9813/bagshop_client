import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const AdminRoute = () => {
    const { user } = useSelector(state => state.auth)

    if (!user) {
        toast.error("Please login to access this resource")
        return <Navigate to="/login" />
    }

    if (!['admin', 'owner'].includes(user.role)) {
        toast.error("Access denied: Admins/Owners only")
        return <Navigate to="/" />
    }

    return <Outlet />
}

export default AdminRoute