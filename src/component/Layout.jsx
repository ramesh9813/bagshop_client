import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} theme="colored"  style={{ zIndex: 9999 }} />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout