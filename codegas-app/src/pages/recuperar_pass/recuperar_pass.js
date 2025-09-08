import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Footer              from '../components/footer'
import Toast from 'react-native-toast-message';

import {style} from './style'; // Asegúrate de importar el estilo desde la ubicación correcta
import { DataContext } from '../../context/context';

const Home = ({ navigation }) => {
    const {recoverPass}: any = useContext(DataContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [showModulo, setShowModulo] = useState(false);
 

  const recuperar = async () => {
    if (email.length < 5) {
      Toast.show({type: 'info', text1: 'Email es obligatorio'})
    } else {
    
        Toast.show({type: 'success', text1: 'revisa tu email'})
      await recoverPass(email)
    }
  };

  const renderEmail = () => {
    return (
      <View style={style.subContainerRegistro}>
        <Text style={style.titulo}>Recuperar Contraseña</Text>
        <TextInput
          style={
            email.length < 2
              ? [style.input, style.inputInvalid]
              : style.input
          }
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType='email-address'
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={style.btnGuardar}
          onPress={recuperar}>
          <Text style={style.textGuardar}>Recuperar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Otras funciones y componentes para el código faltante
  // ...

  return (
    <ImageBackground
      style={style.container}
      source={require('../../assets/img/pg1/fondo.jpg')}>
      <KeyboardAwareScrollView style={style.containerRegistro}>
        { 
           renderEmail()
        }
      </KeyboardAwareScrollView>
      <Footer navigation={navigation} />
      <Toast />
    </ImageBackground>
  );
};

export default Home;
