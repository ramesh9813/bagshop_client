import React from 'react'
import { Link } from 'react-router-dom'

const AdminSidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{width: '280px', minHeight: '100vh'}}>
    <Link to="/admin/dashboard" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <span className="fs-4">Admin Panel</span>
    </Link>
    <hr />
    <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item">
        <Link to="/admin/dashboard" className="nav-link text-white" aria-current="page">
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/admin/products" className="nav-link text-white">
          <i className="bi bi-grid me-2"></i>
          Products
        </Link>
      </li>
      <li>
        <Link to="/admin/orders" className="nav-link text-white">
          <i className="bi bi-table me-2"></i>
          Orders
        </Link>
      </li>
      <li>
        <Link to="/admin/users" className="nav-link text-white">
         <i className="bi bi-people-fill me-2"></i>
           Users
        </Link>
      </li>
      <li>
        <Link to="/admin/inquiries" className="nav-link text-white">
         <i className="bi bi-chat-left-text-fill me-2"></i>
           Inquiries
        </Link>
      </li>
    </ul>
    <hr />
  </div>
  )
}

export default AdminSidebar