const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
};

const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
};

export default authReducer;