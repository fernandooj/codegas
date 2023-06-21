import React, {FC, useState} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
} from 'react-native';
import {style} from './style';
import Icon from 'react-native-vector-icons/FontAwesome';

const RenderPerfil: FC = ({
  navigation,
  userInfo,
  cerrarSesion,
  searchUser,
}: any) => {
  const [user, setUser] = useState(userInfo);
  const {nombre, avatar, email, err, acceso} = user;

  return (
    <ScrollView style={style.containerRegistro}>
      <View style={style.perfilContenedor}>
        <View style={style.columna4}>
          {avatar === 'null' ? (
            <Icon name={'user-circle'} style={style.iconAvatar} />
          ) : (
            <Image source={{uri: avatar}} style={style.avatar} />
          )}
        </View>
        <View style={style.columna2}>
          <Text style={style.nombre}>{nombre}</Text>
          <Text style={style.nombre}>{email}</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={style.btnLista}
          onPress={() => navigation.navigate('verPerfil', {tipoAcceso: null})}>
          <Text style={style.txtLista}>Editar perfil</Text>
          <Image
            source={require('../../assets/img/pg1/icon2.png')}
            style={style.icon}
          />
        </TouchableOpacity>

        {(acceso === 'admin' || acceso === 'despacho') && (
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
        )}
        {(acceso === 'admin' ||
          acceso === 'solucion' ||
          acceso === 'comercial' ||
          acceso === 'veo' ||
          acceso === 'despacho') && (
          <TouchableOpacity
            style={style.btnLista}
            onPress={() => navigation.navigate('usuarios')}>
            <Text style={style.txtLista}>Usuarios</Text>
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
        {acceso === 'solucion' && (
          <TouchableOpacity
            style={style.btnLista}
            onPress={() =>
              navigation.navigate('verPerfil', {tipoAcceso: 'solucion'})
            }>
            <Text style={style.txtLista}>Crear Cliente</Text>
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
              navigation.navigate('vehiculo', {tipoAcceso: 'admin'})
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
        {acceso === 'admin' && (
          <TouchableOpacity
            style={style.btnLista}
            onPress={() => navigation.navigate('verCalificacion')}>
            <Text style={style.txtLista}>Calificaciones</Text>
            <Image
              source={require('../../assets/img/pg1/icon6.png')}
              style={style.icon}
            />
          </TouchableOpacity>
        )}
        {(acceso === 'admin' ||
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
        )}
        {(acceso === 'admin' ||
          acceso === 'comercial' ||
          acceso === 'depTecnico' ||
          acceso === 'insSeguridad' ||
          acceso === 'adminTanque') && (
          <TouchableOpacity
            style={style.btnLista}
            onPress={() => navigation.navigate('usuarios', {revision: true})}>
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
              navigation.navigate('reporteEmergencia', {revision: true})
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
              // onChangeText={idUsuario => this.setState({idUsuario})}
              placeholder="id"
            />
            <TouchableOpacity
              style={style.btnLista}
              onPress={() => {
                searchUser();
              }}>
              <Icon name={'star'} style={style.icon} />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={style.btnLista}
          onPress={() => {
            cerrarSesion();
          }}>
          <Text style={style.txtLista}>Cerrar Sesion</Text>
          <Image
            source={require('../../assets/img/pg1/icon7.png')}
            style={style.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={style.btnLista}>
          <Text style={[style.txtLista, {fontSize: 11}]}>Ver 11.5.3-1</Text>
        </TouchableOpacity>
        {err && <Text>{err}</Text>}
      </View>
    </ScrollView>
  );
};

export default RenderPerfil;
