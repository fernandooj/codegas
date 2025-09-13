import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Image
} from 'react-native';
import { style } from './style';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { getUsuarios } from '../../redux/actions/usuarioActions';
import Footer from '../components/footer';
import { DataContext } from '../../context/context';


const Usuarios = ({ navigation }) => {
    const { userId, acceso } = useContext(DataContext)
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
        dispatch(getUsuarios(limit, inicio, acceso, clean ? '' : terminoBuscador, userId));
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
        if (acceso !== 'veo') {
            navigation.navigate("editarPerfil", { tipoAcceso: "editar", idUsuario: userId });
        }
    }, [navigation, acceso]);

    const navigateToCreateClient = useCallback(() => {
        navigation.navigate('verPerfil', { tipoAcceso: 'admin' });
    }, [navigation]);

    // Función para renderizar usuarios jerárquicamente
    const renderUsuarioJerarquico = useCallback((usuario, nivel = 0) => {
        const paddingLeft = nivel * 20;
        const esPadre = (usuario.children && usuario.children.length > 0);
        const tieneHijos = usuario.children && Array.isArray(usuario.children) && usuario.children.length > 0;

        return (
            <View key={usuario._id}>
                <View
                    style={[
                        style.contenedorUsers,
                        {
                            backgroundColor: usuario.activo ? "white" : "#ffebee",
                            borderLeftColor: usuario.activo ? "transparent" : "#f44336",
                            borderLeftWidth: usuario.activo ? 0 : 4,
                            marginLeft: paddingLeft + 5,
                            width: paddingLeft > 0 ? `calc(100% - ${paddingLeft + 5}px)` : "97%"
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            opacity: acceso === 'veo' ? 0.6 : 1
                        }}
                        onPress={() => navigateToUser(usuario._id)}
                        disabled={acceso === 'veo'}
                    >
                        <View style={{ width: "90%" }}>
                            {usuario?.nombre?.length > 0 && (
                                <Text style={[style.textUsers, esPadre ? style.textAccesoPadre : style.textAccesoHijo]}>
                                    {nivel > 0 ? '└─ ' : ''}{usuario.nombre.toUpperCase()}
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

                            {usuario.celular?.length > 0 && (
                                <Text style={style.textUsers}>
                                    {usuario.celular}
                                </Text>
                            )}
                        </View>

                        <View style={{ justifyContent: "center" }}>
                            <FontAwesome name={'angle-right'} style={style.iconCerrar} />
                        </View>
                    </TouchableOpacity>
                </View>
                {/* Renderizar hijos recursivamente */}
                {tieneHijos && usuario.children.map(hijo => renderUsuarioJerarquico(hijo, nivel + 1))}
            </View>
        );
    }, [navigateToUser]);

    const renderClientes = useCallback(() => {
        // Renderizar directamente los usuarios que vienen del API
        // Estos son los usuarios de nivel superior para esta vista
        return usuarios.map((usuario) => renderUsuarioJerarquico(usuario));
    }, [usuarios, renderUsuarioJerarquico]);

    const renderContent = useCallback(() => {
        const { terminoBuscador } = state;

        if (usuarios.length === 0) {
            return <ActivityIndicator color="#00218b" />;
        }

        if (terminoBuscador && terminoBuscador.length > 2) {
            return renderClientes();
        }

        return renderClientes();
    }, [usuarios.length, state.terminoBuscador, renderClientes]);

    const { terminoBuscador, showSearch } = state;

    return (
        <View style={style.container}>
            <Text style={style.titulo}>Listado de Usuarios</Text>

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

            {/* Round + button with shadow */}
            <TouchableOpacity
                style={style.floatingButton}
                onPress={navigateToCreateClient}
            >
                <FontAwesome name={'plus'} style={style.floatingButtonIcon} />
            </TouchableOpacity>
        </View>
    );
};

export default Usuarios;
