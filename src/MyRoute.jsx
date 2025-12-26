import React from 'react'
import { BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom'
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
import UserProfile from './pages/UserProfile'
import PaymentSuccess from './component/PaymentSuccess'

// Admin Imports
import AdminRoute from './admin/AdminRoute'
import AdminLayout from './admin/components/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import ProductList from './admin/pages/ProductList'
import AddProduct from './admin/pages/AddProduct'
import EditProduct from './admin/pages/EditProduct'
import OrderList from './admin/pages/OrderList'
import Users from './admin/pages/Users'
import InquiryList from './admin/pages/InquiryList'
import InquiryDetails from './admin/pages/InquiryDetails'
import OwnerAnalytics from './admin/pages/OwnerAnalytics'
import ActivityLogs from './admin/pages/ActivityLogs'
import ChatWithInventory from './admin/pages/ChatWithInventory'
import MyOrders from './pages/MyOrders'
import OrderDetails from './pages/OrderDetails'
import About from './pages/About'
import Features from './pages/Features'
import FAQs from './pages/FAQs'
import ContactUs from './pages/ContactUs'
import NotFound from './pages/NotFound'
import VerifyEmailNotice from './pages/VerifyEmailNotice'
import VerifyEmailAction from './pages/VerifyEmailAction'
import ShippingPolicy from './pages/ShippingPolicy'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

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
              <Route path='password/forgot' element={<ForgotPassword/>}/>
              <Route path='password/reset/:token' element={<ResetPassword/>}/>
              <Route path='register' element={<Register/>}/>
              <Route path='verify-email-notice' element={<VerifyEmailNotice/>}/>
              <Route path='verify-email/:token' element={<VerifyEmailAction/>}/>
              <Route path='user' element={<UserProfile/>}/>
              <Route path='orders/me' element={<MyOrders/>}/>
              <Route path='order/:id' element={<OrderDetails/>}/>
              <Route path='payment/success' element={<PaymentSuccess/>}/>
              <Route path='about' element={<About/>}/>
              <Route path='features' element={<Features/>}/>
              <Route path='faqs' element={<FAQs/>}/>
              <Route path='contact' element={<ContactUs/>}/>
              <Route path='shipping-policy' element={<ShippingPolicy/>}/>
              <Route path='privacy-policy' element={<PrivacyPolicy/>}/>
              
              <Route path='redux' element={<CartItems/>}/>
              <Route path='*' element={<NotFound/>}/>
            </Route>

            {/* Admin Routes */}
            <Route path='/admin' element={<AdminRoute/>}>
              <Route element={<AdminLayout/>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path='dashboard' element={<Dashboard/>}/>
                <Route path='products' element={<ProductList/>}/>
                <Route path='product/add' element={<AddProduct/>}/>
                <Route path='product/edit/:id' element={<EditProduct/>}/>
                <Route path='orders' element={<OrderList/>}/>
                <Route path='users' element={<Users/>}/>
                <Route path='inquiries' element={<InquiryList/>}/>
                <Route path='inquiry/:id' element={<InquiryDetails/>}/>
                <Route path='analytics' element={<OwnerAnalytics/>}/>
                <Route path='activity' element={<ActivityLogs/>}/>
                <Route path='chat' element={<ChatWithInventory/>}/>
              </Route>
            </Route>
        </Routes>
    </Router>
    </>
  )
}

export default MyRoute