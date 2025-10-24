import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ImageBackground, ActivityIndicator, Alert, Dimensions, StatusBar, SafeAreaView} from 'react-native';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from "react-redux";
import { DataContext } from '../../context/context';
import { style } from './style'
import Footer from '../components/footer'
import HeaderLogo from '../../components/HeaderLogo'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@react-native-vector-icons/fontawesome';


const { width, height } = Dimensions.get('window');

interface IniciarSesionProps {
  navigation: any;
}

const IniciarSesion: React.FC<IniciarSesionProps> = ({ navigation }) => {

  const { login, sendFCMTokenToBackend, userId } = useContext(DataContext) as any

  const [cargando, setCargando] = useState(false);
  const [data, setData] = useState({ email: '', password: '' })
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const updateData = (type: string, e: string) => {
    setData({ ...data, [type]: e })
  }

  const signIn = async () => {
    const { response, status } = await login(data)
    if (response) {
      if (status === 1) {
        // Enviar token FCM al backend después del login exitoso
        setTimeout(() => {
          sendFCMTokenToBackend(userId);
        }, 1000);
        navigation.navigate("Home")
      } else if (status === 2) {
        Toast.show({ type: 'info', text1: 'Cambiamos tu contraseña, revisa tu email' })
      }
    } else {
      Toast.show({ type: 'error', text1: 'Datos Incorrectos' })
    }
  }

  const handleSubmit = () => {
    let tipoEmail = email.includes("@")
    tipoEmail ? enviarEmailRegistro() : enviaCodigoRegistro()
  }

  const enviaCodigoRegistro = () => {
    let acceso = "cliente";
    // Aquí deberías hacer la llamada a la API para enviar código de registro
    Toast.show({ type: 'info', text1: 'Funcionalidad de código de registro no implementada' });
  }

  const enviarEmailRegistro = () => {
    let emailLower = email.toLowerCase();
    let acceso = "cliente";
    // Aquí deberías hacer la llamada a la API para enviar email de registro
    Toast.show({ type: 'info', text1: 'Funcionalidad de email de registro no implementada' });
  }

  const renderEmail = () => {
    return (
      <View style={style.registerSection}>
        <View style={style.registerCard}>
          <View style={style.iconContainer}>
            <FontAwesome name="user-plus" size={32} color="#00218b" />
          </View>
          <Text style={style.sectionTitle}>Crear Nueva Cuenta</Text>
          <Text style={style.sectionSubtitle}>Únete a Codegas y comienza a gestionar tus pedidos</Text>

          <View style={style.inputContainer}>
            <FontAwesome name="envelope" size={16} color="#666" style={style.inputIcon} />
            <TextInput
              style={[
                style.modernInput,
                email.length < 2 ? style.inputInvalid : null
              ]}
              placeholder="Email o código de registro"
              onChangeText={(email) => setEmail(email)}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={[
              style.modernButton,
              style.registerButton,
              email.length < 2 ? style.disabledButton : null
            ]}
            onPress={() =>
              email.length < 2
                ? Toast.show({ type: 'info', text1: 'Inserte su email o código de registro' })
                : handleSubmit()
            }
            disabled={email.length < 2}>
            <FontAwesome name="arrow-right" size={16} color="#ffffff" />
            <Text style={style.buttonText}>Registrarme</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderIniciarSesion = () => {
    return (
      <View style={style.loginSection}>
        <View style={style.loginCard}>
          <View style={style.iconContainer}>
            <FontAwesome name="sign-in" size={32} color="#00218b" />
          </View>
          <Text style={style.sectionTitle}>Iniciar Sesión</Text>
          <Text style={style.sectionSubtitle}>Accede a tu cuenta de Codegas</Text>

          <View style={style.inputContainer}>
            <FontAwesome name="envelope" size={16} color="#666" style={style.inputIcon} />
            <TextInput
              style={style.modernInput}
              placeholder="Email"
              onChangeText={(e) => updateData('email', e)}
              value={data?.email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          <View style={style.inputContainer}>
            <FontAwesome name="lock" size={16} color="#666" style={style.inputIcon} />
            <TextInput
              style={[style.modernInput, style.passwordInput]}
              placeholder="Contraseña"
              onChangeText={(e) => updateData('password', e)}
              secureTextEntry={!showPassword}
              value={data?.password}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={style.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? "eye-slash" : "eye"}
                size={18}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[style.modernButton, style.loginButton]}
            onPress={signIn}
            disabled={cargando}>
            {cargando ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <FontAwesome name="sign-in" size={16} color="#ffffff" />
            )}
            <Text style={style.buttonText}>
              {cargando ? "Iniciando..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.forgotPasswordButton}
            onPress={() => navigation.navigate("recuperar")}>
            <Text style={style.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            <Text style={style.versionText}>Ver 11.5.3-2</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  //       setErr(err);
  //     });
  // };

  const registroExitoso = (email: string, code: string, id: string) => {
    AsyncStorage.setItem('idPerfilregistro', id);
    navigation.navigate("confirmar", { code, email });
  };
  return (
    <SafeAreaView style={style.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00218b" />
      <HeaderLogo variant="compact" style={{}} />
      <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo2.jpg')} >
        <KeyboardAwareScrollView
          style={style.containerRegistro}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={style.scrollContent}>
          {renderEmail()}
          <View style={style.elegantSeparator}>
            <View style={style.separatorLine} />
            <Text style={style.separatorText}>o</Text>
            <View style={style.separatorLine} />
          </View>
          {renderIniciarSesion()}
        </KeyboardAwareScrollView>
        <View style={style.footer}>
          <Footer navigation={navigation} />
        </View>
      </ImageBackground>
      <Toast />
    </SafeAreaView>
  );
};

const mapState = (state: any) => {
  return {
  };
};

const mapDispatch = (dispatch: any) => {
  return {
  };
};

export default connect(
  mapState,
  mapDispatch
)(IniciarSesion);