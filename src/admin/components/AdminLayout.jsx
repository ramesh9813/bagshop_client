import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="d-flex">
        <AdminSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <div className="d-flex flex-column w-100" style={{ marginLeft: isSidebarCollapsed ? '80px' : '280px', transition: 'margin-left 0.3s' }}>
            <AdminHeader />
            <ToastContainer 
              position="top-left" 
              autoClose={1000} 
              theme="colored"
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              style={{ zIndex: 9999, top: '85px', left: '20px' }}
            />
            <div className="container-fluid p-4">
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default AdminLayout
