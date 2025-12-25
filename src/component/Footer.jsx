import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white text-dark pt-5 mt-5 border-top shadow-sm">
      <div className="container">
        <div className="row g-4 pb-5">
          {/* Brand Section */}
          <div className="col-md-4">
            <h4 className="fw-bold text-warning mb-3">
              <i className="bi bi-backpack4 me-2"></i>BagShop
            </h4>
            <p className="text-muted small pe-md-5">
              Premium quality bags for every occasion. From professional backpacks to trendy handbags, 
              we provide the best collection in Nepal.
            </p>
            <div className="d-flex gap-3 fs-5 mt-3">
              <a href="#" className="text-warning opacity-75 hover-warning transition-all"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-warning opacity-75 hover-warning transition-all"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-warning opacity-75 hover-warning transition-all"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-warning opacity-75 hover-warning transition-all"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 col-6">
            <h6 className="text-uppercase fw-bold mb-3 text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none small hover-warning">Home</Link></li>
              <li className="mb-2"><Link to="/products" className="text-muted text-decoration-none small hover-warning">Products</Link></li>
              <li className="mb-2"><Link to="/about" className="text-muted text-decoration-none small hover-warning">Our Story</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-muted text-decoration-none small hover-warning">Contact Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-2 col-6">
            <h6 className="text-uppercase fw-bold mb-3 text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/faqs" className="text-muted text-decoration-none small hover-warning">FAQs</Link></li>
              <li className="mb-2"><Link to="/features" className="text-muted text-decoration-none small hover-warning">Features</Link></li>
              <li className="mb-2"><Link to="/shipping-policy" className="text-muted text-decoration-none small hover-warning">Shipping Policy</Link></li>
              <li className="mb-2"><Link to="/privacy-policy" className="text-muted text-decoration-none small hover-warning">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h6 className="text-uppercase fw-bold mb-3 text-secondary" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Contact Details</h6>
            <ul className="list-unstyled text-muted small">
              <li className="mb-2"><i className="bi bi-geo-alt text-warning me-2"></i> Kathmandu, Nepal</li>
              <li className="mb-2"><i className="bi bi-telephone text-warning me-2"></i> +977 9800000000</li>
              <li className="mb-2"><i className="bi bi-envelope text-warning me-2"></i> support@bagshop.com</li>
            </ul>
            <div className="mt-4 bg-light p-3 rounded border">
              <p className="mb-2 small fw-bold">Subscribe to our newsletter</p>
              <div className="input-group input-group-sm">
                <input type="email" className="form-control bg-white border-secondary text-dark shadow-none" placeholder="Email Address" />
                <button className="btn btn-warning fw-bold">Join</button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-top py-4 text-center">
          <p className="mb-0 text-muted small">
            &copy; {new Date().getFullYear()} <span className="text-warning fw-bold">BagShop, Inc.</span> All rights reserved.
          </p>
        </div>
      </div>

      <style>
        {`
          .hover-warning:hover {
            color: #ffc107 !important;
            transition: 0.2s ease-in-out;
          }
          .transition-all {
            transition: all 0.3s ease;
          }
        `}
      </style>
    </footer>
  )
}

export default Footer
