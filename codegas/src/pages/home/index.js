import React, { useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useDispatch } from 'react-redux';

import Footer from '../components/footer';

import { getVehiculos } from '../../redux/actions/vehiculoActions';
import { getPedidos } from '../../redux/actions/pedidoActions';
import { DataContext } from '../../context/context';
import { style } from './style';

const Home = ({ navigation }) => {
  const {login, acceso, userId} = useContext(DataContext)  

  const dispatch = useDispatch();
  useEffect(() => {
    console.log(userId)
    dispatch(getVehiculos(30));
    dispatch(getPedidos(userId, 0, 10, acceso, undefined));
 
  }, []);

  const renderBotones = () => {
    return (
      <View>
        <TouchableOpacity style={[style.btn, { marginTop: 10 }]} onPress={() => navigation.navigate(userId ? 'nuevo_pedido' : 'perfil')}>
          <Image source={require('../../assets/img/pg2/bot02.png')} style={style.icon} />
          <Text style={style.text}>NUEVO PEDIDO</Text>
        </TouchableOpacity>
        {acceso == 'cliente' && (
          <TouchableOpacity style={[style.btn, { marginTop: 10 }]} onPress={() => navigation.navigate('chart')}>
            <Image source={require('../../assets/img/pg2/bot02.png')} style={style.icon} />
            <Text style={style.text}>INFORMES</Text>
          </TouchableOpacity>
        )}
        {acceso != 'pedidos' && (
          <TouchableOpacity
            style={style.btn}
            onPress={() =>
              acceso == 'admin' || acceso == 'solucion'
                ? navigation.navigate('conversacion', { tokenPhone, acceso })
                : formularioChat
                ? navigation.navigate('conversacion', { tokenPhone, acceso })
                : this.setState({ modal: true })
            }>
            <Image source={require('../../assets/img/pg2/bot03.png')} style={style.icon} />
            <Text style={style.text}>CHAT</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderBtnUsuarios = () => {
    return (
      <ImageBackground style={style.fondoOnline} source={require('../../assets/img/pg2/bot01.png')} resizeMode={'contain'}>
        <TouchableOpacity style={style.btnUsuariosOnline} onPress={this.state.usuariosEntrando.length == 0 ? null : () => this.crearConversacion()}>
          <Text style={style.textUsuariosOnline}>Hay {this.state.usuariosEntrando.length} Usuarios en espera </Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  };

  return (
    <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo.jpg')}>
      {renderBotones()}
      <View style={style.contenedorColores}>
        <View style={style.subContenedorColor}>
          <View style={[style.color, { backgroundColor: 'rgba(91, 192, 222, 0.79)' }]}></View>
          <Text style={style.textColor}>Pedido en espera</Text>
        </View>
        <View style={style.subContenedorColor}>
          <View style={[style.color, { backgroundColor: 'rgba(255, 235, 0, 0.79)' }]}></View>
          <Text style={style.textColor}>Pedido activo</Text>
        </View>
        <View style={style.subContenedorColor}>
          <View style={[style.color, { backgroundColor: 'rgba(240, 173, 78, 0.79)' }]}></View>
          <Text style={style.textColor}>Pedido asignado</Text>
        </View>
        <View style={style.subContenedorColor}>
          <View style={[style.color, { backgroundColor: 'rgba(92, 184, 92, 0.79)' }]}></View>
          <Text style={style.textColor}>Pedido entregado</Text>
        </View>
        <View style={style.subContenedorColor}>
          <View style={[style.color, { backgroundColor: '#ffffff' }]}></View>
          <Text style={style.textColor}>Pedido no entregado</Text>
        </View>
        <View style={style.subContenedorColor}>
          <View style={[style.color, { backgroundColor: 'rgba(217, 83, 79, 0.79)' }]}></View>
          <Text style={style.textColor}>Pedido inactivo</Text>
        </View>
      </View>
      <Footer navigation={navigation} />
    </ImageBackground>
  );
};

export default Home;
