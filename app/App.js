import React, { Component }        from 'react'
import { YellowBox, NetInfo, StyleSheet} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import axios                       from 'axios' 
import {Provider}                  from 'react-redux';
import MainRoutes                  from './src/routes/MainRoutes'
import configStore                 from './src/redux/store.js' //redux config
 
const store = configStore();
YellowBox.ignoreWarnings(['Remote debugger']);
YellowBox.ignoreWarnings(['Require cycle:']);

//////////////////////////////////////////////////////////////////////////////////////////
//////  RUTA GENERAL DE LA URL PARA EL API
//////////////////////////////////////////////////////////////////////////////////////////
// export const URL = 'https://appcodegas.com';      //// URL WEB DEV
export const URL = 'https://appcodegas.com:3131'; //// URL WEB DEV
// export const URL = 'http://192.168.0.19:8181';       //// URL local
export const VERSION = "1.0.0"
axios.defaults.baseURL = URL+"/x/v1";
 
//////////////////////////////////////////////////////////////////////////////////////////
//////  CREO EL COMPONENTE 
//////////////////////////////////////////////////////////////////////////////////////////
export default class App extends Component<{}> {
  constructor(){
    super();
    this.state={
      connection_Status : ""
    }
  }
  /// esto lo hago por que no mantiene la sesion, entonces dejo guardado el id y luego le inicio sesion
  async componentWillMount(){
    let userId = await AsyncStorage.getItem('userId');
    if (userId===null || userId==='0') {
      axios.get('user/perfil/')
      .then((res)=>{
        if(res.data.status){
          AsyncStorage.setItem('userId', res.data.user._id)
          AsyncStorage.setItem('acceso', res.data.user.acceso)
          AsyncStorage.setItem('nombre', res.data.user.nombre ?res.data.user.nombre :"")
          AsyncStorage.setItem('email',  res.data.user.email)
          AsyncStorage.setItem('avatar', res.data.user.avatar ?res.data.user.avatar :"null")
        }else{
          AsyncStorage.removeItem('userId')
          AsyncStorage.removeItem('avatar')
          AsyncStorage.removeItem('acceso')
        }
       })
      .catch((err)=>{
         console.log(err)
      })
   }else{
      axios.get(`user/perfil/${userId}`)
      .then((res)=>{
        if(res.data.status){
          console.log(res.data)
          AsyncStorage.setItem('userId', res.data.user._id)
          AsyncStorage.setItem('acceso', res.data.user.acceso)
          AsyncStorage.setItem('nombre', res.data.user.nombre ?res.data.user.nombre :"")
          AsyncStorage.setItem('email',  res.data.user.email)
          AsyncStorage.setItem('avatar', res.data.user.avatar ?res.data.user.avatar :"null")
        }else{
          AsyncStorage.removeItem('userId')
          AsyncStorage.removeItem('avatar')
          AsyncStorage.removeItem('acceso')
        }
      })
      .catch((err)=>{
         console.log(err)
      })
    }
  }
  componentDidMount() {
    NetInfo.isConnected.addEventListener(
        'connectionChange',
        this.handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done((isConnected) => {
      console.log({isConnected})
      isConnected ?this.setState({connection_Status :true}) : this.setState({connection_Status :false})
    });
  }
  handleConnectivityChange = (isConnected) => {
    isConnected ?this.setState({connection_Status :true}) : this.setState({connection_Status :false})
  };
  render(){
    return (
      <Provider store={store}>
        <MainRoutes />  
      </Provider> 
    )
  }
}

const style = StyleSheet.create({
  alert: {
    color:"red"
  },
  container:{
    flex:1,
 
    alignItems:"center",
    textAlign:"center"
  },
  subContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    textAlign:"center"
  },
  text:{
    fontFamily: "Comfortaa-Bold",
    fontSize:22,
    alignItems:"center",
    textAlign:"center"
  },
  img:{
    width:200,
    height:200
  }
}); 