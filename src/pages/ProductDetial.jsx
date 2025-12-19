import React, { useState,useEffect } from 'react'
import {useParams} from 'react-router-dom'
import axios  from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Accordion from 'react-bootstrap/Accordion';

const ProductDetial = () => {
  const [product,setProduct]=useState({})
  const params =useParams()
  const id= params.productId
    useEffect(()=>{
     
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/${id}`)
      .then(res=>{
        console.log(res.data);
        setProduct(res.data.product)
      })
      .catch(error=>console.log(error))
  },[id])

  const addToCart = async () => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }

        const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/cart/add`,
            { productId: product._id, quantity: 1 },
            config
        )

        if (data.success) {
            toast.success("Item added to cart")
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add to cart. Please login first.")
    }
  }
  return (
    <>
    <ToastContainer theme='colored' position='top-center'/>
    <div className="container">
      <div className="row d-flex justify-content-around align-item-center my-5">
        <div className="col-md-3">
          <img src={product.imageUrl} alt={product.name} width="300px"/>
        </div>
        <div className="col-md-8">
          <h1>{product.name}</h1>
          <h2 className='text-warning'>${product.price}</h2>
          
          <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>description</Accordion.Header>
            <Accordion.Body>
               <p>{product.description}</p> 
            </Accordion.Body>
          </Accordion.Item>
      </Accordion>
            
                   
          <p style={{"color":"red"}}>{product.category}</p>
          <div className="my-3">
            <button className='btn btn-warning' onClick={addToCart}>ADD TO CART</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default ProductDetial