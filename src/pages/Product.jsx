import React,{useState,useEffect} from 'react'
import Card from '../component/Card'
import axios  from 'axios'

const Product = () => {
    const [products,setProducts]=useState([])
    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`)
        .then(res=>{
           console.log(res)
            setProducts(res.data.products);
        })
        .catch(error=>console.log(error))
    },[])
    console.log(products)
  return (
    <>
    <div className="container-fluid d-flex">
        <div className="row row-cols-1 row-cols-md-4 g-4">
           {products.map((item,i)=>(
            <Card data={item} key={i}/>
           ))}
        </div>
        <div className="filter my-2 mb-2 fs-4 text-end">
          <i className="bi bi-filter"></i>
        </div>
        </div>
    </>
  )
}

export default Product