const InitialData = {
    cartItems: [],
    cartCount: 0
}

const cartReducer = (state = InitialData, action) => {
    switch (action.type) {
        case 'SET_CART_ITEMS':
            return {
                ...state,
                cartItems: action.payload,
                cartCount: action.payload.length
            }
        case 'ADD_TO_CART':
            // Check if item already exists to avoid duplicates in state
            const existingIndex = state.cartItems.findIndex(item => item?.product?._id === action.payload.product._id);
            let updatedItemsAdd;
            
            if (existingIndex >= 0) {
                updatedItemsAdd = [...state.cartItems];
                updatedItemsAdd[existingIndex].quantity += action.payload.quantity;
            } else {
                updatedItemsAdd = [...state.cartItems, action.payload];
            }

            return {
                ...state,
                cartItems: updatedItemsAdd,
                cartCount: updatedItemsAdd.length
            }
        case 'REMOVE_FROM_CART': // Payload is productId
            const updatedItemsRemove = state.cartItems.filter(item => item?.product?._id !== action.payload);
            return {
                ...state,
                cartItems: updatedItemsRemove,
                cartCount: updatedItemsRemove.length
            }
        case 'UPDATE_QTY': // Payload: { productId, quantity }
            const updatedItemsQty = state.cartItems.map(item => 
                item?.product?._id === action.payload.productId 
                    ? { ...item, quantity: action.payload.quantity } 
                    : item
            );
            return {
                ...state,
                cartItems: updatedItemsQty,
                cartCount: updatedItemsQty.length
            }
        case 'SET_CART_COUNT': // Legacy support if needed, but SET_CART_ITEMS is preferred
            return {
                ...state,
                cartCount: action.payload
            }
        case 'CLEAR_CART':
            return {
                ...state,
                cartItems: [],
                cartCount: 0
            }
        default:
            return state
    }
}

export default cartReducer