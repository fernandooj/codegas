import React, { useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';

import Footer from '../components/footer';

import { getVehiculos } from '../../redux/actions/vehiculoActions';
import { getPedidos } from '../../redux/actions/pedidoActions';
import { DataContext } from '../../context/context';
import { style } from './style';
import { colors } from '../../utils/colors';

const Home = ({ navigation }) => {
  const { login, acceso, userId, nombre } = useContext(DataContext)
  limit = acceso === 'conductor' ? 50 : 10
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getVehiculos(30));
    dispatch(getPedidos(userId, 0, limit, acceso, undefined));
  }, [userId, acceso]);

  const renderBotones = () => {
    const botones = [
      {
        title: 'NUEVO PEDIDO',
        subtitle: 'Crear un pedido nuevo',
        icon: '➕',
        color: '#007bff',
        gradient: ['#007bff', '#0056b3'],
        onPress: () => navigation.navigate(userId ? 'nuevo_pedido' : 'Perfil'),
        show: true
      },
      {
        title: 'INFORMES',
        subtitle: 'Ver reportes y estadísticas',
        icon: '📊',
        color: '#28a745',
        gradient: ['#28a745', '#1e7e34'],
        onPress: () => navigation.navigate('chart'),
        show: acceso == 'cliente'
      },
      {
        title: 'CHAT',
        subtitle: 'Conversaciones y soporte',
        icon: '💬',
        color: '#ffc107',
        gradient: ['#ffc107', '#e0a800'],
        onPress: () => {
          if (acceso == 'admin' || acceso == 'solucion') {
            navigation.navigate('conversacion', { tokenPhone, acceso });
          } else {
            // Manejar chat para otros usuarios
            navigation.navigate('conversacion', { tokenPhone, acceso });
          }
        },
        show: acceso != 'pedidos'
      }
    ];

    return (
      <View style={style.botonesContainer}>
        {botones.filter(boton => boton.show).map((boton, index) => (
          <TouchableOpacity
            key={index}
            style={[style.btnModerno, { backgroundColor: boton.color }]}
            onPress={boton.onPress}
            activeOpacity={0.8}
          >
            <View style={style.btnContent}>
              <View style={style.iconContainer}>
                <Text style={[style.iconModerno, { color: '#fff' }]}>{boton.icon}</Text>
              </View>
              <View style={style.textContainer}>
                <Text style={style.titleModerno}>{boton.title}</Text>
                <Text style={style.subtitleModerno}>{boton.subtitle}</Text>
              </View>
              <Text style={style.chevron}>▶</Text>
            </View>
          </TouchableOpacity>
        ))}
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

  const renderLeyendaEstados = () => {
    const estados = [
      { color: colors.espera, texto: 'En espera', icon: '⏰' },
      { color: colors.activo, texto: 'Activo', icon: '▶️' },
      { color: colors.asignado, texto: 'Asignado', icon: '🚛' },
      { color: colors.otro, texto: 'Entregado', icon: '✅' },
      { color: colors.noentregado, texto: 'No entregado', icon: '❌', textColor: '#333' },
      { color: colors.innactivo, texto: 'Inactivo', icon: '⏸️' }
    ];

    return (
      <View style={style.leyendaContainer}>
        <View style={style.leyendaHeader}>
          <Text style={style.leyendaHeaderIcon}>ℹ️</Text>
          <Text style={style.leyendaTitle}>Estados de Pedidos</Text>
        </View>
        <View style={style.estadosGrid}>
          {estados.map((estado, index) => (
            <View key={index} style={style.estadoItem}>
              <View style={[style.estadoIndicator, { backgroundColor: estado.color }]}>
                <Text style={[style.estadoIcon, { color: estado.textColor || '#fff' }]}>
                  {estado.icon}
                </Text>
              </View>
              <Text style={style.estadoTexto}>{estado.texto}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.safeContainer}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con logo */}
        <View style={style.header}>
          <Image
            source={require('../../assets/img/pg1/fondo1.jpg')}
            style={style.logo}
            resizeMode="contain"
          />
          <Text style={style.welcomeText}>
            Bienvenido{nombre ? ` ${nombre}` : ''}
          </Text>
        </View>

        {/* Botones principales */}
        {renderBotones()}

        {/* Leyenda de estados */}
        {renderLeyendaEstados()}
      </ScrollView>

      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

export default Home;