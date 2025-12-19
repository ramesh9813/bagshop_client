import React from 'react'
import { Link } from 'react-router-dom'
const Header = () => {
  return (
    <>
    <header className=" text-bg-dark">
    <div className="container">
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
        <i className='bi bi-bootstrap bg-warning'></i>
        </Link>
    
        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><Link to="/" className="nav-link px-2 text-white">Home</Link></li>
          <li><Link to="/products" className="nav-link px-2 text-white">Products</Link></li>
          <li><Link to="/cart" className="nav-link px-2 text-white">
            Cart 
            </Link></li>
          <li><Link to="#" className="nav-link px-2 text-white">FAQs</Link></li>
          <li><Link to="#" className="nav-link px-2 text-white">About</Link></li>
        </ul>

        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input type="search" className="form-control form-control-dark text-bg-dark" placeholder="Search..." aria-label="Search" name='search-item'/>
        </form>

        <div className="text-end">
          <button type="button" className="btn btn-outline-warning me-2">
          <Link to="/login" style={{ textDecoration: "none",color:"white" }}>
              Login
          </Link>

            </button>
          <button type="button" className="btn btn-warning">
          <Link to="/register" style={{ textDecoration: "none",color:"white" }}>
              Sign up
          </Link>
          </button>
        </div>
        <div><Link to="/cart" className="nav-link px-2 text-white">
             <br/>
             <i className="bi bi-cart fs-2 cart-icon"></i>
            </Link></div>
        <div className='user-icon'><Link to="/user" className="nav-link px-2 text-white">
             <br/>
             <i className="userIcon">U</i>
            </Link></div>
      </div>
    </div>
  </header>
    </>
  )
}

export default Header