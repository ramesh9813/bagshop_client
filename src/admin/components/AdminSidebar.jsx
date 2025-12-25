import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminSidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user } = useSelector(state => state.auth)

  const sidebarStyle = {
    width: isCollapsed ? '80px' : '280px',
    minHeight: '100vh',
    transition: 'width 0.3s',
    position: 'fixed',
    zIndex: 1000
  }

  const linkClass = `nav-link text-white ${isCollapsed ? 'text-center p-2' : ''}`
  const iconClass = `bi ${isCollapsed ? 'fs-4' : 'me-2'}`

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={sidebarStyle}>
    <div className="d-flex align-items-center justify-content-between mb-3 mb-md-0 text-white text-decoration-none">
      {!isCollapsed && <span className="fs-4">Admin Panel</span>}
      <button className="btn btn-dark btn-sm" onClick={toggleSidebar}>
        <i className={`bi ${isCollapsed ? 'bi-list fs-4' : 'bi-chevron-left'}`}></i>
      </button>
    </div>
    <hr />
    <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item">
        <Link to="/admin/dashboard" className={linkClass} aria-current="page" title="Dashboard">
          <i className={`${iconClass} bi-speedometer2`}></i>
          {!isCollapsed && "Dashboard"}
        </Link>
      </li>
      <li>
        <Link to="/admin/products" className={linkClass} title="Products">
          <i className={`${iconClass} bi-grid`}></i>
          {!isCollapsed && "Products"}
        </Link>
      </li>
      <li>
        <Link to="/admin/orders" className={linkClass} title="Orders">
          <i className={`${iconClass} bi-table`}></i>
          {!isCollapsed && "Orders"}
        </Link>
      </li>
      <li>
        <Link to="/admin/users" className={linkClass} title="Users">
         <i className={`${iconClass} bi-people-fill`}></i>
           {!isCollapsed && "Users"}
        </Link>
      </li>
      <li>
        <Link to="/admin/inquiries" className={linkClass} title="Inquiries">
         <i className={`${iconClass} bi-chat-left-text-fill`}></i>
           {!isCollapsed && "Inquiries"}
        </Link>
      </li>

      {/* Owner Specific Tabs */}
      {user?.role === 'owner' && (
        <>
          <li className="nav-item mt-3 px-3">
            {!isCollapsed ? (
                <span className="text-secondary small text-uppercase">Owner Analysis</span>
            ) : (
                <hr className="text-secondary" />
            )}
          </li>
          <li>
            <Link to="/admin/analytics" className={linkClass} title="Sales Analysis">
              <i className={`${iconClass} bi-bar-chart-fill text-warning`}></i>
              {!isCollapsed && "Sales Analysis"}
            </Link>
          </li>
          <li>
            <Link to="/admin/activity" className={linkClass} title="Activity Log">
              <i className={`${iconClass} bi-eye-fill text-warning`}></i>
              {!isCollapsed && "Activity Log"}
            </Link>
          </li>
          <li>
            <Link to="/admin/chat" className={linkClass} title="AI Inventory Chat">
              <i className={`${iconClass} bi-robot text-warning`}></i>
              {!isCollapsed && "AI Inventory Chat"}
            </Link>
          </li>
        </>
      )}
    </ul>
    <hr />
  </div>
  )
}

export default AdminSidebar