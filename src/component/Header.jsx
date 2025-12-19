import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Header = () => {
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/logout`, { withCredentials: true })
      localStorage.removeItem('user')
      setUser(null)
      toast.success("Logged out successfully")
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

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

        <div className="text-end d-flex align-items-center">
          {!user ? (
            <>
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
            </>
          ) : (
            <div 
                className="dropdown text-end position-relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
            >
              <Link to="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" aria-expanded={showDropdown}>
                {user.avatar && user.avatar.url && user.avatar.url !== "profilepicUrl" ? (
                    <img src={user.avatar.url} alt="mdo" width="32" height="32" className="rounded-circle" />
                ) : (
                    <div className="rounded-circle bg-warning d-flex justify-content-center align-items-center" style={{width: '32px', height: '32px', color: 'black'}}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                )}
              </Link>
              <ul 
                className={`dropdown-menu text-small ${showDropdown ? 'show' : ''}`}
                style={showDropdown ? { display: 'block', position: 'absolute', right: 0, top: '100%', zIndex: 1000 } : {}}
              >
                <li><Link className="dropdown-item" to="/user">Profile (Change Password/Name)</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Sign out</button></li>
              </ul>
            </div>
          )}
        </div>
        
        <div><Link to="/cart" className="nav-link px-2 text-white">
             <br/>
             <i className="bi bi-cart fs-2 cart-icon"></i>
            </Link></div>
        
      </div>
    </div>
  </header>
    </>
  )
}

export default Header