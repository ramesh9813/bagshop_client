import React from 'react'
import {useDispatch} from 'react-redux'

const ChangeItems = () => {
    const dispatch=useDispatch()
    const add=()=>{
        dispatch({type:'ADD_TO_CART'})
    }
    const remove=()=>{
        dispatch({type:'REMOVE_FROM_CART'})
    }
  return (
    <>
    <div className="my-3">
        <div className="row d-flex justify-content-around">
            <div className="col-3">
            <button className="btn btn-primary" onClick={add}>ADD</button>
            </div>
            <div className="col-3">
            <button className="btn btn-warning" onClick={remove}>REMOVE</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default ChangeItems