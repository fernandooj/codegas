import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { style } from './style';
import axios from 'axios';
import { DataContext } from '../../context/context';

export default function FooterComponent({ navigation, currentRoute = 'Home' }) {
  const { userId, acceso } = useContext(DataContext)
  const insets = useSafeAreaInsets();

  // Detectar la ruta actual desde el navigation state
  const [currentRouteState, setCurrentRouteState] = useState(currentRoute);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      const currentRouteName = e.data.state?.routes?.[e.data.state?.index]?.name || 'Home';
      setCurrentRouteState(currentRouteName);
    });

    return unsubscribe;
  }, [navigation]);
  const [user, setUser] = useState({});
  const [badgeMessage, setBadgeMessage] = useState(true);
  const [badgeCuenta, setBadgeCuenta] = useState(true);
  const [badgeSocketMessage, setBadgeSocketMessage] = useState(0);
  const [badgeSocketCuenta, setBadgeSocketCuenta] = useState(0);
  const [badgeSocketPedido, setBadgeSocketPedido] = useState(0);
  const [badgeSocketConversacion, setBadgeSocketConversacion] = useState(0);

  const reciveMensanje = (messages) => {
    setBadgeSocketMessage(badgeSocketMessage + 1);
    setBadgeMessage(true);
  };

  const reciveMensanjeCuenta = (messages) => {
    setBadgeSocketCuenta(badgeSocketCuenta + 1);
    setBadgeCuenta(true);
  };

  const reciveMensanjeConversacion = (messages) => {
    setBadgeSocketConversacion(1);
    setBadgeCuenta(true);
  };

  const recivePedido = async (messages) => {
    let badgeSocketPedidoValue = badgeSocketPedido;
    let suma = badgeSocketPedidoValue + messages;
    let badgePedido = JSON.stringify(suma);
    await AsyncStorage.setItem('badgeSocketPedido', badgePedido);
    setBadgeSocketPedido(badgeSocketPedidoValue + messages);
    setBadgePedido(true);
  };

  const recivePedidoConductor = async (messages) => {
    let badgeSocketPedidoValue = badgeSocketPedido;
    let suma = badgeSocketPedidoValue + messages;
    let badgePedido = JSON.stringify(suma);
    await AsyncStorage.setItem('badgeSocketPedido', badgePedido);
    setBadgeSocketPedido(badgeSocketPedidoValue + messages);
    setBadgePedido(true);
  };

  const pedidos = () => {
    setBadgeCuenta(false);
    setBadgeSocketCuenta(0);
    AsyncStorage.setItem('badgeSocketPedido', '0');
    navigation.navigate('pedido');
  };

  const mensaje = () => {
    setBadgeMessage(false);
    setBadgeSocketMessage(0);
    navigation.navigate('conversacion');
  };

  // Función para determinar si un tab está activo
  const isActiveTab = (tabName) => {
    return currentRouteState === tabName;
  };


  // Crear estilo dinámico que respete las safe areas
  const dynamicFooterWrapper = {
    ...style.footerWrapper,
    marginBottom: -insets.bottom, // Empujar hacia abajo para llegar al borde físico
    paddingBottom: insets.bottom, // Agregar padding interno para el contenido
  };


  return (
    <View style={dynamicFooterWrapper}>

      {/* Contenedor del footer principal */}
      <View style={style.contenedorFooter}>

        {/* Tab Home */}
        <TouchableOpacity
          style={style.tabContainer}
          onPress={() => navigation.navigate('Home')}
        >
          <View style={style.iconContainer}>
            <FontAwesome name="home" style={style.iconFont} />
          </View>
        </TouchableOpacity>

        {/* Tab Nuevo Pedido - Solo si no es conductor */}
        {acceso !== 'conductor' && (
          <TouchableOpacity
            style={style.tabContainer}
            onPress={() => navigation.navigate(userId ? 'nuevo_pedido' : 'IniciarSesion')}
          >
            <View style={style.iconContainer}>
              <FontAwesome name="plus" style={style.iconFont} />
            </View>
          </TouchableOpacity>
        )}

        {/* Tab Pedidos */}
        <TouchableOpacity
          style={style.tabContainer}
          onPress={() => navigation.navigate('pedido')}
        >
          <View style={style.iconContainer}>
            <Image
              source={require('../../assets/img/footer/img2.png')}
              style={style.icon}
              resizeMode={'contain'}
            />
          </View>
        </TouchableOpacity>

        {/* Tab Perfil */}
        <TouchableOpacity
          style={style.tabContainer}
          onPress={() =>
            userId
              ? navigation.navigate('Perfil')
              : navigation.navigate('IniciarSesion')
          }
        >
          <View style={style.iconContainer}>
            <Image
              source={require('../../assets/img/footer/img4.png')}
              style={style.icon}
              resizeMode={'contain'}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}