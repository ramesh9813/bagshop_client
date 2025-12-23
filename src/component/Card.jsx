import React from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';

const Card = (props) => {
  const dispatch = useDispatch();
  // console.log(props.data)
  if (!props.data) {
    return null; // or handle the absence of data as per your requirement
}

const addToCart = async (e) => {
  e.preventDefault(); // Prevent default link behavior if inside a Link
  e.stopPropagation(); // Stop event bubbling

  try {
      const product = props.data;
      if (!product || !product._id) {
        console.error("Product data missing ID");
        return;
      }

      const optimisticItem = {
          product: product,
          quantity: 1
      };

      let localCart = [];
      try {
        localCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (!Array.isArray(localCart)) localCart = [];
      } catch (err) {
        localCart = [];
      }

      const existingItemIndex = localCart.findIndex(item => item.product._id === product._id);

      if (existingItemIndex !== -1) {
          // Item exists: Increment quantity and use PUT /cart/update
          const newQuantity = localCart[existingItemIndex].quantity + 1;
          localCart[existingItemIndex].quantity = newQuantity;
          localStorage.setItem('cart', JSON.stringify(localCart));
          toast.success("Item quantity updated");
          // Dispatch removed here because we only track unique items count

          await axios.put(
              `${import.meta.env.VITE_API_BASE_URL}/cart/update`,
              { productId: product._id, quantity: newQuantity },
              { withCredentials: true }
          );

      } else {
          // Item is new: Add to cart and use POST /cart/add
          localCart.push(optimisticItem);
          localStorage.setItem('cart', JSON.stringify(localCart));
          toast.success("Item added to cart");
          dispatch({ type: 'ADD_TO_CART' });

          await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/cart/add`,
              { productId: product._id, quantity: 1 },
              { withCredentials: true }
          );
      }

  } catch (error) {
      console.error("Background sync failed:", error);
      if (error.response?.data?.message) {
           toast.error(error.response.data.message);
      }
  }
}

const strippedTitle = (title, carlength) => {
  let newvar = '';
  let spaceReq = carlength - title.length;
  if (title.length >= carlength) {
    for (let i = 0; i < carlength-3; i++) {
      newvar += title[i];
    }
    newvar+="..."
  } else {
    newvar = title;
    for (let i = 0; i < spaceReq; i++) {
      newvar += " ";
    }
  }
  return newvar
};

  return (
    <>
        <div className="col">
            <div className="card">
            <img src={props.data.imageUrl} className="card-img-top" alt={props.data.name}/>
            <div className="card-body">
                <h5 className="card-title">{strippedTitle(props.data.name,25)}</h5>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className='text-success mb-0'>NRS {props.data.price}</h5>
                  <small className={props.data.stock > 0 ? "text-success" : "text-danger"}>
                    {props.data.stock > 0 ? `In Stock` : "Out of Stock"}
                  </small>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                  <Link to ={`/productdetails/${props.data._id}`} className='btn btn-outline-warning btn-sm'>
                    Details
                  </Link>
                  <button 
                    className='btn btn-warning btn-sm' 
                    onClick={addToCart}
                    disabled={props.data.stock <= 0}
                  >
                    <i className="bi bi-cart-plus"></i> Add
                  </button>
                </div>
              
            </div>
            </div>
        </div>
    </>
  )
}

export default Card