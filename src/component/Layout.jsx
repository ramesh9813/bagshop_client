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
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout
