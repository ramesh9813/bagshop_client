import React,{useState,useEffect} from 'react'
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Cart = () => {
    const[cartItems, setCartItems]=useState([])
    const dispatch = useDispatch()

    const [useDefaultAddress, setUseDefaultAddress] = useState(false);

    const updateCartCount = (items) => {
        const count = items.length;
        dispatch({ type: 'SET_CART_COUNT', payload: count });
    }

    const fetchCart = async () => {
        // 1. Optimistic Load from LocalStorage
        const localCart = JSON.parse(localStorage.getItem('cart'));
        if (localCart && localCart.length > 0) {
            setCartItems(localCart);
            updateCartCount(localCart);
        }

        // 2. Sync with Server
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/cart`,
                { withCredentials: true }
            );
            
            if (data.success) {
                let serverItems = [];
                if (data.cart && data.cart.cartItems) {
                    serverItems = data.cart.cartItems;
                } else if (data.cartItems) {
                    serverItems = data.cartItems;
                }
                
                setCartItems(serverItems);
                updateCartCount(serverItems);
                // Update Local Storage with fresh server data to keep them in sync
                localStorage.setItem('cart', JSON.stringify(serverItems));
            } 
        } catch (error) {
            console.error(error);
            // If server fails, we still have local data shown
        }
    }

    useEffect(()=>{
        fetchCart();
    },[])

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        // Find item to check stock
        const item = cartItems.find(item => item.product._id === productId);
        if (!item) return;

        // Check if increasing beyond stock
        if (newQuantity > item.product.stock) {
            toast.warning(`No more items remaining in stock. Max available: ${item.product.stock}`);
            return;
        }
        
        const oldQuantity = item.quantity;

        // Optimistic Update
        const previousItems = [...cartItems];
        const updatedItems = cartItems.map(item => 
            item.product._id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        updateCartCount(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));

        if (newQuantity < oldQuantity) {
             toast.error("Quantity decreased");
        } else {
             toast.success("Quantity updated");
        }

        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/cart/update`,
                { productId, quantity: newQuantity },
                { withCredentials: true }
            );
        } catch (error) {
            toast.error("Failed to sync quantity with server");
            setCartItems(previousItems); // Revert on error
            updateCartCount(previousItems);
            localStorage.setItem('cart', JSON.stringify(previousItems));
        }
    }

    const deleteItem = async (productId) => {
        // Optimistic Update
        const previousItems = [...cartItems];
        const updatedItems = cartItems.filter(item => item.product._id !== productId);
        setCartItems(updatedItems);
        updateCartCount(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        toast.success("Item removed");

        try {
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/cart/remove/${productId}`,
                { withCredentials: true }
            );
        } catch (error) {
            toast.error("Failed to remove item from server");
            setCartItems(previousItems); // Revert
            updateCartCount(previousItems);
            localStorage.setItem('cart', JSON.stringify(previousItems));
        }
    }
    

  return (
    <>
        
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