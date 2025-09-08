import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './style';
import axios from 'axios';
import { DataContext } from '../../context/context';

export default function FooterComponent({ navigation }) {
  const {userId} = useContext(DataContext)  

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
      <TouchableOpacity style={style.subContenedorFooter} onPress={() => navigation.navigate('Home')}>
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
          onPress={() => navigation.navigate(userId ? 'nuevo_pedido' : 'IniciarSesion')}
        >
          <Image source={require('../../assets/img/footer/img2.png')} style={style.icon} resizeMode={'contain'} />
          <Text style={style.textFooter}>Nuevo Pedido</Text>
        </TouchableOpacity>
      )}

    
        <TouchableOpacity
          style={style.subContenedorFooter3}
          onPress={() => { navigation.navigate(userId ? 'pedido' : 'IniciarSesion') }}          
        >
          <Image source={require('../../assets/img/footer/img3.png')} style={style.icon} resizeMode={'contain'} />
          <Text style={style.textFooter}>Pedidos</Text>
          {badgeSocketPedido > 0 && (
            <View style={style.badge}>
              <Text style={style.textBadge}>{badgeSocketPedido}</Text>
            </View>
          )}
        </TouchableOpacity>
     

      <TouchableOpacity 
        style={style.subContenedorFooter} 
        onPress={() => 
          userId
          ?navigation.navigate('Perfil')
          :navigation.navigate('IniciarSesion')
        }
      >
        <Image source={require('../../assets/img/footer/img4.png')} style={style.icon} resizeMode={'contain'} />
        <Text style={style.textFooter}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}
