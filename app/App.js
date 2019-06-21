import React, { Component }        from 'react'
import { YellowBox } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import axios                       from 'axios' 
import {Provider}                  from 'react-redux';
import FCM, { NotificationActionType } from "react-native-fcm";
import MainRoutes                  from './src/routes/MainRoutes'
import configStore                 from './src/redux/store.js' //redux config
const store = configStore();
// import {searchUser, getCarrito, getCarrito2, getCatalogo, getOrders, getProductos} from './src/redux/actionCreator' 
YellowBox.ignoreWarnings(['Remote debugger']);
YellowBox.ignoreWarnings(['Require cycle:']);



//////////////////////////////////////////////////////////////////////////////////////////
//////  RUTA GENERAL DE LA URL PARA EL API
//////////////////////////////////////////////////////////////////////////////////////////
export const URL = 'http://104.248.181.79:8181';       //// URL WEB DEV
// export const URL = 'http://192.168.0.5:8181';   //// URL local
export const VERSION = "1.0.0"
axios.defaults.baseURL = URL+"/x/v1";



//////////////////////////////////////////////////////////////////////////////////////////
//////  CREO EL COMPONENTE 
//////////////////////////////////////////////////////////////////////////////////////////
export default class App extends Component<{}> {

  componentWillMount(){
    // FCM.getFCMToken().then(tokenPhone => {
    //   // console.log("TOKEN (getFCMToken)", tokenPhone);
    //   AsyncStorage.setItem('tokenPhone', tokenPhone || "123456")
    //   this.setState({ tokenPhone: tokenPhone || "" });
    // });

    // axios.get(`user/perfil/`)
    // .then(res => {
    //   console.log(res.data.user)
    //   if(res.data.status){
    //     AsyncStorage.setItem('userId', res.data.user._id)
    //     AsyncStorage.setItem('acceso', res.data.user.acceso)
    //     AsyncStorage.setItem('nombre', res.data.user.nombre)
    //     AsyncStorage.setItem('email',  res.data.user.email)
    //     AsyncStorage.setItem('avatar', res.data.user.avatar ?res.data.user.avatar :"null")
    //   }else{
    //     AsyncStorage.removeItem('userId')
    //     AsyncStorage.removeItem('avatar')
    //     AsyncStorage.removeItem('acceso')
    //   }
    // })
    // .catch(err => {
    //   console.log(err);
    // });
  }
  render(){
    return (
      <Provider store={store}>
        
          <MainRoutes />
         
      </Provider> 
    )
  }
}