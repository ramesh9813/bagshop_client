const InitialData={
    cartCount:3
}

const cartReducer=(state=InitialData,action)=>{  
    switch(action.type){
        case 'ADD_TO_CART':
        return {
            cartCount:++state.cartCount
        }
        case 'REMOVE_FROM_CART':
        return {
            cartCount:state.cartCount>0?--state.cartCount:state.cartCount
        }
        default:
            return state
    }
}

export default cartReducer