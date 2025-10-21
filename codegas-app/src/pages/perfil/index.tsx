import React, { useContext, useState, useCallback, useEffect } from 'react';
import {ScrollView, View, TouchableOpacity, Image, Text, TextInput, ImageBackground, Dimensions, Platform, StatusBar} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './style';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import axios from 'axios';
import HeaderLogo from '../../components/HeaderLogo';
import { DataContext } from '../../context/context';
import Footer from '../components/footer';
import Toast from 'react-native-toast-message';
import { PerfilProps, UserData, StoredUserData, UserSearchResponse, ProfileState, DataContextType, UserAccess} from './types';
import { getResponsiveValue } from './responsiveStyles';
import DeleteAccountModal from '../../components/DeleteAccountModal';

const Perfil: React.FC<PerfilProps> = ({ navigation }) => {

  const { nombre, avatar, email, userInfo, acceso, cerrarSesion, updateUserData } = useContext(DataContext) as DataContextType;

  const [idUsuarioSearch, setIdUsuarioSearch] = useState<string>('');
  const [currentNombre, setCurrentNombre] = useState<string>(nombre);
  const [currentEmail, setCurrentEmail] = useState<string>(email);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');

  // Efecto para cargar userId desde AsyncStorage
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error loading userId:', error);
      }
    };
    loadUserId();
  }, []);

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

          const newUserData: StoredUserData = {
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
  const searchUser = (): void => {
    axios.get<UserSearchResponse>(`users/by/asefsfxf323-dxc/${idUsuarioSearch}`)
      .then((res) => {
        if (res.data?.data?.users) {
          cambioPerfil(res.data.data.users);
        } else {
          Toast.show({
            type: 'error',
            text1: "Tenemos un problema, intentelo mas tarde"
          });
        }
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: "Tenemos un problema, intentelo mas tarde"
        });
      });
  };




  const cambioPerfil = (user: UserData): void => {
    AsyncStorage.setItem('userId', user._id);
    AsyncStorage.setItem('nombre', user.nombre);
    AsyncStorage.setItem('email', user.email);
    AsyncStorage.setItem('acceso', user.acceso);
    AsyncStorage.setItem('avatar', user.avatar ? user.avatar : "null");
    // Note: tokenPhone variable is not defined in the original code
    // AsyncStorage.setItem('tokenPhone', tokenPhone);
    navigation.navigate("Home");
  };

  const handleAccountDeleted = () => {
    // Clear all local data and navigate to login
    cerrarSesion();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };
  const RenderPerfil = () => {
    return (

      <ScrollView style={style.containerRegistro}>
        <View style={style.perfilContenedor}>
          <View style={style.columna4}>
            {(!avatar || avatar === 'null' || avatar === null || avatar === undefined || avatar === '') ? (
              <FontAwesome name={'user-circle'} style={style.iconAvatar} testID="avatar-icon" />
            ) : (
              <Image source={{ uri: avatar }} style={style.avatar} testID="avatar-image" />
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
              <FontAwesome name="user" style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#ffffff' }} />
            </View>
          </TouchableOpacity>
          {(['solucion', 'admin'] as UserAccess[]).includes(acceso) && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('usuarios')}>
              <Text style={style.txtLista}>Usuarios</Text>
              <View style={style.icon}>
                <FontAwesome name="user-plus" style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#ffffff' }} />
              </View>
            </TouchableOpacity>
          )}
          {(['admin', 'solucion', 'comercial', 'veo', 'despacho'] as UserAccess[]).includes(acceso) && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('clientes')}>
              <Text style={style.txtLista}>Clientes</Text>
              <View style={style.icon}>
                <FontAwesome name="users" style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#ffffff' }} />
              </View>
            </TouchableOpacity>
          )}
          {(['admin', 'comercial'] as UserAccess[]).includes(acceso) && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('frecuencia')}>
              <Text style={style.txtLista}>Frecuencias</Text>
              <View style={style.icon}>
                <FontAwesome name="clock-o" style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#ffffff' }} />
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
                <FontAwesome name="truck" style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#ffffff' }} />
              </View>
            </TouchableOpacity>
          )}
          {(['admin', 'despacho'] as UserAccess[]).includes(acceso) && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('zona')}>
              <Text style={style.txtLista}>Zonas</Text>
              <View style={style.icon}>
                <FontAwesome name="map-marker" style={{ fontSize: getResponsiveValue(32, 36, 40), color: '#ffffff' }} />
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
          {(['admin', 'comercial', 'depTecnico', 'insSeguridad', 'adminTanque'] as UserAccess[]).includes(acceso) && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('revision', { revision: true })}>
              <Text style={style.txtLista}>Revisión y control tanques</Text>
              <View style={style.icon}>
                <FontAwesome name="clipboard" style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#ffffff' }} />
              </View>
            </TouchableOpacity>
          )}
          {(['admin', 'comercial', 'depTecnico', 'insSeguridad', 'veo', 'cliente'] as UserAccess[]).includes(acceso) && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() =>
                navigation.navigate('reporteEmergencia', { revision: true })
              }>
              <Text style={style.txtLista}>Reporte de emergencia</Text>
              <View style={style.icon}>
                <FontAwesome name="exclamation-triangle" style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#ffffff' }} />
              </View>
            </TouchableOpacity>
          )}
          {acceso === 'admin' && (
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => navigation.navigate('capacidad')}>
              <Text style={style.txtLista}>Capacidades</Text>
              <View style={style.icon}>
                <FontAwesome name="database" style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#ffffff' }} />
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
                testID="search-button"
                onPress={() => {
                  searchUser();
                }}>
                <View style={[style.icon, { backgroundColor: '#ffffff' }]}>
                  <FontAwesome name={'search'} style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#3498db' }} />
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
              <FontAwesome name="sign-out" style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#e74c3c' }} />
            </View>
          </TouchableOpacity>

          {/* Account Deactivation Button - Only for regular users, not admin/system accounts */}

          <TouchableOpacity
            style={[style.btnLista, { backgroundColor: '#8e44ad' }]}
            onPress={() => setShowDeleteModal(true)}>
            <Text style={[style.txtLista, { color: '#ffffff' }]}>Eliminar Cuenta</Text>
            <View style={[style.icon, { backgroundColor: '#ffffff' }]}>
              <FontAwesome name="ban" style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#8e44ad' }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[style.btnLista, style.btnVersion]}>
            <Text style={[style.txtLista, style.txtVersion]}>Ver 11.5.3-1</Text>
            <View style={[style.icon, { backgroundColor: '#ffffff' }]}>
              <FontAwesome name="info-circle" style={{ fontSize: getResponsiveValue(24, 28, 32), color: '#95a5a6' }} />
            </View>
          </TouchableOpacity>
          {/* {err && <Text>{err}</Text>} */}
        </View>
      </ScrollView>
    )
  }
  return (
    <View style={style.container}>
      <HeaderLogo variant="compact" style={{}} />
      <View style={style.contentBackground}>
        {RenderPerfil()}
      </View>
      <Footer navigation={navigation} />

      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onAccountDeleted={handleAccountDeleted}
        userName={currentNombre || nombre}
        userId={userId}
      />
    </View>
  )
};

export default Perfil;
