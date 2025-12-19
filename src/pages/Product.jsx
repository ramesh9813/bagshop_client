import React,{useState,useEffect} from 'react'
import Card from '../component/Card'
import axios  from 'axios'
import Spinner from '../component/Spinner'

const Product = () => {
    const [products,setProducts]=useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`)
        .then(res=>{
           console.log(res)
            setProducts(res.data.products);
            setLoading(false)
        })
        .catch(error=>{
            console.log(error)
            setLoading(false)
        })
    },[])
    console.log(products)
  return (
    <>
    <div className="container-fluid d-flex">
        {loading ? (
            <Spinner />
        ) : (
            <div className="row row-cols-1 row-cols-md-4 g-4">
            {products.map((item,i)=>(
                <Card data={item} key={i}/>
            ))}
            </div>
        )}
        <div className="filter my-2 mb-2 fs-4 text-end">
          <i className="bi bi-filter"></i>
        </div>
        </div>
    </>
  )
}

export default Product