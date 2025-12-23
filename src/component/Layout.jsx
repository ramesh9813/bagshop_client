import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShortcutOverlay from './ShortcutOverlay';

const Layout = () => {
  return (
    <>
      <Header />
      <ShortcutOverlay />
      <ToastContainer 
        position="top-right" 
        autoClose={1000} 
        theme="colored"  
        style={{ zIndex: 9999, top: '5.5rem', width: '224px' }} 
      />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout