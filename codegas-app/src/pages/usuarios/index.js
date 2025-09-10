import React, { useState, useEffect, useCallback } from 'react';
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

const ACCESO = 'clientes';

const VerPerfil = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const usuarios = useSelector(state => state.usuario.usuarios || []);
  const usuariosFiltro = useSelector(state => state.usuario.usuarios || []);

  const [state, setState] = useState({
    terminoBuscador: '',
    inicio: 0,
    final: false,
    limit: 10,
    showSearch: true
  });

  const updateState = useCallback((updates) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  useEffect(() => {
    searchUser();
  }, []);

  const onScroll = useCallback((event) => {
    const { final, limit, terminoBuscador } = state;
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const reachedEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height;

    if (reachedEnd && !final) {
      updateState({ final: true, limit: limit + 10 });
      searchUser();
    } else if (!reachedEnd && final) {
      updateState({ final: false });
    }
  }, [state.final, state.limit, state.terminoBuscador]);

  const searchUser = useCallback((clean = false) => {
    const { limit, inicio, terminoBuscador } = state;
    dispatch(getUsuarios(limit, inicio, ACCESO, clean ? '' : terminoBuscador));
  }, [state.limit, state.inicio, state.terminoBuscador, dispatch]);

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
    if (params) {
      navigation.navigate("puntos", { idUsuario: userId });
    } else {
      navigation.navigate("editarPerfil", { tipoAcceso: "editar", idUsuario: userId });
    }
  }, [navigation, route?.params]);

  const renderUsuarios = useCallback(() => {
    return usuarios.map((usuario, key) => (
      <View
        style={[
          style.contenedorUsers,
          { backgroundColor: usuario.activo ? "white" : "red" }
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
                  ? `Punto consumo: ${usuario.idPadre.razon_social.toUpperCase()}`
                  : usuario.razon_social?.length > 0
                    ? usuario.razon_social.toUpperCase()
                    : ''
                }
              </Text>
            )}

            {usuario.nombre?.length > 0 && (
              <Text style={style.textUsers}>
                {usuario.nombre.toUpperCase()}
              </Text>
            )}

            {usuario.email?.length > 0 && (
              <Text style={style.textUsers}>
                {usuario.email.toUpperCase()}
              </Text>
            )}

            {usuario.acceso?.length > 0 && (
              <Text style={style.textUsers}>
                {usuario.acceso.toUpperCase()}
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

    if (!params) {
      return renderUsuarios();
    }

    if (terminoBuscador && terminoBuscador.length > 2) {
      return renderUsuarios();
    }

    return <Text>Digita un usuario</Text>;
  }, [usuarios.length, state.terminoBuscador, route?.params, renderUsuarios]);

  const { terminoBuscador, showSearch } = state;
  const params = route?.params;

  return (
    <View style={style.container}>
      {params ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("revision")}
          style={{ padding: 10 }}
        >
          <Text style={style.titulo}>Ver por revisiones</Text>
        </TouchableOpacity>
      ) : (
        <Text style={style.titulo}>Listado usuarios</Text>
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