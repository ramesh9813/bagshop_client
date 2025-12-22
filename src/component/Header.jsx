import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'

const Header = () => {
  const { user } = useSelector(state => state.auth)
  const { cartCount } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [keyword, setKeyword] = useState("");

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword}`);
    } else {
      navigate('/products');
    }
  };

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 100) { 
        // if scroll down hide the navbar
        setShowHeader(false); 
      } else { 
        // if scroll up show the navbar
        setShowHeader(true);  
      }
      setLastScrollY(window.scrollY); 
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/logout`, { withCredentials: true })
      localStorage.removeItem('user')
      dispatch({ type: 'LOGOUT' })
      toast.success("Logged out successfully")
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
    <header 
      className={`text-dark shadow-sm ${showHeader ? 'sticky-top' : ''}`} 
      style={{
        transition: 'transform 0.3s ease-in-out',
        transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1030,
        backgroundColor: '#ffffff'
      }}
    >
    <div className="container" style={{"height":"5rem"}}>
      <div className="d-flex align-items-center justify-content-between h-100">
        <Link to="/" className="d-flex align-items-center mb-0 text-dark text-decoration-none">
        <h4 className="mb-0"><i className="bi bi-backpack4 me-2"></i>BagShop</h4>
        </Link>
    
        <div className="d-flex align-items-center">
          <form className="mb-0 me-3 d-none d-md-block" role="search" onSubmit={searchHandler}>
            <input 
              type="search" 
              className="form-control bg-light" 
              placeholder="Search..." 
              aria-label="Search" 
              name='search-item'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>

          <div className="text-end d-flex align-items-center me-3">
            {!user ? (
              <>
                <button type="button" className="btn btn-outline-warning me-2">
                <Link to="/login" style={{ textDecoration: "none",color:"black" }}>
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
                <Link to="#" className="d-block link-body-emphasis text-decoration-none" aria-expanded={showDropdown}>
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
                  {user && user.role === 'admin' && (
                    <li><Link className="dropdown-item" to="/admin">Dashboard </Link></li>
                  )}
                  <li><Link className="dropdown-item" to="/orders/me">My Orders</Link></li>
                  <li><Link className="dropdown-item" to="/user">Profile</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Sign out</button></li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="d-flex align-items-center">
            <Link to="/cart" className="nav-link p-0 text-dark fs-6 position-relative">
               <i className="bi bi-cart fs-2 cart-icon"></i>
               {cartCount > 0 && (
                 <span 
                   className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                   style={{ 
                     fontSize: '0.65rem', 
                     backgroundColor: '#2ecc71', // Vibrant emerald green
                     color: '#000', // Black text for high contrast
                     fontWeight: 'bold',
                     border: '1px solid #fff' // Adding a thin white border to pop out
                   }}
                 >
                   {cartCount}
                 </span>
               )}
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  </header>
  <div style={{height: "5rem"}}></div>
    </>
  )
}

export default Header