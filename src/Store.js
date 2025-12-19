import cartReducer from "./redux/reducer/CartReducer";
import authReducer from "./redux/reducer/authReducer";
import {combineReducers,legacy_createStore} from "redux";
const reducers=combineReducers({
    cart:cartReducer,
    auth:authReducer
})

const store=legacy_createStore(reducers)
export default store