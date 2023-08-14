import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect }         from "react-redux";
import { DataContext } from '../../context/context';
import {style} from './style'
import Footer              from '../components/footer'

const IniciarSesion = ({ navigation }) => {
 
  const {login} = useContext(DataContext)  

  const [cargando, setCargando] = useState(false);
  const [data, setData] = useState({})
  const [email, setEmail] = useState('')
  
  const updateData= (type, e) => {
    setData({...data, [type]:e })
  }

  const signIn = async() => {
    const {response, status} = await login(data)
    if(response){
      if(status===1){
        navigation.navigate("Home")
      } else if (status===2) {
        Toast.show({type: 'info', text1: 'Cambiamos tu contraseña, revisa tu email'})
      }
    }else{
      Toast.show({type: 'error', text1: 'Datos Incorrectos'})
    }
  }

  const renderEmail = () => {
    return(
      <ScrollView style={style.containerRegistro2}>
        <View style={style.subContainerRegistro}>
          <Text style={style.titulo}>Crear Nueva Cuenta</Text>
          <TextInput
            style={
              email.length < 2 ? [style.input, style.inputInvalid] : style.input
            }
            placeholder="Email / Codigo registro"
            onChangeText={(email) => setEmail(email)}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={style.btnGuardar}
            onPress={() =>
              email.length < 2
                ? Toast.show({type: 'info', text1: 'Inserte su email o codigo de registro'})
                : this.handleSubmit()
            }>
            <Text style={style.textGuardar}>Registrarme</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  const renderIniciarSesion = () => {
    return (
      <ScrollView style={style.containerRegistro2}>
        <View style={style.subContainerRegistro}>
          <Text style={style.titulo}>Iniciar sesión</Text>
          <TextInput
            style={style.input}
            placeholder="Email"
            onChangeText={(e)=>updateData('email', e)}
            value={data?.email}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa" 
          />
          <TextInput
            style={style.input}
            placeholder="Contraseña"
            onChangeText={(e)=>updateData('password', e)}
            secureTextEntry
            value={data?.password}
            placeholderTextColor="#aaa" 
          />
          <TouchableOpacity style={style.btnGuardar} onPress={signIn}>
            {cargando && <ActivityIndicator style={{ marginRight: 5 }} />}
            <Text style={style.textGuardar}>{cargando ? "Cargando" : "Iniciar Sesión"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.btnOlvidar} onPress={() => navigation.navigate("recuperar")}>
            <Text style={style.textOlvidar}>Olvide mi contraseña</Text>
            <Text style={[style.txtLista, { fontSize: 11 }]}>Ver 11.5.3-1</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };



  // const loginExitoso = (user) => {
  //   AsyncStorage.setItem('userId', user._id);
  //   AsyncStorage.setItem('nombre', user.nombre);
  //   AsyncStorage.setItem('email', user.email);
  //   AsyncStorage.setItem('acceso', user.acceso);
  //   AsyncStorage.setItem('avatar', user.avatar ? user.avatar : "null");
  //   AsyncStorage.setItem('tokenPhone', tokenPhone);
  //   setUserId(user._id);
  //   setCargando(false);
  //   setNombre(user.nombre);
  //   setEmail(user.email);
  //   setAcceso(user.acceso);
  //   setAvatar(user.avatar ? user.avatar : "null");
  //   user.nombre ? navigation.navigate("inicio") : navigation.navigate("verPerfil", { tipoAcceso: null });
  // };

  // const cerrarSesion = () => {
  //   axios.get(`user/logout`)
  //     .then(res => {
  //       AsyncStorage.removeItem('userId');
  //       AsyncStorage.removeItem('idPerfilregistro');
  //       AsyncStorage.removeItem('acceso');
  //       AsyncStorage.removeItem('nombre');
  //       AsyncStorage.removeItem('email');
  //       AsyncStorage.removeItem('tokenPhone');
  //       AsyncStorage.removeItem('avatar');
  //       AsyncStorage.removeItem('formularioChat');
  //       AsyncStorage.removeItem('usuariosEntrando');
  //       setUserId(null);
  //       setEmail("");
  //       setPassword("");
  //       setEmail2("");
  //       setPassword2("");
  //       navigation.navigate("Home");
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       setErr(err);
  //     });
  // };

  
   
  const registroExitoso = (email, code, id) => {
    AsyncStorage.setItem('idPerfilregistro', id);
    navigation.navigate("confirmar", { code, email });
  };


 
  return (
    <View style={style.container}>
      <Image source={require('../../assets/img/pg1/fondo1.jpg')} style={style.cabezera1} />
      <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo2.jpg')} >
        <KeyboardAwareScrollView style={style.containerRegistro}>
          {renderEmail()}
          <View style={style.separador} />
          {renderIniciarSesion()}
        </KeyboardAwareScrollView>
        <View style={style.footer}>
          <Footer navigation={navigation} />
        </View>
      </ImageBackground>
      <Toast />
    </View>
  );
};

const mapState = state => {
  return {

  };
};

const mapDispatch = dispatch => {
  return {

  };
};

export default connect(
  mapState,
  mapDispatch
)(IniciarSesion);

