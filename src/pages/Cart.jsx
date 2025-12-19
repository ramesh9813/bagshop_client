import React,{useState,useEffect} from 'react'
import { FaTrash } from 'react-icons/fa';

const Cart = () => {
    const[products,setProducts]=useState([])
    useEffect(()=>{
        const cartData=JSON.parse(localStorage.getItem('cartData')) 
        setProducts(cartData)
    },[])

    const increase = (prId) => {
        const updatedProduct = [...products];
        updatedProduct.map((item) => {
            if (item.id === prId) {
                return item.quantity += 1;
            }
            return item;
        });
        setProducts(updatedProduct);
        localStorage.setItem('cartData', JSON.stringify(updatedProduct));

    }
    
    const decrease = (prId) => {
        const updatedProduct = [...products];
        updatedProduct.map((item) => {
            if (item.id === prId) {
                if(item.quantity>1){
                    return item.quantity -= 1;
                } 
            }
            return item;
        });
        setProducts(updatedProduct);
        localStorage.setItem('cartData', JSON.stringify(updatedProduct));

    }

    const deleteItem = (prId) => {
        const updatedProduct = products.filter(item => item.id !== prId);
        setProducts(updatedProduct);
        localStorage.setItem('cartData', JSON.stringify(updatedProduct));
    }
    

  return (
    <>
            <div className="container">
                <div className="row d-flex justify-content-around my-3">
                    {products.length===0 ?
                        
                            <h2 className='text-success text-center '>Your Cart is Empty</h2>
                        :(
                            <>
                                <h2 className='text-center'>Your Cart items</h2>
                                <div className="col-md-8">
                                        {products.map((item,i)=>(
                                            <div key={i}>
                                                <div className="row d-flex align-items-center">
                                                <hr />
                                                    <div className="col-2">
                                                        <img src={item.image} alt={item.title} width={100} />
                                                    </div>

                                                    <div className="col-2">
                                                        {item.title}
                                                    </div>

                                                    <div className="col-3">
                                                        ${item.price}
                                                    </div>

                                                    <div className="col-3">
                                                        <button className='btn btn-primary'onClick={()=>increase(item.id)}  >+</button>
                                                        &nbsp;
                                                        <span>{item.quantity}</span>
                                                        &nbsp;
                                                        <button className='btn btn-danger' onClick={()=>decrease(item.id)}>-</button>
                                                    </div>
                                                    <div className="col-1 ">
                                                        <button className="btn btn-danger" onClick={()=>deleteItem(item.id)}><FaTrash/></button>
                                                    </div>


                                                </div>

                                            </div>

                                            
                                        ))}
                                </div>
                                <div className="col-md-3 shadow p-3">
                                    <h5>cart summary</h5>
                                    <hr />
                                    <p><strong>Units:</strong>
                                            {products.reduce((ac,item)=>(ac+item.quantity),0)}
                                    </p>
                                    <hr />
                                    <p><strong>Total:$</strong>
                                            {products.reduce((ac,item)=>(ac+(item.quantity*item.price)),0)}
                                    </p>
                                    <hr />
                                    <div className="mt-3">
                                        <button className='btn btn-warning' >Check Out</button>
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