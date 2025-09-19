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
      console.log('🔄 Sincronizando nombre del contexto:', nombre);
      setCurrentNombre(nombre);
    }
    if (email && email !== currentEmail) {
      console.log('🔄 Sincronizando email del contexto:', email);
      setCurrentEmail(email);
    }
  }, [nombre, email, currentNombre, currentEmail]);

  // Efecto que se ejecuta cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      console.log('Perfil screen focused - ejecutándose cada vez que navegas aquí');
      console.log('Datos actuales:', { nombre, avatar, email, acceso });

      // Recargar datos desde AsyncStorage para asegurarse de que estén actualizados
      const reloadUserData = async () => {
        try {
          console.log('🔄 Recargando datos del perfil...');
          const [storedNombre, storedEmail, storedAvatar] = await AsyncStorage.multiGet([
            'nombre', 'email', 'avatar'
          ]);

          const newUserData = {
            nombre: storedNombre[1],
            email: storedEmail[1],
            avatar: storedAvatar[1]
          };

          console.log('📱 Datos en AsyncStorage:', newUserData);
          console.log('🔍 Datos actuales del contexto:', { nombre, email, avatar });
          console.log('🔧 updateUserData disponible:', !!updateUserData);

          // Actualizar estados locales inmediatamente
          if (newUserData.nombre && newUserData.nombre !== currentNombre) {
            console.log('🔄 Actualizando nombre local:', newUserData.nombre);
            setCurrentNombre(newUserData.nombre);
          }
          if (newUserData.email && newUserData.email !== currentEmail) {
            console.log('🔄 Actualizando email local:', newUserData.email);
            setCurrentEmail(newUserData.email);
          }

          // Actualizar siempre si hay datos en AsyncStorage y la función está disponible
          if (updateUserData && (newUserData.nombre || newUserData.email || newUserData.avatar)) {
            console.log('✅ Actualizando datos del perfil desde AsyncStorage:', newUserData);
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
        console.log(res.data)
        if (res.data) {
          cambioPerfil(res.data.users);
        } else {
          Toast.show("Tenemos un problema, intentelo mas tarde");
        }
      })
      .catch(err => {
        console.log(err);
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
    console.log('🖼️ Avatar value:', avatar, typeof avatar);
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
            <Text style={style.nombre}>{currentEmail || email}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={style.btnLista}
            onPress={() => navigation.navigate('verPerfil', { tipoAcceso: null })}>
            <Text style={style.txtLista}>Editar perfil</Text>
            <Image
              source={require('../../assets/img/pg1/icon2.png')}
              style={style.icon}
            />
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
                <Image
                  source={require('../../assets/img/pg1/icon3.png')}
                  style={style.icon}
                />
              </TouchableOpacity>
            )}
          {(acceso === 'admin' || acceso === 'solucion') && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('frecuencia')}>
              <Text style={style.txtLista}>Frecuencias</Text>
              <Image
                source={require('../../assets/img/pg1/icon6.png')}
                style={style.icon}
              />
            </TouchableOpacity>
          )}
          {(acceso === 'solucion' || acceso === 'admin' || acceso === 'veo') && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('usuarios')}>
              <Text style={style.txtLista}>Usuarios</Text>
              <Image
                source={require('../../assets/img/pg1/icon1.png')}
                style={style.icon}
              />
            </TouchableOpacity>
          )}
          {(acceso === 'admin' || acceso === 'despacho') && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() =>
                navigation.navigate('vehiculo', { tipoAcceso: 'admin' })
              }>
              <Text style={style.txtLista}>Vehiculos</Text>
              <Image
                source={require('../../assets/img/pg1/icon4.png')}
                style={style.icon}
              />
            </TouchableOpacity>
          )}
          {(acceso === 'admin' || acceso === 'despacho') && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('zona')}>
              <Text style={style.txtLista}>Zonas</Text>
              <Image
                source={require('../../assets/img/pg1/icon5.png')}
                style={style.icon}
              />
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
                onPress={() => navigation.navigate('usuarios', { revision: true })}>
                <Text style={style.txtLista}>Revision y control tanques</Text>
                <Image
                  source={require('../../assets/img/pg1/icon6.png')}
                  style={style.icon}
                />
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
                <Image
                  source={require('../../assets/img/pg1/icon6.png')}
                  style={style.icon}
                />
              </TouchableOpacity>
            )}
          {acceso === 'admin' && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('capacidad')}>
              <Text style={style.txtLista}>Capacidades</Text>
              <Image
                source={require('../../assets/img/pg1/icon6.png')}
                style={style.icon}
              />
            </TouchableOpacity>
          )}

          {acceso === 'admin' && email === 'fernandooj@ymail.com' && (
            <View style={style.btnLista}>
              <TextInput
                style={style.txtLista}
                onChangeText={idUsuarioSearch => setIdUsuarioSearch(idUsuarioSearch)}
                placeholder="id"
              />
              <TouchableOpacity
                style={style.btnLista}
                onPress={() => {
                  searchUser();
                }}>
                <FontAwesome name={'star'} style={style.icon} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={style.btnLista}
            onPress={() => {
              cerrarSesion();
              navigation.navigate('Home')

            }}>
            <Text style={style.txtLista}>Cerrar Sesion</Text>
            <Image
              source={require('../../assets/img/pg1/icon7.png')}
              style={style.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={style.btnLista}>
            <Text style={[style.txtLista, { fontSize: 11 }]}>Ver 11.5.3-1</Text>
          </TouchableOpacity>
          {/* {err && <Text>{err}</Text>} */}
        </View>
      </ScrollView>
    )
  }
  return (
    <View style={style.container} >
      <Image source={require('../../assets/img/pg1/fondo1.jpg')} style={style.cabezera} />
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
