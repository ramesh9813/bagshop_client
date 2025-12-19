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

  const addToCart=()=>{
    const cartItem=JSON.parse(localStorage.getItem('cartData'))||[]
    const productItem={
      id:product._id,
      title:product.name,
      price:product.price,
      description:product.description,
      image:product.imageUrl,
      quantity:1,
      loginStatus:false,
      totalCost:0

    }
    const existingItem=cartItem.find(item=> item.id===product._id)
    if(existingItem){
      toast.error("prodyuct is already exist in th cart")
    }
    else{
      cartItem.push(productItem)
      localStorage.setItem('cartData', JSON.stringify(cartItem))
      toast.success(`${product.name} is sucessfully added in the cart`)
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