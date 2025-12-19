import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Layout from './component/Layout'
import Homepage from './pages/Homepage'
import Product from './pages/Product'
import ProductDetial from './pages/ProductDetial'
import Cart from './pages/Cart'
import Checkout from './component/Checkout'
import Login from './component/Login'
// import Signup from './component/Signup'
import Register from './pages/Register'
//import Show from './context/Show'
import CartItems from './redux/CartItems'
const MyRoute = () => {
  return (
    <>
    <Router>
        <Routes>
            <Route path='/' element={<Layout/>}>
              <Route index element={<Homepage/>}/>
              <Route path='products' element={<Product/>}/>
              <Route path='/productdetails/:productId' element={<ProductDetial/>}/>
              <Route path='cart' element={<Cart/>}/>
              <Route path='checkout' element={<Checkout/>}/>
              <Route path='login' element={<Login/>}/>
              <Route path='register' element={<Register/>}/>
              
              <Route path='redux' element={<CartItems/>}/>
            </Route>
        </Routes>
    </Router>
    </>
  )
}

export default MyRoute