import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
    Modal,
    ScrollView,
    Image,
    Dimensions,
    Animated,
    Platform,
    StatusBar
} from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { getUsuariosAcceso } from '../../redux/actions/usuarioActions';
import { getVehiculos } from '../../redux/actions/vehiculoActions';
import { DataContext } from '../../context/context';
import { style } from './style';
import {
    VehiculoProps,
    VehiculoState,
    DataContextType,
    RootState,
    Vehiculo,
    Usuario,
    Conductor,
    VehiculoSortField,
    VehiculoSortOrder,
    VEHICULO_CONSTANTS
} from './types';

let size = Dimensions.get('window');

const VehiculoComponent: React.FC<VehiculoProps> = ({ navigation }) => {
    // Redux hooks
    const dispatch = useDispatch();
    const vehiculos = useSelector((state: RootState) => state.vehiculo.vehiculos || []);
    const conductores = useSelector((state: RootState) => state.usuario.usuariosAcceso || []);

    // Context
    const { userId, acceso } = useContext(DataContext) as DataContextType;

    // State
    const [state, setState] = useState<VehiculoState>({
        placa: '',
        centro: '',
        bodega: '',
        modalConductor: false,
        modalEditar: false,
        conductores: [],
        conductor: '',
        placaVehiculo: '',
        idVehiculo: '',
        placaEditar: '',
        centroEditar: '',
        bodegaEditar: '',
        idUsuario: userId,
        acceso: acceso || '',
        sortBy: 'placa',
        sortOrder: 'asc'
    });

    // Animation refs
    const modalScale = useRef(new Animated.Value(0)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;

    // Update state helper
    const updateState = useCallback((updates: Partial<VehiculoState>) => {
        setState(prevState => ({ ...prevState, ...updates }));
    }, []);

    // Load initial data
    useEffect(() => {
        dispatch(getVehiculos() as any);
        dispatch(getUsuariosAcceso(VEHICULO_CONSTANTS.DEFAULT_LIMIT, VEHICULO_CONSTANTS.DEFAULT_START, VEHICULO_CONSTANTS.CONDUCTOR_ACCESO) as any);
    }, [dispatch]);

    // Filter available conductors
    const resultFilter = useCallback((firstArray: Usuario[], secondArray: Vehiculo[]) => {
        return firstArray.filter(firstArrayItem =>
            !secondArray.some(
                secondArrayItem => firstArrayItem._id === secondArrayItem.conductor?._id
            )
        );
    }, []);

    // Update conductors when props change
    useEffect(() => {
        const availableConductores = resultFilter(conductores, vehiculos);
        updateState({ conductores: availableConductores });
    }, [conductores, vehiculos, resultFilter, updateState]);

    // Modal animations
    useEffect(() => {
        if (state.modalConductor || state.modalEditar) {
            Animated.parallel([
                Animated.spring(modalScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8
                }),
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(modalScale, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8
                }),
                Animated.timing(modalOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                })
            ]).start();
        }
    }, [state.modalConductor, state.modalEditar, modalScale, modalOpacity]);

    // Sort vehicles
    const getSortedVehiculos = useCallback(() => {
        return [...vehiculos].sort((a, b) => {
            let aValue: any = a[state.sortBy];
            let bValue: any = b[state.sortBy];

            if (state.sortBy === 'fechaCreacion') {
                aValue = new Date(aValue || 0);
                bValue = new Date(bValue || 0);
            } else if (state.sortBy === 'conductor') {
                // Sort by conductor name
                aValue = a.conductor?.nombre || 'Sin conductor';
                bValue = b.conductor?.nombre || 'Sin conductor';
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            } else if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (state.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [vehiculos, state.sortBy, state.sortOrder]);

    // Handle sort change
    const handleSortChange = useCallback((field: VehiculoSortField) => {
        setState(prevState => ({
            ...prevState,
            sortBy: field,
            sortOrder: prevState.sortBy === field && prevState.sortOrder === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    // Render header with sorting
    const renderHeader = () => {
        const getStatusBarHeight = () => {
            if (Platform.OS === 'ios') {
                return StatusBar.currentHeight || 44;
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
                {/* Header with title and count */}
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
                            Vehículos
                        </Text>
                        {vehiculos && (
                            <Text style={{
                                fontSize: 16,
                                color: '#666',
                                fontWeight: '500'
                            }}>
                                {vehiculos.length} vehículos registrados
                            </Text>
                        )}
                    </View>

                    {/* Sort controls */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity
                            style={[
                                {
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 6,
                                    marginLeft: 8,
                                    backgroundColor: state.sortBy === 'placa' ? '#00218b' : '#e9ecef'
                                }
                            ]}
                            onPress={() => handleSortChange('placa')}
                        >
                            <Text style={{
                                color: state.sortBy === 'placa' ? 'white' : '#666',
                                fontSize: 12,
                                fontWeight: '600'
                            }}>
                                Placa
                                {state.sortBy === 'placa' && (
                                    <FontAwesome
                                        name={state.sortOrder === 'asc' ? 'sort-alpha-asc' : 'sort-alpha-desc'}
                                        style={{ marginLeft: 4, fontSize: 10 }}
                                    />
                                )}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                {
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 6,
                                    marginLeft: 8,
                                    backgroundColor: state.sortBy === 'fechaCreacion' ? '#00218b' : '#e9ecef'
                                }
                            ]}
                            onPress={() => handleSortChange('fechaCreacion')}
                        >
                            <Text style={{
                                color: state.sortBy === 'fechaCreacion' ? 'white' : '#666',
                                fontSize: 12,
                                fontWeight: '600'
                            }}>
                                Fecha
                                {state.sortBy === 'fechaCreacion' && (
                                    <FontAwesome
                                        name={state.sortOrder === 'asc' ? 'sort-numeric-asc' : 'sort-numeric-desc'}
                                        style={{ marginLeft: 4, fontSize: 10 }}
                                    />
                                )}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                {
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 6,
                                    marginLeft: 8,
                                    backgroundColor: state.sortBy === 'conductor' ? '#00218b' : '#e9ecef'
                                }
                            ]}
                            onPress={() => handleSortChange('conductor')}
                        >
                            <Text style={{
                                color: state.sortBy === 'conductor' ? 'white' : '#666',
                                fontSize: 12,
                                fontWeight: '600'
                            }}>
                                Conductor
                                {state.sortBy === 'conductor' && (
                                    <FontAwesome
                                        name={state.sortOrder === 'asc' ? 'sort-alpha-asc' : 'sort-alpha-desc'}
                                        style={{ marginLeft: 4, fontSize: 10 }}
                                    />
                                )}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form for creating new vehicle */}
                <View style={{
                    paddingHorizontal: 20,
                    backgroundColor: '#fff',
                    marginHorizontal: 20,
                    borderRadius: 8,
                    paddingVertical: 15,
                    shadowColor: 'rgba(0,0,0, .4)',
                    shadowOffset: { height: 2, width: 2 },
                    shadowOpacity: .5,
                    shadowRadius: 5,
                    elevation: 4,
                    borderWidth: 1,
                    borderColor: '#e9ecef'
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: 10
                    }}>
                        Agregar Nuevo Vehículo
                    </Text>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <TextInput
                            placeholder="Placa"
                            autoCapitalize='characters'
                            onChangeText={(placa) => updateState({ placa })}
                            value={state.placa}
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: '#e9ecef',
                                borderRadius: 6,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                marginRight: 8,
                                fontSize: 14
                            }}
                            placeholderTextColor="#aaa"
                        />
                        <TextInput
                            placeholder="Centro"
                            autoCapitalize='none'
                            onChangeText={(centro) => updateState({ centro })}
                            value={state.centro}
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: '#e9ecef',
                                borderRadius: 6,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                marginRight: 8,
                                fontSize: 14
                            }}
                            placeholderTextColor="#aaa"
                            keyboardType="numeric"
                        />
                        <TextInput
                            placeholder="Bodega"
                            autoCapitalize='none'
                            onChangeText={(bodega) => updateState({ bodega })}
                            value={state.bodega}
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: '#e9ecef',
                                borderRadius: 6,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                marginRight: 8,
                                fontSize: 14
                            }}
                            placeholderTextColor="#aaa"
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#00218b',
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 6,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={crearVehiculo}
                        >
                            <FontAwesome name='plus' style={{ color: 'white', fontSize: 16 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    // Render vehicles list
    const renderVehiculos = useCallback(() => {
        const sortedVehiculos = getSortedVehiculos();

        return sortedVehiculos.map((vehiculo: Vehiculo, key: number) => (
            <View style={style.vehiculo} key={key}>
                <View style={style.vehiculoTexto}>
                    <Text style={{ fontFamily: "Comfortaa-Regular" }}>Id: {vehiculo._id}</Text>
                    <Text style={{ fontFamily: "Comfortaa-Regular" }}>Placa: {vehiculo.placa}</Text>
                    <Text style={{ fontFamily: "Comfortaa-Regular" }}>Centro: {vehiculo.centro}</Text>
                    <Text style={{ fontFamily: "Comfortaa-Regular" }}>Bodega: {vehiculo.bodega}</Text>
                    <Text style={{ fontFamily: "Comfortaa-Regular" }}>
                        Conductor: {vehiculo.conductor?.nombre || "Sin conductor"}
                    </Text>
                </View>

                {vehiculo.conductor && (
                    <TouchableOpacity
                        style={style.btnVehiculo}
                        onPress={() => desvincularConductor(vehiculo.conductor!.nombre, vehiculo._id, vehiculo.placa)}
                    >
                        <FontAwesome name='chain-broken' style={style.iconVehiculo} />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={style.btnVehiculo}
                    onPress={() => updateState({
                        modalConductor: true,
                        placaVehiculo: vehiculo.placa,
                        conductor: vehiculo.conductor ? vehiculo.conductor._id : "",
                        idVehiculo: vehiculo._id
                    })}
                >
                    <FontAwesome name='user' style={style.iconVehiculo} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={style.btnVehiculo}
                    onPress={() => updateState({
                        modalEditar: true,
                        idVehiculo: vehiculo._id,
                        placaEditar: vehiculo.placa,
                        centroEditar: vehiculo.centro,
                        bodegaEditar: vehiculo.bodega
                    })}
                >
                    <FontAwesome name='pencil' style={style.iconVehiculo} />
                </TouchableOpacity>

                {state.acceso === "admin" && (
                    <TouchableOpacity
                        style={style.btnVehiculo}
                        onPress={() => eliminarVehiculo(vehiculo.placa, vehiculo._id)}
                    >
                        <FontAwesome name='trash' style={style.iconVehiculo} />
                    </TouchableOpacity>
                )}
            </View>
        ));
    }, [getSortedVehiculos, state.acceso, updateState]);

    // Modal for editing vehicle
    const renderModalEditar = () => {
        const { placaEditar, modalEditar, centroEditar, bodegaEditar } = state;

        return (
            <Modal transparent visible={modalEditar} animationType="none">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => updateState({ modalEditar: false })}
                >
                    <View style={style.contenedorModal}>
                        <Animated.View
                            style={[
                                style.subContenedorModalEditar,
                                {
                                    transform: [{ scale: modalScale }],
                                    opacity: modalOpacity
                                }
                            ]}
                        >
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => updateState({ modalEditar: false })}
                                style={style.btnModalClose}
                            >
                                <FontAwesome name='times-circle' style={style.iconCerrar} />
                            </TouchableOpacity>

                            <Text style={style.text}>Placa</Text>
                            <TextInput
                                placeholder="Placa"
                                autoCapitalize='characters'
                                onChangeText={(placaEditar) => updateState({ placaEditar })}
                                value={placaEditar}
                                style={style.input}
                                placeholderTextColor="#aaa"
                            />

                            <Text style={style.text}>Centro de costos</Text>
                            <TextInput
                                placeholder="Centro Costos"
                                autoCapitalize='none'
                                onChangeText={(centroEditar) => updateState({ centroEditar })}
                                value={centroEditar}
                                style={style.input}
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />

                            <Text style={style.text}>Bodega</Text>
                            <TextInput
                                placeholder="Bodega"
                                autoCapitalize='none'
                                onChangeText={(bodegaEditar) => updateState({ bodegaEditar })}
                                value={bodegaEditar}
                                style={style.input}
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />

                            <TouchableOpacity style={style.btnGuardar} onPress={editar}>
                                <Text style={style.textGuardar}>Guardar</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    // Modal for selecting conductor
    const renderModalConductores = () => {
        const { conductor, modalConductor, conductores } = state;

        return (
            <Modal transparent visible={modalConductor} animationType="none">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => updateState({ modalConductor: false })}
                >
                    <View style={style.contenedorModal}>
                        <Animated.View
                            style={[
                                style.subContenedorModal,
                                {
                                    transform: [{ scale: modalScale }],
                                    opacity: modalOpacity
                                }
                            ]}
                        >
                            <ScrollView>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => updateState({ modalConductor: false })}
                                    style={style.btnModalClose}
                                >
                                    <FontAwesome name='times-circle' style={style.iconCerrar} />
                                </TouchableOpacity>

                                <Text style={style.titulo}>
                                    {conductores.length === 0 ? "No hay conductores libres" : "Selecciona un conductor"}
                                </Text>

                                {conductores.map((conductorItem: Usuario) => (
                                    <TouchableOpacity
                                        key={conductorItem._id}
                                        style={[
                                            style.contenedorConductor,
                                            conductor === conductorItem._id ? { backgroundColor: "#5cb85c" } : {}
                                        ]}
                                        onPress={conductor === conductorItem._id
                                            ? () => desvincularConductor(conductorItem.nombre, conductorItem._id)
                                            : () => asignarConductor(conductorItem.nombre, conductorItem._id)
                                        }
                                    >
                                        <Text style={style.conductor}>{conductorItem.nombre}</Text>
                                        {conductorItem.avatar && (
                                            <Image source={{ uri: conductorItem.avatar }} style={style.avatar} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    // Create vehicle
    const crearVehiculo = useCallback(() => {
        const { placa, centro, bodega, idUsuario: usuarioCrea } = state;

        if (placa.length > VEHICULO_CONSTANTS.MIN_PLACA_LENGTH) {
            const data = { placa, centro, bodega, usuarioCrea };

            axios({
                method: 'post',
                url: `veh/vehiculo`,
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(res => {
                    if (res.data.status) {
                        Toast.show({ type: 'success', text1: 'Vehículo Guardado' });
                        updateState({ placa: "", centro: "", bodega: "" });
                        dispatch(getVehiculos() as any);
                    } else {
                        Toast.show({ type: 'error', text1: 'Esta placa ya existe' });
                    }
                })
                .catch(() => {
                    Toast.show({ type: 'error', text1: 'Error al crear vehículo' });
                });
        } else {
            Toast.show({ type: 'error', text1: 'Placa inválida' });
        }
    }, [state, updateState, dispatch]);

    // Edit vehicle
    const editar = useCallback(() => {
        const { idVehiculo, placaEditar, centroEditar, bodegaEditar } = state;

        if (placaEditar.length > VEHICULO_CONSTANTS.MIN_PLACA_LENGTH) {
            axios.put(`veh/vehiculo/editar/${idVehiculo}`, {
                placa: placaEditar,
                centro: centroEditar,
                bodega: bodegaEditar
            })
                .then(res => {
                    if (res.data.status) {
                        Toast.show({ type: 'success', text1: 'Vehículo Editado' });
                        updateState({ modalEditar: false, placaEditar: "", centroEditar: "", bodegaEditar: "" });
                        dispatch(getVehiculos() as any);
                    } else {
                        Toast.show({ type: 'error', text1: 'Esta placa ya existe' });
                    }
                })
                .catch(() => {
                    Toast.show({ type: 'error', text1: 'Error al editar vehículo' });
                });
        } else {
            Toast.show({ type: 'error', text1: 'Placa inválida' });
        }
    }, [state, updateState, dispatch]);

    // Assign conductor
    const asignarConductor = useCallback((nombreConductor: string, idConductor: string) => {
        const { placaVehiculo, idVehiculo } = state;

        Alert.alert(
            `¿Seguro deseas agregar a ${nombreConductor}?`,
            `a la placa: ${placaVehiculo}`,
            [
                {
                    text: 'Confirmar',
                    onPress: () => {
                        axios.get(`veh/vehiculo/asignarConductor/${idVehiculo}/${idConductor}`)
                            .then((res) => {
                                if (res.data.status) {
                                    updateState({ modalConductor: false });
                                    dispatch(getVehiculos() as any);
                                    Toast.show({ type: 'success', text1: 'Conductor Agregado con éxito' });
                                } else {
                                    Toast.show({ type: 'error', text1: 'Tenemos un problema, inténtelo más tarde' });
                                }
                            })
                            .catch(() => {
                                Toast.show({ type: 'error', text1: 'Error al asignar conductor' });
                            });
                    }
                },
                {
                    text: 'Cancelar',
                    onPress: () => updateState({ modalConductor: false, placaVehiculo: '', conductor: '' })
                },
            ],
            { cancelable: false },
        );
    }, [state, updateState, dispatch]);

    // Unassign conductor
    const desvincularConductor = useCallback((nombreConductor: string, idVehiculo: string, placaVehiculo?: string) => {
        Alert.alert(
            `¿Seguro deseas desvincular a ${nombreConductor}?`,
            placaVehiculo ? `de la placa: ${placaVehiculo}` : '',
            [
                {
                    text: 'Confirmar',
                    onPress: () => {
                        axios.get(`veh/vehiculo/desvincularConductor/${idVehiculo}`)
                            .then((res) => {
                                if (res.data.status) {
                                    updateState({ modalConductor: false, conductores: [] });
                                    dispatch(getVehiculos() as any);
                                    Toast.show({ type: 'success', text1: 'Conductor desvinculado' });
                                } else {
                                    Toast.show({ type: 'error', text1: 'Tenemos un problema, inténtelo más tarde' });
                                }
                            })
                            .catch(() => {
                                Toast.show({ type: 'error', text1: 'Error al desvincular conductor' });
                            });
                    }
                },
                {
                    text: 'Cancelar',
                    onPress: () => updateState({ modalConductor: false, placaVehiculo: '', conductor: '' })
                },
            ],
            { cancelable: false },
        );
    }, [updateState, dispatch]);

    // Delete vehicle
    const eliminarVehiculo = useCallback((placaVehiculo: string, idVehiculo: string) => {
        Alert.alert(
            `¿Seguro deseas eliminar ${idVehiculo}?`,
            `de la placa: ${placaVehiculo}`,
            [
                {
                    text: 'Confirmar',
                    onPress: () => {
                        axios.get(`veh/vehiculo/eliminar/${idVehiculo}/true`)
                            .then((res) => {
                                if (res.data.status) {
                                    Toast.show({ type: 'success', text1: `Vehículo ${placaVehiculo} eliminado` });
                                    dispatch(getVehiculos() as any);
                                } else {
                                    Toast.show({ type: 'error', text1: 'Tenemos un problema, inténtelo más tarde' });
                                }
                            })
                            .catch(() => {
                                Toast.show({ type: 'error', text1: 'Error al eliminar vehículo' });
                            });
                    }
                },
                { text: 'Cancelar', onPress: () => { } },
            ],
            { cancelable: false },
        );
    }, [dispatch]);

    return (
        <View style={style.container}>
            {renderHeader()}
            {renderModalConductores()}
            {renderModalEditar()}

            <ScrollView style={style.subContenedor}>
                {vehiculos.length === 0 ? (
                    <ActivityIndicator color="#00218b" />
                ) : (
                    renderVehiculos()
                )}
            </ScrollView>

            <Footer navigation={navigation} />
            <Toast />
        </View>
    );
};

export default VehiculoComponent;