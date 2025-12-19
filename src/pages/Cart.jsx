import React,{useState,useEffect} from 'react'
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Cart = () => {
    const[cartItems, setCartItems]=useState([])

    const fetchCart = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/cart`,
                { withCredentials: true }
            );
            // Assuming backend returns { success: true, cart: { cartItems: [...] } }
            if (data.success) {
                if (data.cart && data.cart.cartItems) {
                    setCartItems(data.cart.cartItems);
                } else if (data.cartItems) {
                    setCartItems(data.cartItems);
                } else {
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error(error);
            // toast.error("Failed to load cart");
        }
    }

    useEffect(()=>{
        fetchCart();
    },[])

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/cart/update`,
                { productId, quantity: newQuantity },
                { withCredentials: true }
            );
            if (data.success) {
                fetchCart();
            }
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    }

    const deleteItem = async (productId) => {
        try {
            const { data } = await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/cart/remove/${productId}`,
                { withCredentials: true }
            );
            if (data.success) {
                toast.success("Item removed");
                fetchCart();
            }
        } catch (error) {
            toast.error("Failed to remove item");
        }
    }
    

  return (
    <>
        <ToastContainer theme='colored' position='top-center'/>
            <div className="container">
                <div className="row d-flex justify-content-around my-3">
                    {cartItems.length===0 ?
                        
                            <h2 className='text-success text-center '>Your Cart is Empty</h2>
                        :(
                            <>
                                <h2 className='text-center'>Your Cart items</h2>
                                <div className="col-md-8">
                                        {cartItems.map((item,i)=>(
                                            <div key={i}>
                                                <div className="row d-flex align-items-center">
                                                <hr />
                                                    <div className="col-2">
                                                        <img src={item.product.imageUrl} alt={item.product.name} width={100} />
                                                    </div>

                                                    <div className="col-2">
                                                        {item.product.name}
                                                    </div>

                                                    <div className="col-3">
                                                        ${item.product.price}
                                                    </div>

                                                    <div className="col-3">
                                                        <button className='btn btn-primary' onClick={()=>updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                                                        &nbsp;
                                                        <span>{item.quantity}</span>
                                                        &nbsp;
                                                        <button className='btn btn-danger' onClick={()=>updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                                                    </div>
                                                    <div className="col-1 ">
                                                        <button className="btn btn-danger" onClick={()=>deleteItem(item.product._id)}><FaTrash/></button>
                                                    </div>


                                                </div>

                                            </div>

                                            
                                        ))}
                                </div>
                                <div className="col-md-3 shadow p-3">
                                    <h5>cart summary</h5>
                                    <hr />
                                    <p><strong>Units:</strong>
                                            {cartItems.reduce((ac,item)=>(ac+item.quantity),0)}
                                    </p>
                                    <hr />
                                    <p><strong>Total:$</strong>
                                            {cartItems.reduce((ac,item)=>(ac+(item.quantity*item.product.price)),0)}
                                    </p>
                                    <hr />
                                    <div className="mt-3">
                                        <Link to="/checkout" className='btn btn-warning' >Check Out</Link>
                                    </div>


                                </div>
                            </>
                        )

                    }
                </div>
            </div>

    </>
  )
}

export default Cart