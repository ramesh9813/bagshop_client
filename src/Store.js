import cartReducer from "./redux/reducer/CartReducer";
import {combineReducers,legacy_createStore} from "redux";
const reducers=combineReducers({
    cart:cartReducer
})

const store=legacy_createStore(reducers)
export default store