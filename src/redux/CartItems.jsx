import React from 'react'
import {useSelector} from 'react-redux'
import ChangeItems from './ChangeItems'


const CartItems = () => {
const data=useSelector(store=>store.cart)
  return (
    <>
    <h2 className='text-success text-center'>
        The total number of items in the carts is :{data.cartCount}
    </h2>
    <ChangeItems/>
    </>
  )
}

export default CartItems