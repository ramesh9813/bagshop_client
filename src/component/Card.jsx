import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';

const Card = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(props.data)
  if (!props.data) {
    return null; // or handle the absence of data as per your requirement
}

const handlePriceClick = (e) => {
  e.preventDefault();
  navigate(`/products?maxPrice=${props.data.price}`);
};

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
          // Item exists: Check stock before incrementing
          const newQuantity = localCart[existingItemIndex].quantity + 1;
          
          if (newQuantity > product.stock) {
              toast.warning(`No more items remaining in stock. Max available: ${product.stock}`);
              return;
          }

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
          // Item is new: Check if at least 1 is in stock
          if (product.stock < 1) {
              toast.error("Sorry, this item is out of stock.");
              return;
          }

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
            <Link 
              to={`/productdetails/${props.data._id}`} 
              className="card h-100 text-decoration-none text-dark shadow-sm product-card"
              style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
            >
              <style>
                {`
                  .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
                  }
                `}
              </style>
              <img src={props.data.imageUrl} className="card-img-top" alt={props.data.name} style={{ height: '200px', objectFit: 'cover' }}/>
              <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{strippedTitle(props.data.name,25)}</h5>
                  <div className="d-flex justify-content-between align-items-center mb-3 mt-auto">
                    <h5 
                      className='text-success mb-0' 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePriceClick(e);
                      }}
                      style={{ cursor: 'pointer' }}
                      title="Click to filter by this price"
                    >
                      NRS {props.data.price}
                    </h5>
                    <small className={props.data.stock > 0 ? "text-success" : "text-danger"}>
                      {props.data.stock > 0 ? `In Stock` : "Out of Stock"}
                    </small>
                  </div>
                  
                  <div className="d-grid">
                    <button 
                      className='btn btn-warning fw-bold' 
                      onClick={addToCart}
                      disabled={props.data.stock <= 0}
                    >
                      <i className="bi bi-cart-plus me-2"></i> 
                      {props.data.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
              </div>
            </Link>
        </div>
    </>
  )
}

export default Card