import React,{useState} from 'react'
import { FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';

const Cart = () => {
    const { cartItems, updateQuantity, removeItem } = useCart();
    const [useDefaultAddress, setUseDefaultAddress] = useState(true);

  return (
    <>
        
            <div className="container">
                <div className="row d-flex justify-content-around my-3">
                    {cartItems.length===0 ?
                        
                            <div className="text-center py-5">
                                <h2 className='text-success mb-4'>Your Cart is Empty</h2>
                                <Link to="/products" className="text-warning fw-bold fs-5 text-decoration-none border border-warning p-2 px-4 rounded-pill hover-bg-warning">
                                    <i className="bi bi-arrow-left me-2"></i>Continue Shopping
                                </Link>
                            </div>
                        :(
                            <>
                                <h2 className='text-center'>Your Cart items</h2>
                                <div className="col-md-8">
                                        {cartItems.map((item,i) => {
                                            if (!item || !item.product) return null; // Skip malformed items
                                            return (
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
                                                        NRS {item.product.price}
                                                    </div>

                                                    <div className="col-3">
                                                        <button className='btn' style={{backgroundColor: '#2ecc71', color: 'white'}} onClick={()=>updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                                                        &nbsp;
                                                        <span>{item.quantity}</span>
                                                        &nbsp;
                                                        <button className='btn btn-danger' onClick={()=>updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                                                    </div>
                                                    <div className="col-1 ">
                                                        <button className="btn btn-danger" onClick={()=>removeItem(item.product._id)}><FaTrash/></button>
                                                    </div>


                                                </div>

                                            </div>
                                        )})}
                                </div>
                                <div className="col-md-3 shadow p-3">
                                    <h5>cart summary</h5>
                                    <hr />
                                    <p><strong>Units:</strong>
                                            {cartItems.reduce((ac,item)=>(ac+item.quantity),0)}
                                    </p>
                                    <hr />
                                    <p><strong>Total: NRS </strong>
                                            {cartItems.reduce((ac,item)=>(ac+(item.quantity*item.product.price)),0)}
                                    </p>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="defaultAddressCheck" 
                                            checked={useDefaultAddress}
                                            onChange={(e) => setUseDefaultAddress(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="defaultAddressCheck">
                                            Use Default Details
                                        </label>
                                    </div>
                                    <hr />
                                    <div className="mt-3">
                                        <Link to="/checkout" state={{ useDefault: useDefaultAddress }} className='btn btn-warning' >Check Out</Link>
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