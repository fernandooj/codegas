import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Image,
    Platform,
    StatusBar
} from 'react-native';
import { style } from './style';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { getUsuarios } from '../../redux/actions/usuarioActions';
import Footer from '../components/footer';
import { DataContext } from '../../context/context';
import {
    Usuario,
    UsuarioProps,
    UsuarioSearchState,
    DataContextType,
    UsuarioRenderProps,
    UsuarioNavigationParams,
    RootState
} from './types';


const Usuarios: React.FC<UsuarioProps> = ({ navigation }) => {
    const { userId, acceso } = useContext(DataContext) as DataContextType;
    const dispatch = useDispatch();
    const usuarios = useSelector((state: RootState) => state.usuario.usuarios || []);
    const usuariosFiltro = useSelector((state: RootState) => state.usuario.usuarios || []);

    const [state, setState] = useState<UsuarioSearchState>({
        terminoBuscador: '',
        inicio: 0,
        final: false,
        limit: 10,
        showSearch: false // Cambiado a false para mostrar que no está buscando inicialmente
    });

    const updateState = useCallback((updates: Partial<UsuarioSearchState>) => {
        setState(prevState => ({ ...prevState, ...updates }));
    }, []);

    useEffect(() => {
        searchUser();
    }, []);

    // Effect para búsqueda en tiempo real con debounce
    useEffect(() => {
        if (!userId || !acceso) return;

        // Si hay término de búsqueda, implementar debounce
        if (state.terminoBuscador && state.terminoBuscador.length >= 2) {
            const searchTimeout = setTimeout(() => {
                updateState({ showSearch: true });
                dispatch(getUsuarios(state.limit, state.inicio, acceso, state.terminoBuscador, userId) as any);
            }, 500); // Debounce de 500ms

            return () => clearTimeout(searchTimeout);
        }
        // Si no hay término de búsqueda, cargar todos los usuarios
        else if (state.terminoBuscador === '') {
            updateState({ showSearch: false });
            dispatch(getUsuarios(state.limit, state.inicio, acceso, '', userId) as any);
        }
    }, [state.terminoBuscador, userId, acceso, dispatch, updateState, state.limit, state.inicio]);

    // Effect para resetear showSearch cuando se borra el término
    useEffect(() => {
        if (!state.terminoBuscador && state.showSearch) {
            updateState({ showSearch: false });
        }
    }, [state.terminoBuscador, state.showSearch, updateState]);

    const onScroll = useCallback((event: any) => {
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

    const searchUser = useCallback((clean: boolean = false) => {
        const { limit, inicio, terminoBuscador } = state;
        dispatch(getUsuarios(limit, inicio, acceso, clean ? '' : terminoBuscador, userId) as any);
    }, [state.limit, state.inicio, state.terminoBuscador, dispatch, acceso, userId]);

    const handleSearch = useCallback(() => {
        const { terminoBuscador, showSearch } = state;

        if (showSearch) {
            if (terminoBuscador && terminoBuscador.length > 1) {
                searchUser();
                updateState({ showSearch: false });
            } else {
                // Alert.alert("Error", "Inserte un valor");
            }
        } else {
            updateState({ showSearch: true, terminoBuscador: '' });
            searchUser(true);
        }
    }, [state.terminoBuscador, state.showSearch, searchUser]);

    const navigateToUser = useCallback((userId: number) => {
        if (acceso !== 'veo') {
            navigation.navigate("editarPerfil", { tipoAcceso: "editar", idUsuario: userId } as UsuarioNavigationParams);
        }
    }, [navigation, acceso]);

    const navigateToCreateClient = useCallback(() => {
        navigation.navigate('verPerfil', { tipoAcceso: 'admin' } as UsuarioNavigationParams);
    }, [navigation]);

    // Función para renderizar usuarios jerárquicamente
    const renderUsuarioJerarquico = useCallback((usuario: Usuario, nivel: number = 0) => {
        const paddingLeft = nivel * 20;
        const esPadre = (usuario.children && usuario.children.length > 0);
        const tieneHijos = usuario.children && Array.isArray(usuario.children) && usuario.children.length > 0;
        const isInactive = !usuario.activo;

        return (
            <View key={usuario._id}>
                <View
                    style={[
                        style.contenedorUsers,
                        {
                            backgroundColor: isInactive ? "#fff5f5" : "white",
                            borderLeftColor: isInactive ? "#dc3545" : "transparent",
                            borderLeftWidth: isInactive ? 4 : 0,
                            marginLeft: paddingLeft + 5,
                            width: paddingLeft > 0 ? `${100 - ((paddingLeft + 5) / 10)}%` : "97%",
                            opacity: isInactive ? 0.8 : 1,
                            borderWidth: isInactive ? 1 : 0,
                            borderColor: isInactive ? "#ffcdd2" : "transparent"
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
                        <View style={{ width: "85%" }}>
                            {/* Status indicator */}
                            {isInactive && (
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 4
                                }}>
                                    <FontAwesome
                                        name={'exclamation-circle'}
                                        style={{
                                            fontSize: 12,
                                            color: '#dc3545',
                                            marginRight: 4
                                        }}
                                    />
                                    <Text style={{
                                        fontSize: 10,
                                        color: '#dc3545',
                                        fontWeight: 'bold',
                                        fontFamily: "Comfortaa-Regular"
                                    }}>
                                        USUARIO INACTIVO
                                    </Text>
                                </View>
                            )}

                            {usuario?.nombre && usuario.nombre.length > 0 && (
                                <Text style={[
                                    style.textUsers,
                                    esPadre ? style.textAccesoPadre : style.textAccesoHijo,
                                    isInactive && {
                                        color: '#6c757d',
                                        textDecorationLine: 'line-through'
                                    }
                                ]}>
                                    {nivel > 0 ? '└─ ' : ''}{usuario.nombre.toUpperCase()}
                                </Text>
                            )}

                            {usuario.email && usuario.email.length > 0 && (
                                <Text style={[
                                    style.textUsers,
                                    isInactive && { color: '#adb5bd' }
                                ]}>
                                    {usuario.email.toLowerCase()}
                                </Text>
                            )}

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 2
                            }}>
                                {usuario.acceso && usuario.acceso.length > 0 && (
                                    <View style={{
                                        backgroundColor: isInactive ? '#adb5bd' :
                                            usuario.acceso === 'admin' ? '#007bff' :
                                                usuario.acceso === 'conductor' ? '#28a745' : '#6c757d',
                                        paddingHorizontal: 8,
                                        paddingVertical: 2,
                                        borderRadius: 12,
                                        marginRight: 8
                                    }}>
                                        <Text style={{
                                            color: 'white',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            fontFamily: "Comfortaa-Regular"
                                        }}>
                                            {usuario.acceso.toUpperCase()}
                                        </Text>
                                    </View>
                                )}

                                {/* Active status badge */}
                                <View style={{
                                    backgroundColor: usuario.activo ? '#d4edda' : '#f8d7da',
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    borderRadius: 8
                                }}>
                                    <Text style={{
                                        color: usuario.activo ? '#155724' : '#721c24',
                                        fontSize: 9,
                                        fontWeight: 'bold',
                                        fontFamily: "Comfortaa-Regular"
                                    }}>
                                        {usuario.activo ? 'ACTIVO' : 'INACTIVO'}
                                    </Text>
                                </View>
                            </View>

                            {usuario.celular && usuario.celular.length > 0 && (
                                <Text style={[
                                    style.textUsers,
                                    { fontSize: 12, marginTop: 2 },
                                    isInactive && { color: '#adb5bd' }
                                ]}>
                                    📱 {usuario.celular}
                                </Text>
                            )}
                        </View>

                        <View style={{
                            justifyContent: "center",
                            alignItems: 'center',
                            width: '15%'
                        }}>
                            <FontAwesome
                                name={'angle-right'}
                                style={[
                                    style.iconCerrar,
                                    { fontSize: 20 },
                                    isInactive && { color: '#adb5bd' }
                                ]}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                {/* Renderizar hijos recursivamente */}
                {tieneHijos && usuario.children && usuario.children.map((hijo: Usuario) => renderUsuarioJerarquico(hijo, nivel + 1))}
            </View>
        );
    }, [navigateToUser, acceso]);

    const renderClientes = useCallback(() => {
        // Renderizar directamente los usuarios que vienen del API
        // Estos son los usuarios de nivel superior para esta vista
        return usuarios.map((usuario: Usuario) => renderUsuarioJerarquico(usuario));
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

    const renderCabezera = () => {
        // Calcular padding superior para iPhone con notch
        const getStatusBarHeight = () => {
            if (Platform.OS === 'ios') {
                return StatusBar.currentHeight || 44; // 44 para iPhone con notch
            }
            return StatusBar.currentHeight || 24;
        };

        return (
            <View style={{
                backgroundColor: '#f8f9fa',
                paddingHorizontal: 0,
                paddingTop: getStatusBarHeight() - 10,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#e9ecef',
                width: '100%',
            }}>
                {/* Header con mejor espaciado */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 15,
                    paddingHorizontal: 20
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: 4
                        }}>
                            Usuarios
                        </Text>
                        {usuarios && (
                            <Text style={{
                                fontSize: 16,
                                color: '#666',
                                fontWeight: '500'
                            }}>
                                {usuarios.length} usuarios encontrados
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#007bff',
                            borderRadius: 8,
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                        }}
                        onPress={() => searchUser(true)}
                        activeOpacity={0.8}
                    >
                        <FontAwesome name='refresh' style={{
                            fontSize: 16,
                            color: '#fff'
                        }} />
                    </TouchableOpacity>
                </View>

                {/* Barra de búsqueda mejorada */}
                <View style={{
                    marginHorizontal: 20,
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        flexDirection: "row",
                        alignItems: 'center',
                        paddingHorizontal: 15,
                        paddingVertical: 0,
                        borderWidth: 2,
                        borderColor: showSearch ? '#007bff' : '#e9ecef',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 4,
                        elevation: 3,
                        height: 45,
                    }}>
                        <FontAwesome
                            name='search'
                            style={{
                                fontSize: 18,
                                color: showSearch ? '#007bff' : '#6c757d',
                                marginRight: 12
                            }}
                        />
                        <TextInput
                            placeholder="Buscar por nombre, email, acceso..."
                            placeholderTextColor="#999"
                            autoCapitalize='none'
                            onChangeText={(text) => updateState({ terminoBuscador: text })}
                            value={terminoBuscador}
                            style={{
                                flex: 1,
                                fontSize: 16,
                                color: '#333',
                                paddingVertical: 10,
                                fontFamily: "Comfortaa-Regular"
                            }}
                        />

                        {terminoBuscador.length > 0 && (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#dc3545',
                                    borderRadius: 8,
                                    width: 35,
                                    height: 35,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 5
                                }}
                                onPress={() => updateState({ terminoBuscador: '' })}
                                activeOpacity={0.8}
                            >
                                <FontAwesome name='times' style={{
                                    fontSize: 14,
                                    color: '#fff'
                                }} />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={{
                                backgroundColor: showSearch ? '#28a745' : '#6c757d',
                                borderRadius: 8,
                                width: 35,
                                height: 35,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={handleSearch}
                            activeOpacity={0.8}
                        >
                            <FontAwesome name={showSearch ? 'search' : 'search'} style={{
                                fontSize: 14,
                                color: '#fff'
                            }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const { terminoBuscador, showSearch } = state;

    return (
        <View style={[style.container, { paddingTop: 0 }]}>
            {renderCabezera()}

            <ScrollView
                style={{ marginBottom: 85, paddingHorizontal: 10, marginTop: 10 }}
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
