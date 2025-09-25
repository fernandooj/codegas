import React, { useContext, useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  ImageBackground
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './style';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import axios from 'axios';
import HeaderLogo from '../../components/HeaderLogo';
import { DataContext } from '../../context/context';
import Footer from '../components/footer'

const Perfil = ({
  navigation,
}) => {

  const { nombre, avatar, email, userInfo, acceso, cerrarSesion, updateUserData } = useContext(DataContext)
  const [idUsuarioSearch, setIdUsuarioSearch] = useState('')

  // Estados locales para mostrar los datos más recientes
  const [currentNombre, setCurrentNombre] = useState(nombre)
  const [currentEmail, setCurrentEmail] = useState(email)

  // Efecto para sincronizar estados locales con el contexto
  useEffect(() => {
    if (nombre && nombre !== currentNombre) {
      setCurrentNombre(nombre);
    }
    if (email && email !== currentEmail) {
      setCurrentEmail(email);
    }
  }, [nombre, email, currentNombre, currentEmail]);

  // Efecto que se ejecuta cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {

      // Recargar datos desde AsyncStorage para asegurarse de que estén actualizados
      const reloadUserData = async () => {
        try {
          const [storedNombre, storedEmail, storedAvatar] = await AsyncStorage.multiGet([
            'nombre', 'email', 'avatar'
          ]);

          const newUserData = {
            nombre: storedNombre[1],
            email: storedEmail[1],
            avatar: storedAvatar[1]
          };


          // Actualizar estados locales inmediatamente
          if (newUserData.nombre && newUserData.nombre !== currentNombre) {
            setCurrentNombre(newUserData.nombre);
          }
          if (newUserData.email && newUserData.email !== currentEmail) {
            setCurrentEmail(newUserData.email);
          }

          // Actualizar siempre si hay datos en AsyncStorage y la función está disponible
          if (updateUserData && (newUserData.nombre || newUserData.email || newUserData.avatar)) {
            await updateUserData(newUserData);
          }
        } catch (error) {
          console.error('❌ Error recargando datos del perfil:', error);
        }
      };

      reloadUserData();
    }, [nombre, avatar, email, acceso, updateUserData, currentNombre, currentEmail])
  );
  const searchUser = () => {
    axios.get(`users/by/asefsfxf323-dxc/${idUsuarioSearch}`)
      .then(res => {
        if (res.data) {
          cambioPerfil(res.data.users);
        } else {
          Toast.show("Tenemos un problema, intentelo mas tarde");
        }
      })
      .catch(err => {
        Toast.show("Tenemos un problema, intentelo mas tarde");
      });
  };




  const cambioPerfil = (user) => {
    AsyncStorage.setItem('userId', user._id);
    AsyncStorage.setItem('nombre', user.nombre);
    AsyncStorage.setItem('email', user.email);
    AsyncStorage.setItem('acceso', user.acceso);
    AsyncStorage.setItem('avatar', user.avatar ? user.avatar : "null");
    AsyncStorage.setItem('tokenPhone', tokenPhone);
    navigation.navigate("Home");
  };
  const RenderPerfil = () => {
    return (

      <ScrollView style={style.containerRegistro}>
        <View style={style.perfilContenedor}>
          <View style={style.columna4}>
            {(!avatar || avatar === 'null' || avatar === null || avatar === undefined || avatar === '') ? (
              <FontAwesome name={'user-circle'} style={style.iconAvatar} />
            ) : (
              <Image source={{ uri: avatar }} style={style.avatar} />
            )}
          </View>
          <View style={style.columna2}>
            <Text style={style.nombre}>{currentNombre || nombre}</Text>
            <Text style={style.email}>{currentEmail || email}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={style.btnLista}
            onPress={() => navigation.navigate('verPerfil', { tipoAcceso: null })}>
            <Text style={style.txtLista}>Editar perfil</Text>
            <View style={style.icon}>
              <FontAwesome name="user" style={{ fontSize: 18, color: '#ffffff' }} />
            </View>
          </TouchableOpacity>

          {/* {(acceso === 'admin' || acceso === 'despacho') && (
          <TouchableOpacity
            style={style.btnLista}
            onPress={() =>
              navigation.navigate('verPerfil', {tipoAcceso: 'admin'})
            }>
            <Text style={style.txtLista}>Crear Usuario</Text>
            <Image
              source={require('../../assets/img/pg1/icon1.png')}
              style={style.icon}
            />
          </TouchableOpacity>
        )} */}
          {(acceso === 'admin' ||
            acceso === 'solucion' ||
            acceso === 'comercial' ||
            acceso === 'veo' ||
            acceso === 'despacho') && (
              <TouchableOpacity
                style={style.btnLista}
                onPress={() => navigation.navigate('clientes')}>
                <Text style={style.txtLista}>Clientes</Text>
                <View style={style.icon}>
                  <FontAwesome name="users" style={{ fontSize: 18, color: '#ffffff' }} />
                </View>
              </TouchableOpacity>
            )}
          {(acceso === 'admin' || acceso === 'solucion') && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('frecuencia')}>
              <Text style={style.txtLista}>Frecuencias</Text>
              <View style={style.icon}>
                <FontAwesome name="clock-o" style={{ fontSize: 18, color: '#ffffff' }} />
              </View>
            </TouchableOpacity>
          )}
          {(acceso === 'solucion' || acceso === 'admin' || acceso === 'veo') && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('usuarios')}>
              <Text style={style.txtLista}>Usuarios</Text>
              <View style={style.icon}>
                <FontAwesome name="user-plus" style={{ fontSize: 18, color: '#ffffff' }} />
              </View>
            </TouchableOpacity>
          )}
          {(acceso === 'admin') && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() =>
                navigation.navigate('vehiculo', { tipoAcceso: 'admin' })
              }>
              <Text style={style.txtLista}>Vehiculos</Text>
              <View style={style.icon}>
                <FontAwesome name="truck" style={{ fontSize: 18, color: '#ffffff' }} />
              </View>
            </TouchableOpacity>
          )}
          {(acceso === 'admin' || acceso === 'despacho') && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('zona')}>
              <Text style={style.txtLista}>Zonas</Text>
              <View style={style.icon}>
                <FontAwesome name="map-marker" style={{ fontSize: 30, color: '#ffffff' }} />
              </View>
            </TouchableOpacity>
          )}

          {/* {(acceso === 'admin' ||
          acceso === 'comercial' ||
          acceso === 'depTecnico' ||
          acceso === 'adminTanque') && (
          <TouchableOpacity
            style={style.btnLista}
            onPress={() => navigation.navigate('tanques')}>
            <Text style={style.txtLista}>Tanques</Text>
            <Image
              source={require('../../assets/img/pg1/icon6.png')}
              style={style.icon}
            />
          </TouchableOpacity>
        )} */}
          {(acceso === 'admin' ||
            acceso === 'comercial' ||
            acceso === 'depTecnico' ||
            acceso === 'insSeguridad' ||
            acceso === 'adminTanque') && (
              <TouchableOpacity
                style={style.btnLista}
                onPress={() => navigation.navigate('revision', { revision: true })}>
                <Text style={style.txtLista}>Revisión y control tanques</Text>
                <View style={style.icon}>
                  <FontAwesome name="clipboard" style={{ fontSize: 18, color: '#ffffff' }} />
                </View>
              </TouchableOpacity>
            )}
          {(acceso === 'admin' ||
            acceso === 'comercial' ||
            acceso === 'depTecnico' ||
            acceso === 'insSeguridad' ||
            acceso === 'veo' ||
            acceso === 'cliente') && (
              <TouchableOpacity
                style={style.btnLista}
                onPress={() =>
                  navigation.navigate('reporteEmergencia', { revision: true })
                }>
                <Text style={style.txtLista}>Reporte de emergencia</Text>
                <View style={style.icon}>
                  <FontAwesome name="exclamation-triangle" style={{ fontSize: 18, color: '#ffffff' }} />
                </View>
              </TouchableOpacity>
            )}
          {acceso === 'admin' && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('capacidad')}>
              <Text style={style.txtLista}>Capacidades</Text>
              <View style={style.icon}>
                <FontAwesome name="database" style={{ fontSize: 18, color: '#ffffff' }} />
              </View>
            </TouchableOpacity>
          )}

          {acceso === 'admin' && email === 'fernandooj@ymail.com' && (
            <View style={[style.btnLista, { backgroundColor: '#3498db' }]}>
              <TextInput
                style={[style.txtLista, { color: '#ffffff', flex: 1 }]}
                onChangeText={idUsuarioSearch => setIdUsuarioSearch(idUsuarioSearch)}
                placeholder="ID de usuario"
                placeholderTextColor="rgba(255,255,255,0.7)"
              />
              <TouchableOpacity
                onPress={() => {
                  searchUser();
                }}>
                <View style={[style.icon, { backgroundColor: '#ffffff' }]}>
                  <FontAwesome name={'search'} style={{ fontSize: 18, color: '#3498db' }} />
                </View>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={[style.btnLista, style.btnCerrarSesion]}
            onPress={() => {
              cerrarSesion();
              navigation.navigate('Home')

            }}>
            <Text style={[style.txtLista, style.txtCerrarSesion]}>Cerrar Sesión</Text>
            <View style={[style.icon, { backgroundColor: '#ffffff' }]}>
              <FontAwesome name="sign-out" style={{ fontSize: 18, color: '#e74c3c' }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[style.btnLista, style.btnVersion]}>
            <Text style={[style.txtLista, style.txtVersion]}>Ver 11.5.3-1</Text>
            <View style={[style.icon, { backgroundColor: '#ffffff' }]}>
              <FontAwesome name="info-circle" style={{ fontSize: 18, color: '#95a5a6' }} />
            </View>
          </TouchableOpacity>
          {/* {err && <Text>{err}</Text>} */}
        </View>
      </ScrollView>
    )
  }
  return (
    <View style={style.container} >
      <HeaderLogo variant="compact" style={{}} />
      <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo2.jpg')} >
        {RenderPerfil()}
        <View style={style.footer}>
          <Footer navigation={navigation} />
        </View>
      </ImageBackground>
    </View>
  )
};

export default Perfil;
