const getInitialCartCount = () => {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart.length;
    } catch (err) {
        return 0;
    }
};

const InitialData = {
    cartCount: getInitialCartCount()
}

const cartReducer = (state = InitialData, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            return {
                ...state,
                cartCount: state.cartCount + 1
            }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartCount: state.cartCount > 0 ? state.cartCount - 1 : 0
            }
        case 'SET_CART_COUNT':
            return {
                ...state,
                cartCount: action.payload
            }
        default:
            return state
    }
}

export default cartReducer