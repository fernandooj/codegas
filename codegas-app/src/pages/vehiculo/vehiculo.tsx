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
    StatusBar,
    FlatList
} from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { getVehiculos } from '../../redux/actions/vehiculoActions';
import { getConductoresSimple } from '../../redux/actions/usuarioActions';
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
    const conductores = useSelector((state: RootState) => state.usuario.usuarios || []);

    // Context
    const { userId, acceso } = useContext(DataContext) as DataContextType;

    // State
    const [state, setState] = useState<VehiculoState>({
        placa: '',
        centro: '',
        bodega: '',
        capacidad: '',
        modalConductor: false,
        modalEditar: false,
        modalCrear: false,
        conductores: [],
        conductor: '',
        placaVehiculo: '',
        idVehiculo: '',
        placaEditar: '',
        centroEditar: '',
        bodegaEditar: '',
        capacidadEditar: '',
        activoEditar: true,
        idUsuario: userId,
        acceso: acceso || '',
        sortBy: 'placa',
        sortOrder: 'asc'
    });

    // Animation refs
    const modalScale = useRef(new Animated.Value(0)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;
    const conductorModalScale = useRef(new Animated.Value(0.5)).current;
    const conductorModalOpacity = useRef(new Animated.Value(0)).current;
    const conductorModalTranslateY = useRef(new Animated.Value(30)).current;

    // Update state helper
    const updateState = useCallback((updates: Partial<VehiculoState>) => {
        setState(prevState => ({ ...prevState, ...updates }));
    }, []);

    // Load initial data
    useEffect(() => {
        dispatch(getVehiculos() as any);
        dispatch(getConductoresSimple(1000, 0) as any);
    }, [dispatch]);

    // Filter available conductors
    const resultFilter = useCallback((firstArray: Usuario[], secondArray: Vehiculo[]) => {
        return firstArray.filter(firstArrayItem =>
            !secondArray.some(secondArrayItem =>
                firstArrayItem._id === secondArrayItem.conductor?._id
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
        if (state.modalConductor || state.modalEditar || state.modalCrear) {
            if (state.modalConductor) {
                // Animación específica para modal de conductores
                Animated.parallel([
                    Animated.spring(conductorModalScale, {
                        toValue: 1,
                        tension: 100,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                    Animated.timing(conductorModalOpacity, {
                        toValue: 1,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                    Animated.timing(conductorModalTranslateY, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else {
                // Animación para otros modales
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
            }
        } else {
            // Cerrar todos los modales
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
                }),
                Animated.timing(conductorModalScale, {
                    toValue: 0.5,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(conductorModalOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(conductorModalTranslateY, {
                    toValue: 30,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [state.modalConductor, state.modalEditar, state.modalCrear, modalScale, modalOpacity, conductorModalScale, conductorModalOpacity, conductorModalTranslateY]);

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
                        Capacidad: {vehiculo.capacidad || 0} litros
                    </Text>
                    <Text style={{ fontFamily: "Comfortaa-Regular" }}>
                        Conductor: {vehiculo.conductor?.nombre || "Sin conductor"}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 4
                    }}>
                        <View style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: vehiculo.activo !== false ? '#5cb85c' : '#d9534f',
                            marginRight: 6
                        }} />
                        <Text style={{
                            fontFamily: "Comfortaa-Regular",
                            color: vehiculo.activo !== false ? '#5cb85c' : '#d9534f',
                            fontWeight: '600'
                        }}>
                            {vehiculo.activo !== false ? 'Activo' : 'Inactivo'}
                        </Text>
                    </View>
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
                        centroEditar: vehiculo.centro ? String(vehiculo.centro) : '',
                        bodegaEditar: vehiculo.bodega ? String(vehiculo.bodega) : '',
                        capacidadEditar: vehiculo.capacidad ? String(vehiculo.capacidad) : '0',
                        activoEditar: vehiculo.activo !== false
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
        const { placaEditar, modalEditar, centroEditar, bodegaEditar, capacidadEditar, activoEditar } = state;

        return (
            <Modal transparent visible={modalEditar} animationType="none">
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <Animated.View
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            width: '100%',
                            maxWidth: 500,
                            maxHeight: '80%',
                            transform: [{ scale: modalScale }],
                            opacity: modalOpacity,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 8,
                            elevation: 5,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => updateState({ modalEditar: false })}
                            style={{
                                position: 'absolute',
                                top: 15,
                                right: 15,
                                zIndex: 10,
                                padding: 5
                            }}
                        >
                            <FontAwesome name='times-circle' style={{ fontSize: 28, color: '#666' }} />
                        </TouchableOpacity>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ padding: 25, paddingTop: 50 }}
                        >
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginBottom: 25,
                                color: '#333'
                            }}>
                                Editar Vehículo
                            </Text>

                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8,
                                marginTop: 10
                            }}>Placa</Text>
                            <TextInput
                                placeholder="Placa"
                                autoCapitalize='characters'
                                onChangeText={(placaEditar) => updateState({ placaEditar })}
                                value={placaEditar}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#e9ecef',
                                    borderRadius: 8,
                                    paddingHorizontal: 15,
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    backgroundColor: '#f8f9fa',
                                    marginBottom: 15
                                }}
                                placeholderTextColor="#aaa"
                            />

                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8
                            }}>Centro de costos</Text>
                            <TextInput
                                placeholder="Centro Costos"
                                autoCapitalize='none'
                                onChangeText={(centroEditar) => updateState({ centroEditar })}
                                value={centroEditar}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#e9ecef',
                                    borderRadius: 8,
                                    paddingHorizontal: 15,
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    backgroundColor: '#f8f9fa',
                                    marginBottom: 15
                                }}
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />

                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8
                            }}>Bodega</Text>
                            <TextInput
                                placeholder="Bodega"
                                autoCapitalize='none'
                                onChangeText={(bodegaEditar) => updateState({ bodegaEditar })}
                                value={bodegaEditar}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#e9ecef',
                                    borderRadius: 8,
                                    paddingHorizontal: 15,
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    backgroundColor: '#f8f9fa',
                                    marginBottom: 15
                                }}
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />

                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8
                            }}>Capacidad (litros)</Text>
                            <TextInput
                                placeholder="Capacidad"
                                autoCapitalize='none'
                                onChangeText={(capacidadEditar) => updateState({ capacidadEditar })}
                                value={capacidadEditar}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#e9ecef',
                                    borderRadius: 8,
                                    paddingHorizontal: 15,
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    backgroundColor: '#f8f9fa',
                                    marginBottom: 15
                                }}
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />

                            <View style={{ marginVertical: 10 }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: 10
                                }}>
                                    Estado del vehículo
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    gap: 10
                                }}>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            paddingVertical: 12,
                                            paddingHorizontal: 20,
                                            borderRadius: 8,
                                            backgroundColor: activoEditar ? '#5cb85c' : '#f8f9fa',
                                            borderWidth: 2,
                                            borderColor: activoEditar ? '#5cb85c' : '#e9ecef',
                                            alignItems: 'center'
                                        }}
                                        onPress={() => updateState({ activoEditar: true })}
                                    >
                                        <Text style={{
                                            color: activoEditar ? 'white' : '#666',
                                            fontWeight: '600',
                                            fontSize: 15
                                        }}>
                                            ✓ Activo
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            paddingVertical: 12,
                                            paddingHorizontal: 20,
                                            borderRadius: 8,
                                            backgroundColor: !activoEditar ? '#d9534f' : '#f8f9fa',
                                            borderWidth: 2,
                                            borderColor: !activoEditar ? '#d9534f' : '#e9ecef',
                                            alignItems: 'center'
                                        }}
                                        onPress={() => updateState({ activoEditar: false })}
                                    >
                                        <Text style={{
                                            color: !activoEditar ? 'white' : '#666',
                                            fontWeight: '600',
                                            fontSize: 15
                                        }}>
                                            ✕ Inactivo
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#00218b',
                                    paddingVertical: 15,
                                    borderRadius: 8,
                                    marginTop: 20,
                                    alignItems: 'center',
                                    shadowColor: '#00218b',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4,
                                    elevation: 3
                                }}
                                onPress={editar}
                            >
                                <Text style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}>Guardar Cambios</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </Animated.View>
                </View>
            </Modal>
        );
    };

    // Modal for selecting conductor
    const renderModalConductores = () => {
        const { conductor, modalConductor, conductores, placaVehiculo } = state;

        return (
            <Modal transparent visible={modalConductor} animationType="fade">
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingTop: 100
                }}>
                    <Animated.View
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 16,
                            width: '90%',
                            maxWidth: 400,
                            height: 'auto',
                            minHeight: 500,
                            maxHeight: '70%',
                            transform: [
                                { scale: conductorModalScale },
                                { translateY: conductorModalTranslateY }
                            ],
                            opacity: conductorModalOpacity,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.25,
                            shadowRadius: 16,
                            elevation: 10,
                        }}
                    >
                        {/* Header del modal */}
                        <View style={{
                            backgroundColor: '#00218b',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            padding: 20,
                            paddingTop: 25,
                            paddingBottom: 25
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => updateState({ modalConductor: false })}
                                style={{
                                    position: 'absolute',
                                    top: 15,
                                    right: 15,
                                    zIndex: 10,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 20,
                                    width: 36,
                                    height: 36,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <FontAwesome name='times' style={{ fontSize: 18, color: 'white' }} />
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 12,
                                    padding: 12,
                                    marginRight: 15
                                }}>
                                    <FontAwesome name='users' style={{ fontSize: 24, color: 'white' }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        fontSize: 22,
                                        fontWeight: 'bold',
                                        color: 'white',
                                        marginBottom: 4
                                    }}>
                                        Asignar Conductor
                                    </Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: 'rgba(255,255,255,0.9)'
                                    }}>
                                        {placaVehiculo}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Contador de conductores */}
                        <View style={{
                            backgroundColor: 'white',
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#e9ecef'
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: '#666',
                                fontWeight: '600'
                            }}>
                                {conductores.length === 0
                                    ? '😔 No hay conductores disponibles'
                                    : `✓ ${conductores.length} conductor${conductores.length !== 1 ? 'es' : ''} disponible${conductores.length !== 1 ? 's' : ''}`
                                }
                            </Text>
                        </View>

                        {/* Lista de conductores - FlatList approach */}
                        <View style={{
                            backgroundColor: 'white',
                            margin: 15,
                            padding: 10,
                            paddingBottom: 20
                        }}>
                            {conductores.length === 0 ? (
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: 40,
                                    flex: 1
                                }}>
                                    <FontAwesome name='user-times' style={{ fontSize: 50, color: '#adb5bd', marginBottom: 20 }} />
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: '600',
                                        color: '#495057',
                                        marginBottom: 8,
                                        textAlign: 'center'
                                    }}>
                                        No hay conductores libres
                                    </Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#6c757d',
                                        textAlign: 'center',
                                        paddingHorizontal: 30,
                                        lineHeight: 20
                                    }}>
                                        Todos los conductores están asignados
                                    </Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={conductores}
                                    keyExtractor={(item) => item._id.toString()}
                                    renderItem={({ item: conductorItem }: { item: Usuario }) => {
                                        const isSelected = conductor === conductorItem._id;
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={isSelected
                                                    ? () => desvincularConductor(conductorItem.nombre, conductorItem._id)
                                                    : () => asignarConductor(conductorItem.nombre, conductorItem._id)
                                                }
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: isSelected ? '#d4edda' : 'white',
                                                    borderRadius: 10,
                                                    padding: 15,
                                                    marginBottom: 8,
                                                    borderWidth: 1,
                                                    borderColor: isSelected ? '#28a745' : '#dee2e6',
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 1 },
                                                    shadowOpacity: 0.1,
                                                    shadowRadius: 2,
                                                    elevation: 2
                                                }}
                                            >
                                                {/* Avatar simple */}
                                                <View style={{
                                                    width: 45,
                                                    height: 45,
                                                    borderRadius: 22.5,
                                                    backgroundColor: isSelected ? '#28a745' : '#007bff',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginRight: 12
                                                }}>
                                                    <FontAwesome
                                                        name='user'
                                                        style={{ fontSize: 20, color: 'white' }}
                                                    />
                                                </View>

                                                {/* Info del conductor */}
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{
                                                        fontSize: 15,
                                                        fontWeight: '600',
                                                        color: '#333',
                                                        marginBottom: 2
                                                    }}>
                                                        {conductorItem.nombre}
                                                    </Text>
                                                    <Text style={{
                                                        fontSize: 12,
                                                        color: '#6c757d'
                                                    }}>
                                                        ID: {conductorItem._id}
                                                    </Text>
                                                </View>

                                                {/* Checkmark */}
                                                <View style={{
                                                    width: 25,
                                                    height: 25,
                                                    borderRadius: 12.5,
                                                    backgroundColor: isSelected ? '#28a745' : '#e9ecef',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    {isSelected && (
                                                        <FontAwesome name='check' style={{ fontSize: 12, color: 'white' }} />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }}
                                    showsVerticalScrollIndicator={true}
                                    nestedScrollEnabled={true}
                                    style={{ maxHeight: 250 }}
                                />
                            )}
                        </View>

                        {/* Footer info */}
                        {conductores.length > 0 && (
                            <View style={{
                                backgroundColor: 'white',
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderBottomLeftRadius: 16,
                                borderBottomRightRadius: 16,
                                borderTopWidth: 1,
                                borderTopColor: '#e9ecef'
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: '#6c757d',
                                    textAlign: 'center'
                                }}>
                                    💡 Toca un conductor para asignarlo al vehículo
                                </Text>
                            </View>
                        )}
                    </Animated.View>
                </View>
            </Modal>
        );
    };

    // Modal for creating vehicle
    const renderModalCrear = () => {
        const { placa, modalCrear, centro, bodega, capacidad } = state;

        return (
            <Modal transparent visible={modalCrear} animationType="none">
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <Animated.View
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            width: '100%',
                            maxWidth: 500,
                            maxHeight: '80%',
                            transform: [{ scale: modalScale }],
                            opacity: modalOpacity,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 8,
                            elevation: 5,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => updateState({ modalCrear: false })}
                            style={{
                                position: 'absolute',
                                top: 15,
                                right: 15,
                                zIndex: 10,
                                padding: 5
                            }}
                        >
                            <FontAwesome name='times-circle' style={{ fontSize: 28, color: '#666' }} />
                        </TouchableOpacity>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ padding: 25, paddingTop: 50 }}
                        >
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginBottom: 25,
                                color: '#333'
                            }}>
                                Agregar Nuevo Vehículo
                            </Text>

                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8,
                                marginTop: 10
                            }}>Placa</Text>
                            <TextInput
                                placeholder="Placa"
                                autoCapitalize='characters'
                                onChangeText={(placa) => updateState({ placa })}
                                value={placa}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#e9ecef',
                                    borderRadius: 8,
                                    paddingHorizontal: 15,
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    backgroundColor: '#f8f9fa',
                                    marginBottom: 15
                                }}
                                placeholderTextColor="#aaa"
                            />

                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8
                            }}>Centro de costos</Text>
                            <TextInput
                                placeholder="Centro Costos"
                                autoCapitalize='none'
                                onChangeText={(centro) => updateState({ centro })}
                                value={centro}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#e9ecef',
                                    borderRadius: 8,
                                    paddingHorizontal: 15,
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    backgroundColor: '#f8f9fa',
                                    marginBottom: 15
                                }}
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />

                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8
                            }}>Bodega</Text>
                            <TextInput
                                placeholder="Bodega"
                                autoCapitalize='none'
                                onChangeText={(bodega) => updateState({ bodega })}
                                value={bodega}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#e9ecef',
                                    borderRadius: 8,
                                    paddingHorizontal: 15,
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    backgroundColor: '#f8f9fa',
                                    marginBottom: 15
                                }}
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />

                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8
                            }}>Capacidad (litros)</Text>
                            <TextInput
                                placeholder="Capacidad"
                                autoCapitalize='none'
                                onChangeText={(capacidad) => updateState({ capacidad })}
                                value={capacidad}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#e9ecef',
                                    borderRadius: 8,
                                    paddingHorizontal: 15,
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    backgroundColor: '#f8f9fa',
                                    marginBottom: 15
                                }}
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#00218b',
                                    paddingVertical: 15,
                                    borderRadius: 8,
                                    marginTop: 20,
                                    alignItems: 'center',
                                    shadowColor: '#00218b',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4,
                                    elevation: 3
                                }}
                                onPress={crearVehiculo}
                            >
                                <Text style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}>Crear Vehículo</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </Animated.View>
                </View>
            </Modal>
        );
    };

    // Create vehicle
    const crearVehiculo = useCallback(() => {
        const { placa, centro, bodega, capacidad, idUsuario: usuarioCrea } = state;

        if (placa.length > VEHICULO_CONSTANTS.MIN_PLACA_LENGTH) {
            const data = {
                placa,
                centro,
                bodega,
                capacidad: capacidad ? parseInt(capacidad, 10) : 0,
                usuarioCrea
            };

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
                        updateState({
                            placa: "",
                            centro: "",
                            bodega: "",
                            capacidad: "",
                            modalCrear: false
                        });
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
        const { idVehiculo, placaEditar, centroEditar, bodegaEditar, capacidadEditar, activoEditar } = state;

        if (placaEditar.length > VEHICULO_CONSTANTS.MIN_PLACA_LENGTH) {
            axios.put(`veh/vehiculo/editar/${idVehiculo}`, {
                placa: placaEditar,
                centro: centroEditar,
                bodega: bodegaEditar,
                capacidad: capacidadEditar ? parseInt(capacidadEditar, 10) : 0,
                activo: activoEditar
            })
                .then(res => {
                    if (res.data.status) {
                        Toast.show({ type: 'success', text1: 'Vehículo Editado' });
                        updateState({
                            modalEditar: false,
                            placaEditar: "",
                            centroEditar: "",
                            bodegaEditar: "",
                            capacidadEditar: "",
                            activoEditar: true
                        });
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
            {renderModalCrear()}

            <ScrollView style={style.subContenedor}>
                {vehiculos.length === 0 ? (
                    <ActivityIndicator color="#00218b" />
                ) : (
                    renderVehiculos()
                )}
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 80,
                    right: 20,
                    backgroundColor: '#00218b',
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 8,
                }}
                onPress={() => updateState({ modalCrear: true })}
            >
                <FontAwesome name='plus' style={{ color: 'white', fontSize: 24 }} />
            </TouchableOpacity>

            <Footer navigation={navigation} />
            <Toast />
        </View>
    );
};

export default VehiculoComponent;