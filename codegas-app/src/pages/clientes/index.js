import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { style } from './style';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { getUsuarios } from '../../redux/actions/usuarioActions';
import Footer from '../components/footer';
import { DataContext } from '../../context/context';

const ACCESO = 'clientes';

const VerPerfil = ({ navigation, route }) => {
  const { userId } = useContext(DataContext);
  const dispatch = useDispatch();
  const usuarios = useSelector(state => state.usuario.usuarios || []);
  const usuariosFiltro = useSelector(state => state.usuario.usuarios || []);
  const scrollViewRef = useRef(null);

  const [state, setState] = useState({
    terminoBuscador: '',
    inicio: 0,
    final: false,
    limit: 10,
    showSearch: true,
    scrollPosition: 0
  });

  const updateState = useCallback((updates) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  useEffect(() => {
    searchUser();
  }, []);

  // Efecto para restaurar la posición de scroll cuando se regrese de editarPerfil
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = route?.params;
      if (params?.scrollPosition && scrollViewRef.current) {
        // Pequeño delay para asegurar que el contenido esté renderizado
        setTimeout(() => {
          scrollViewRef.current.scrollTo({
            y: params.scrollPosition,
            animated: true
          });
        }, 100);
      }
    });

    return unsubscribe;
  }, [navigation, route]);

  const onScroll = useCallback((event) => {
    const { final, limit, terminoBuscador } = state;
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const reachedEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height;

    // Actualizar la posición de scroll en el estado
    updateState({ scrollPosition: contentOffset.y });

    if (reachedEnd && !final) {
      updateState({ final: true, limit: limit + 10 });
      searchUser();
    } else if (!reachedEnd && final) {
      updateState({ final: false });
    }
  }, [state.final, state.limit, state.terminoBuscador]);

  const searchUser = useCallback((clean = false) => {
    const { limit, inicio, terminoBuscador } = state;
    dispatch(getUsuarios(limit, inicio, ACCESO, clean ? '' : terminoBuscador, userId));
  }, [state.limit, state.inicio, state.terminoBuscador, dispatch, userId]);

  const handleSearch = useCallback(() => {
    const { terminoBuscador, showSearch } = state;

    if (showSearch) {
      if (terminoBuscador && terminoBuscador.length > 1) {
        searchUser();
        updateState({ showSearch: false });
      } else {
        alert("Inserte un valor");
      }
    } else {
      updateState({ showSearch: true, terminoBuscador: '' });
      searchUser(true);
    }
  }, [state.terminoBuscador, state.showSearch, searchUser]);

  const navigateToUser = useCallback((userId) => {
    const params = route?.params;

    // Guardar la posición actual del scroll antes de navegar
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: state.scrollPosition, animated: false });
    }

    if (params && params.idUsuario) {
      navigation.navigate("puntos", { idUsuario: userId });
    } else {
      navigation.navigate("editarPerfil", {
        tipoAcceso: "editar",
        idUsuario: userId,
        scrollPosition: state.scrollPosition
      });
    }
  }, [navigation, route, state.scrollPosition]);

  const renderUsuarios = useCallback(() => {
    return usuarios.map((usuario, key) => (
      <View
        style={[
          style.contenedorUsers,
          {
            backgroundColor: usuario.activo ? "white" : "#ffebee",
            borderLeftColor: usuario.activo ? "transparent" : "#f44336",
            borderLeftWidth: usuario.activo ? 0 : 4
          }
        ]}
        key={key}
      >
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => navigateToUser(usuario._id)}
        >
          <View style={{ width: "90%" }}>
            {usuario.acceso === "cliente" && (
              <Text style={style.textUsers}>
                {usuario.idPadre
                  ? `${usuario.razon_social?.toUpperCase() || 'Sin razón social'}`
                  : usuario.razon_social?.length > 0
                    ? usuario.razon_social.toUpperCase()
                    : 'Sin razón social'
                }
              </Text>
            )}

            {usuario.valorUnitario && (
              <Text style={style.textUsers}>
                {usuario.valorUnitario || 'Sin valor unitario'}
              </Text>
            )}

            {usuario.celular && (
              <Text style={style.textUsers}>
                {usuario.celular?.toUpperCase() || 'Sin celular'}
              </Text>
            )}
            {usuario.padre && (
              <Text style={style.textUsers}>
                {usuario.padre?.nombre.toUpperCase() || 'Sin padre'}
              </Text>
            )}


          </View>

          <View style={{ justifyContent: "center" }}>
            <FontAwesome name={'angle-right'} style={style.iconCerrar} />
          </View>
        </TouchableOpacity>
      </View>
    ));
  }, [usuarios, navigateToUser]);

  const renderContent = useCallback(() => {
    const { terminoBuscador } = state;
    const params = route?.params;

    if (usuarios.length === 0) {
      return <ActivityIndicator color="#00218b" />;
    }

    // Solo activar modo revisiones si hay idUsuario en params (no solo scrollPosition)
    if (!route || !params || !params.idUsuario) {
      return renderUsuarios();
    }

    if (terminoBuscador && terminoBuscador.length > 2) {
      return renderUsuarios();
    }

    return <Text>Digita un usuario</Text>;
  }, [usuarios.length, state.terminoBuscador, route, renderUsuarios]);

  const { terminoBuscador, showSearch } = state;
  const params = route?.params;

  return (
    <View style={style.container}>
      {route && params && params.idUsuario ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("revision", { idUsuario: params.idUsuario })}
          style={{ padding: 10 }}
        >
          <Text style={style.titulo}>Ver por revisiones</Text>
        </TouchableOpacity>
      ) : (
        <Text style={style.titulo}>Listado Clientes</Text>
      )}

      <View style={{ flexDirection: "row" }}>
        <TextInput
          placeholder="Buscar por: cliente, fecha, forma"
          autoCapitalize='none'
          placeholderTextColor="#aaa"
          onChangeText={(text) => updateState({ terminoBuscador: text })}
          value={terminoBuscador}
          style={style.inputCabezera}
        />

        <TouchableOpacity
          style={style.buscarCliente}
          onPress={handleSearch}
        >
          <FontAwesome
            name={showSearch ? 'search' : 'close'}
            style={style.iconSearch}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={{ marginBottom: 85 }}
        onScroll={onScroll}
        keyboardDismissMode="on-drag"
        scrollEventThrottle={16}
      >
        {renderContent()}
      </ScrollView>

      <Footer navigation={navigation} />
    </View>
  );
};

VerPerfil.defaultProps = {
  perfil: { categoria: [] }
};

export default VerPerfil;