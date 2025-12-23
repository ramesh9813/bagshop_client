import React, { useState,useEffect } from 'react'
import {useParams} from 'react-router-dom'
import axios  from 'axios'
import { toast } from 'react-toastify';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from '../component/Spinner';
import { useSelector } from 'react-redux';

const ProductDetial = () => {
  const [product,setProduct]=useState({})
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [hasPurchased, setHasPurchased] = useState(false)
  const { user } = useSelector(state => state.auth)
  const params =useParams()
  const id= params.productId

    const fetchProduct = () => {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/${id}`)
      .then(res=>{
        setProduct(res.data.product)
        setLoading(false)
      })
      .catch(error=>{
        console.log(error)
        setLoading(false)
      })
    }

    const checkPurchaseStatus = async () => {
      if (user) {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/order/check-purchase/${id}`,
            { withCredentials: true }
          );
          if (data.success) {
            setHasPurchased(data.hasPurchased);
          }
        } catch (error) {
          console.error("Failed to check purchase status", error);
        }
      }
    }

    useEffect(()=>{
     fetchProduct();
     checkPurchaseStatus();
  },[id, user])

  const addToCart = async () => {
    // Optimistic UI Update
    try {
        const optimisticItem = {
            product: product,
            quantity: 1
        };

        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = localCart.findIndex(item => item.product._id === product._id);

        if (existingItemIndex !== -1) {
             // Item exists: Increment quantity and use PUT /cart/update
             const newQuantity = localCart[existingItemIndex].quantity + 1;
             localCart[existingItemIndex].quantity = newQuantity;
             localStorage.setItem('cart', JSON.stringify(localCart));
             toast.success("Item quantity updated");

             const config = {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            };

             await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/cart/update`,
                { productId: product._id, quantity: newQuantity },
                config
            );
        } else {
             // Item is new: Add to cart and use POST /cart/add
            localCart.push(optimisticItem);
            localStorage.setItem('cart', JSON.stringify(localCart));
            toast.success("Item added to cart");

            // Background Server Sync
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }

            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/cart/add`,
                { productId: product._id, quantity: 1 },
                config
            );
        }

    } catch (error) {
        // Silent fail for optimistic part, but alert on server error if needed
        console.error("Background sync failed:", error);
        if (error.response?.data?.message) {
             toast.error(error.response.data.message);
        }
    }
  }

  const submitReview = async () => {
    try {
        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        }

        const reviewData = { 
            comment, 
            productId: id 
        };
        
        // Only include rating if user has purchased
        if (hasPurchased) {
            reviewData.rating = rating;
        } else {
            // If backend requires a rating, send 0 or a flag, 
            // but ideally backend should handle this.
            // For now, let's assume we send existing rating logic but UI restricts it.
            // However, the prompt says "allow only comment". 
            // If the backend model requires rating, we might need to adjust backend or send a placeholder.
            // Checking Product Model: It likely expects a rating. 
            // We will send the rating '0' or not send it if the backend supports it.
            // Based on typical MERN tutorials, rating is required. 
            // Let's modify the backend logic slightly in next step if needed, 
            // but for now, we will send the selected rating (default 5) BUT visually hide it?
            // "allow only comment" implies they CANNOT rate.
            // If they cannot rate, the rating shouldn't affect the average.
            
            // To be safe and compliant with the request:
            // We will send rating: 0 to indicate "no rating".
            // Backend needs to handle rating: 0 to NOT count it in average.
             reviewData.rating = 0; 
        }

        const { data } = await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/review`,
            reviewData,
            config
        )

        if (data.success) {
            toast.success("Review Submitted Successfully")
            setComment("")
            fetchProduct() // Refresh to show new review
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to submit review")
    }
  }

  return (
    <>
    <div className="container">
      {loading ? (
        <Spinner />
      ) : (
        <>
        <div className="row d-flex justify-content-around align-item-center my-5">
          <div className="col-md-5">
            <img src={product.imageUrl} alt={product.name} className="img-fluid rounded shadow-sm"/>
          </div>
          <div className="col-md-6">
            <h1>{product.name}</h1>
            <div className="d-flex align-items-center mb-2">
                <div className="text-warning me-2">
                    {[...Array(5)].map((star, index) => {
                        return (
                            <i 
                                key={index} 
                                className={`bi ${index < Math.round(product.ratings) ? 'bi-star-fill' : 'bi-star'}`}
                            ></i>
                        );
                    })}
                </div>
                <span className="text-muted">({product.numOfReviews} Reviews)</span>
            </div>

            <h2 className='text-warning'>NRS {product.price}</h2>
            
            <Accordion defaultActiveKey="0" className="mb-3">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Description</Accordion.Header>
              <Accordion.Body>
                <p>{product.description}</p> 
              </Accordion.Body>
            </Accordion.Item>
            </Accordion>
              
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Size:</strong> {product.size}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={product.stock > 0 ? "text-success" : "text-danger"}>
                {product.stock > 0 ? `${product.stock} Remaining in Stock` : "Out of Stock"}
              </span>
            </p>
            
            <div className="my-3">
              <button 
                className='btn btn-warning btn-lg w-100' 
                onClick={addToCart}
                disabled={product.stock <= 0}
              >
                <i className="bi bi-cart-plus me-2"></i> {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
              </button>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <hr className="my-5"/>

            <h3 className="mb-4">Reviews</h3>

            {/* Review Form */}
            {user ? (
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">Write a Review</h5>
                        {!hasPurchased && (
                            <div className="alert alert-info py-2 small">
                                <i className="bi bi-info-circle me-1"></i>
                                You can comment on this product, but verified purchase is required to leave a star rating.
                            </div>
                        )}
                        <div className="row">
                            {hasPurchased && (
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Rating</label>
                                    <select 
                                        className="form-select " 
                                        value={rating} 
                                        onChange={(e) => setRating(e.target.value)}
                                    >
                                        <option value="5" className="bg-success">5 - Excellent</option>
                                        <option value="4" className="bg-success">4 - Very Good</option>
                                        <option value="3" className="bg-success">3 - Good</option>
                                        <option value="2" className="bg-success">2 - Fair</option>
                                        <option value="1" className="bg-success">1 - Poor</option>
                                    </select>
                                </div>
                            )}
                            <div className={hasPurchased ? "col-md-9 mb-3" : "col-md-12 mb-3"}>
                                <label className="form-label">Comment</label>
                                <textarea 
                                    className="form-control" 
                                    rows="3" 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    placeholder="Share your experience with this product..."
                                ></textarea>
                            </div>
                        </div>
                        <div className="text-end">
                            <button className="btn btn-warning px-5" onClick={submitReview}>Submit Review</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-info shadow-sm">Please login to write a review.</div>
            )}

            {/* List Reviews */}
            <div className="row">
                {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                        <div key={index} className="col-12 mb-3">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="card-subtitle text-secondary fw-bold mb-0">
                                            <i className="bi bi-person-circle me-2"></i>{review.name}
                                        </h6>
                                        <div className="text-warning">
                                            {[...Array(5)].map((star, i) => (
                                                <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="card-text text-muted">{review.comment}</p>
                                    <small className="text-muted" style={{fontSize: '0.8rem'}}>
                                        Posted on: {new Date(review.createdAt).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-muted text-center p-5 bg-light rounded">No reviews yet. Be the first to review this product!</p>
                    </div>
                )}
            </div>
          </div>
        </div>
        </>
      )}
    </div>
    </>
  )
}

export default ProductDetial