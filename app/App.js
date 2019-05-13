import React, { Component }        from 'react'
import { YellowBox } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import axios                       from 'axios' 
import {Provider}                  from 'react-redux';
 
import MainRoutes                  from './src/routes/MainRoutes'
import configStore                 from './src/redux/store.js' //redux config
const store = configStore();
// import {searchUser, getCarrito, getCarrito2, getCatalogo, getOrders, getProductos} from './src/redux/actionCreator' 
YellowBox.ignoreWarnings(['Remote debugger']);
YellowBox.ignoreWarnings(['Require cycle:']);



//////////////////////////////////////////////////////////////////////////////////////////
//////  RUTA GENERAL DE LA URL PARA EL API
//////////////////////////////////////////////////////////////////////////////////////////
// export const URL = 'https://releo.co';       //// URL PRODUCCION
export const URL = 'http://192.168.0.6:8080';   //// URL local
export const VERSION = "1.0.0"
axios.defaults.baseURL = URL+"/x/v1";



//////////////////////////////////////////////////////////////////////////////////////////
//////  CREO EL COMPONENTE 
//////////////////////////////////////////////////////////////////////////////////////////
export default class App extends Component<{}> {
  componentWillMount = async ()=>{
    axios.get(`user/perfil/`)
    .then(res => {
      console.log(res.data)
      if(res.data.status){
        AsyncStorage.setItem('userId', res.data.user._id)
        AsyncStorage.setItem('acceso', res.data.user.acceso)
        AsyncStorage.setItem('nombre', res.data.user.nombre)
        AsyncStorage.setItem('email',  res.data.user.email)
        AsyncStorage.setItem('avatar', res.data.user.avatar ?res.data.user.avatar :"null")
      }
    })
    .catch(err => {
      console.log(err);
    });
  }
  render(){
    return (
      <Provider store={store}>
        
          <MainRoutes />
         
      </Provider> 
    )
  }
}