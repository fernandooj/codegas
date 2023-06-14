import React, { Component, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './style';
import axios from 'axios';

export default function FooterComponent({ navigation }) {
  const [user, setUser] = useState({});
  const [badgeMessage, setBadgeMessage] = useState(true);
  const [badgeCuenta, setBadgeCuenta] = useState(true);
  const [badgeSocketMessage, setBadgeSocketMessage] = useState(0);
  const [badgeSocketCuenta, setBadgeSocketCuenta] = useState(0);
  const [badgeSocketPedido, setBadgeSocketPedido] = useState(0);
  const [badgeSocketConversacion, setBadgeSocketConversacion] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const status = await AsyncStorage.getItem('status');
      const idUsuario = await AsyncStorage.getItem('userId');
      const nombre = await AsyncStorage.getItem('nombre');
      const email = await AsyncStorage.getItem('email');
      const avatar = await AsyncStorage.getItem('avatar');
      const acceso = await AsyncStorage.getItem('acceso');
      let badgeSocketPedido = await AsyncStorage.getItem('badgeSocketPedido');
      badgeSocketPedido ? badgeSocketPedido : 0;

      setUser({ nombre, email, avatar, idUsuario, acceso, badgeSocketPedido: JSON.parse(badgeSocketPedido) });

      axios.get('user/perfil/').then((e) => {
        setUser({ status: e.data.status, user: e.data.user });
      });

      // Remove socket related code
    };

    fetchData();
  }, []);

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
    let badgeSocketPedido = badgeSocketPedido;
    let suma = badgeSocketPedido + messages;
    let badgePedido = JSON.stringify(suma);
    await AsyncStorage.setItem('badgeSocketPedido', badgePedido);
    setBadgeSocketPedido(badgeSocketPedido + messages);
    setBadgePedido(true);
  };

  const recivePedidoConductor = async (messages) => {
    let badgeSocketPedido = badgeSocketPedido;
    let suma = badgeSocketPedido + messages;
    let badgePedido = JSON.stringify(suma);
    await AsyncStorage.setItem('badgeSocketPedido', badgePedido);
    setBadgeSocketPedido(badgeSocketPedido + messages);
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

 
  return (
    <View style={style.contenedorFooter}>
      <TouchableOpacity style={style.subContenedorFooter} onPress={() => navigation.navigate('inicio')}>
        <Image source={require('../../assets/img/footer/img1.png')} style={style.icon} resizeMode={'contain'} />
        <Text style={style.textFooter}>Inicio</Text>
        {badgeSocketConversacion > 0 && badgeCuenta && (
          <View style={style.badge}>
            <Text style={style.textBadge}>{badgeSocketConversacion}</Text>
          </View>
        )}
        {badgeSocketMessage > 0 && badgeMessage && (
          <View style={style.badge}>
            <Text style={style.textBadge}>{badgeSocketMessage}</Text>
          </View>
        )}
      </TouchableOpacity>

      {user.acceso !== 'conductor' && (
        <TouchableOpacity
          style={style.subContenedorFooter2}
          onPress={() => navigation.navigate(userId ? 'nuevo_pedido' : 'perfil')}
        >
          <Image source={require('../../assets/img/footer/img2.png')} style={style.icon} resizeMode={'contain'} />
          <Text style={style.textFooter}>Nuevo Pedido</Text>
        </TouchableOpacity>
      )}

      {user.acceso !== 'pedidos' && (
        <TouchableOpacity
          style={user.acceso == 'conductor' ? style.subContenedorFooterConductor : style.subContenedorFooter3}
          onPress={() => {
            userId ? pedidos() : navigation.navigate('perfil');
          }}
        >
          <Image source={require('../../assets/img/footer/img3.png')} style={style.icon} resizeMode={'contain'} />
          <Text style={style.textFooter}>Pedidos</Text>
          {badgeSocketPedido > 0 && (
            <View style={style.badge}>
              <Text style={style.textBadge}>{badgeSocketPedido}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity style={style.subContenedorFooter} onPress={() => navigation.navigate('perfil', { userId })}>
        <Image source={require('../../assets/img/footer/img4.png')} style={style.icon} resizeMode={'contain'} />
        <Text style={style.textFooter}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}
