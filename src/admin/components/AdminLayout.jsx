import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const AdminLayout = () => {
  return (
    <div className="d-flex">
        <AdminSidebar />
        <div className="d-flex flex-column w-100">
            <AdminHeader />
            <div className="container-fluid p-4">
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default AdminLayout