import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
    <hr/>
   <div className="container">
  <footer className="py-5">
    <div className="row">
      <div className="col-6 col-md-2 mb-3">
        <h5>Section</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2"><Link to="/" className="nav-link p-0 text-body-secondary">Home</Link></li>
          <li className="nav-item mb-2"><Link to="/features" className="nav-link p-0 text-body-secondary">Features</Link></li>
          <li className="nav-item mb-2"><Link to="/faqs" className="nav-link p-0 text-body-secondary">FAQs</Link></li>
          <li className="nav-item mb-2"><Link to="/about" className="nav-link p-0 text-body-secondary">About</Link></li>
          <li className="nav-item mb-2"><Link to="/contact" className="nav-link p-0 text-body-secondary">Contact Us</Link></li>
        </ul>
      </div>

       

     
    </div>

    <div className="d-flex flex-column align-items-center py-4 my-4 border-top">
      <p className="mb-0">© 2024 BagShop, Inc. All rights reserved.</p>
      <ul className="list-unstyled d-flex mb-0 mt-3">
        <li className="ms-3"><i className='bi bi-twitter-x'></i></li>
        <li className="ms-3"><i className='bi bi-facebook'></i></li>
        <li className="ms-3"><i className="bi bi-quora"></i></li>
      </ul>
    </div>
  </footer>
</div>
    </>
  )
}

export default Footer