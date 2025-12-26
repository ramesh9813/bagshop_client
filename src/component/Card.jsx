import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import useCart from '../hooks/useCart';

const Card = (props) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // console.log(props.data)
  if (!props.data) {
    return null; // or handle the absence of data as per your requirement
}

const handlePriceClick = (e) => {
  e.preventDefault();
  navigate(`/products?maxPrice=${props.data.price}`);
};

const handleAddToCart = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (props.data) {
    addToCart(props.data, 1);
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
                      onClick={handleAddToCart}
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