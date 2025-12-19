import './App.css';
import MyRoute from './MyRoute';
//import cartReducer from './redux/reducer/CartReducer';
//import {legacy_createStore} from 'redux';
import {Provider} from 'react-redux';
import store from './Store';
function App() {
  // const store=legacy_createStore(cartReducer)
  return (
    <Provider store={store}>
      <MyRoute/>
    </Provider>
  );
}

export default App;
