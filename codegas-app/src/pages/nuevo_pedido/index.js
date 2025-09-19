import React, { useState, useEffect, useContext, useRef } from 'react'
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, ImageBackground, Image, Alert, ScrollView, Animated } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Toast from 'react-native-toast-message';
import axios from 'axios'
import moment from 'moment'
import ModalSelector from 'react-native-modal-selector'
import { Calendar } from 'react-native-calendars';
import { TextInputMask } from 'react-native-masked-text'

import { useDispatch, useSelector } from "react-redux";
import { DataContext } from "../../context/context"
import { getUsuariosAcceso, getUsuarios, getPointsByClient } from '../../redux/actions/usuarioActions'
import { verificarPedidoHoy, crearPedido } from '../../redux/actions/pedidoActions'
import Footer from '../components/footer'
import { style } from './style'

import { frecuencias, dias, diasN, dia1, dia2 } from '../../utils/pedido_info'

const Nuevo_pedido = ({ navigation }) => {
    const context = useContext(DataContext);
    const { acceso, userId: idUsuario, email, nombre } = context;
    const dispatch = useDispatch();
    const campoMonto = useRef(null);

    // Estados para animaciones del modal
    const [modalAnimation] = useState(new Animated.Value(0));
    const [overlayAnimation] = useState(new Animated.Value(0));

    // Selector de Redux para obtener los clientes
    const clientes = useSelector(state => state.usuario.usuarios || []);
    const usuariosAcceso = useSelector(state => state.usuario.usuariosAcceso || []);

    const [state, setState] = useState({
        imagen: [],
        terminoBuscador: "",
        inicio: 0,
        final: 7,
        categoriaUser: [],
        clientes: [],
        puntos: [],
        modalCliente: false,
        modalFechaEntrega: true,
        email: '',
        nombre: '',
        acceso: '',
        usuarios: [],
        showRenderUsuarios: false,
        showClientes: false,
        showFrecuencia: false,
        showFechaEntrega: false,
        forma: null,
        cantidad: '',
        frecuencia: null,
        diaSeleccionado1: null,
        diaSeleccionado2: null,
        franja: null,
        idCliente: null,
        cliente: null,
        emailCliente: '',
        puntoId: null,
        solicitud: false,
        fechaSolicitud: '',
        novedad: '',
        guardando: false,
        idUsuario: null
    });

    useEffect(() => {
        if (!nombre && idUsuario) {
            navigation.navigate("verPerfil", { tipoAcceso: null });
        }

        setState(prev => ({ ...prev, idUsuario, acceso, email, nombre }));

        if (acceso === 'cliente') {
            getPuntos(idUsuario);
        }

        // Solo cargar usuarios si no es cliente
        if (acceso !== 'cliente') {
            // Usar la misma lógica que en clientes: cargar usuarios con acceso 'cliente'
            const action = getUsuarios(100, 0, 'cliente', '', idUsuario);
            if (action && typeof action === 'function') {
                dispatch(action);
            }
        }
    }, [context, navigation, dispatch, acceso, idUsuario, nombre]);

    // Efecto para animaciones del modal
    useEffect(() => {
        if (state.showClientes) {
            // Reset animations
            modalAnimation.setValue(0);
            overlayAnimation.setValue(0);

            // Start entrance animations
            Animated.parallel([
                Animated.timing(overlayAnimation, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.spring(modalAnimation, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [state.showClientes]);

    const getPuntos = async (id) => {
        try {
            const response = await getPointsByClient(id);
            console.log(response);
            if (response.status) {
                if (response.puntos.length === 1) {
                    setState(prev => ({
                        ...prev,
                        puntos: response.puntos,
                        puntoId: response.puntos[0]._id
                    }));
                } else {
                    setState(prev => ({ ...prev, puntos: response.puntos }));
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Tuvimos un problema',
                    text2: 'intentele mas tarde'
                });
            }
        } catch (error) {
            console.error('Error fetching puntos:', error);
            Toast.show({
                type: 'error',
                text1: 'Error al cargar puntos',
                text2: 'Intente más tarde'
            });
        }
    };

    const getClientes = () => {
        const { terminoBuscador, idUsuario, acceso } = state;

        // Si el acceso es cliente, no debe llamar a ningún endpoint de usuarios
        if (acceso === 'cliente') {
            Toast.show({
                type: 'info',
                text1: 'Los clientes no pueden buscar otros usuarios',
                text2: 'Solo pueden crear pedidos para sí mismos'
            });
            return;
        }

        // Usar la misma lógica que en la página de clientes
        const action = getUsuarios(10, 0, 'cliente', terminoBuscador, idUsuario);
        if (action && typeof action === 'function') {
            dispatch(action);
        }
    };
    const renderUsuarios = () => {
        return clientes.map((e, key) => {
            const isInactive = !e.activo;
            return (
                <TouchableOpacity
                    key={key}
                    style={[
                        style.clienteCard,
                        isInactive && style.clienteCardInactive
                    ]}
                    onPress={() => filtroClientes(e)}
                    disabled={isInactive}
                    activeOpacity={0.7}
                >
                    <View style={style.clienteCardContent}>
                        {/* Avatar placeholder */}
                        <View style={[
                            style.clienteAvatar,
                            isInactive && style.clienteAvatarInactive
                        ]}>
                            <FontAwesome
                                name="user"
                                size={20}
                                style={[
                                    style.clienteAvatarIcon,
                                    isInactive && style.clienteAvatarIconInactive
                                ]}
                            />
                        </View>

                        {/* Client info */}
                        <View style={style.clienteInfo}>
                            {e.acceso === "cliente" && (
                                <Text style={[
                                    style.clienteRazonSocial,
                                    isInactive && style.clienteTextInactive
                                ]}>
                                    {e.razon_social || 'Sin razón social'}
                                </Text>
                            )}
                            <Text style={[
                                style.clienteNombre,
                                isInactive && style.clienteTextInactive
                            ]}>
                                {e.nombre}
                            </Text>
                            {e.codt && (
                                <Text style={[
                                    style.clienteCodt,
                                    isInactive && style.clienteTextInactive
                                ]}>
                                    CODT: {e.codt}
                                </Text>
                            )}

                            {/* Badge de estado */}
                            <View style={[
                                style.clienteStatusBadge,
                                isInactive ? style.clienteStatusBadgeInactive : style.clienteStatusBadgeActive
                            ]}>
                                <Text style={[
                                    style.clienteStatusText,
                                    isInactive ? style.clienteStatusTextInactive : style.clienteStatusTextActive
                                ]}>
                                    {isInactive ? 'INACTIVO' : 'ACTIVO'}
                                </Text>
                            </View>
                        </View>

                        {/* Arrow icon */}
                        <View style={style.clienteArrowContainer}>
                            <FontAwesome
                                name="chevron-right"
                                size={16}
                                style={[
                                    style.clienteArrowIcon,
                                    isInactive && style.clienteArrowIconInactive
                                ]}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })
    };
    const renderCliente = () => {
        const { idCliente, cliente, acceso } = state;

        // Si el acceso es cliente, no debe mostrar opciones de asignar cliente
        if (acceso === 'cliente') {
            return null;
        }

        return (
            <View>
                {idCliente ? (
                    <TouchableOpacity
                        style={style.eliminarFrecuencia}
                        onPress={() => setState(prev => ({
                            ...prev,
                            idCliente: null,
                            cliente: null,
                            puntos: []
                        }))}
                    >
                        <FontAwesome name="minus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>{cliente}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={style.nuevaFrecuencia}
                        onPress={() => setState(prev => ({ ...prev, showClientes: true }))}
                    >
                        <FontAwesome name="plus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>Asignar Cliente</Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    };
    const modalCliente = () => {
        const { showRenderUsuarios, terminoBuscador } = state;

        const closeModal = () => {
            Animated.parallel([
                Animated.timing(overlayAnimation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(modalAnimation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                setState(prev => ({
                    ...prev,
                    showClientes: false,
                    terminoBuscador: '',
                    showRenderUsuarios: false
                }));
            });
        };

        return (
            <Modal transparent visible={true} animationType="none" onRequestClose={closeModal}>
                <Animated.View
                    style={[
                        style.modalOverlay,
                        {
                            opacity: overlayAnimation,
                        }
                    ]}
                >
                    <Animated.View
                        style={[
                            style.modalContainer,
                            {
                                transform: [
                                    {
                                        scale: modalAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.3, 1],
                                        }),
                                    },
                                    {
                                        translateY: modalAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [50, 0],
                                        }),
                                    },
                                ],
                            }
                        ]}
                    >
                        {/* Header del Modal */}
                        <View style={style.modalHeader}>
                            <Text style={style.modalTitle}>
                                Seleccionar Cliente
                            </Text>
                            <TouchableOpacity
                                onPress={closeModal}
                                style={style.modalCloseButton}
                            >
                                <FontAwesome name="times" size={16} style={style.modalCloseIcon} />
                            </TouchableOpacity>
                        </View>

                        {/* Barra de búsqueda */}
                        <View style={style.modalSearchContainer}>
                            <View style={style.modalSearchInputContainer}>
                                <TextInput
                                    placeholder="Buscar cliente por nombre o razón social..."
                                    value={terminoBuscador}
                                    style={style.modalSearchInput}
                                    onChangeText={(terminoBuscador) => setState(prev => ({ ...prev, terminoBuscador }))}
                                    placeholderTextColor="#999"
                                />
                                <TouchableOpacity
                                    style={style.modalSearchButton}
                                    onPress={() => {
                                        if (terminoBuscador.length > 1) {
                                            getClientes();
                                            setState(prev => ({ ...prev, showRenderUsuarios: true }));
                                        } else {
                                            Toast.show({
                                                type: 'info',
                                                text1: 'Ingrese al menos 2 caracteres para buscar'
                                            });
                                        }
                                    }}
                                >
                                    <FontAwesome name='search' style={style.modalSearchIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Lista de clientes */}
                        <View style={style.modalContent}>
                            {showRenderUsuarios ? (
                                clientes.length > 0 ? (
                                    <ScrollView style={style.modalScrollView}>
                                        {renderUsuarios()}
                                    </ScrollView>
                                ) : (
                                    <View style={style.modalEmptyState}>
                                        <FontAwesome
                                            name="users"
                                            size={48}
                                            style={style.modalEmptyIcon}
                                        />
                                        <Text style={style.modalEmptyText}>
                                            No se encontraron clientes
                                        </Text>
                                        <Text style={style.modalEmptySubtext}>
                                            Intenta con otro término de búsqueda
                                        </Text>
                                    </View>
                                )
                            ) : (
                                <View style={style.modalEmptyState}>
                                    <FontAwesome
                                        name="search"
                                        size={48}
                                        style={style.modalEmptyIcon}
                                    />
                                    <Text style={style.modalEmptyText}>
                                        Buscar Clientes
                                    </Text>
                                    <Text style={style.modalEmptySubtext}>
                                        Ingresa el nombre o razón social del cliente
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Footer */}
                        <View style={style.modalFooter}>
                            <TouchableOpacity
                                style={style.modalCancelButton}
                                onPress={closeModal}
                            >
                                <Text style={style.modalCancelText}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            </Modal>
        )
    };
    const renderPedido = () => {
        const {
            forma,
            acceso,
            cantidad,
            showFrecuencia,
            frecuencia,
            diaSeleccionado1,
            diaSeleccionado2,
            novedad,
            idCliente,
            puntoId,
            puntos,
            solicitud,
            fechaSolicitud,
            guardando,
            showClientes
        } = state;

        return (
            <View style={style.subContainerNuevo}>
                {showClientes && modalCliente()}
                <View style={style.contenedorMonto}>
                    <Text style={style.tituloForm}>Realice su pedido</Text>
                    <TouchableOpacity
                        onPress={() => setState(prev => ({ ...prev, forma: "monto", cantidad: "" }))}
                        style={style.btnFormaLlenar}
                    >
                        <Image source={require('../../assets/img/pg3/btn2.png')} style={style.icon} resizeMode={'contain'} />
                        <Text style={style.textForma}>Monto $</Text>
                        {forma === "monto" && <FontAwesome name="check" style={style.iconCheck} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setState(prev => ({ ...prev, forma: "cantidad", cantidad: "" }))}
                        style={style.btnFormaLlenar}
                    >
                        <Image source={require('../../assets/img/pg3/btn3.png')} style={style.icon} resizeMode={'contain'} />
                        <Text style={style.textForma}>Cantidad KG</Text>
                        {forma === "cantidad" && <FontAwesome name="check" style={style.iconCheck} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setState(prev => ({ ...prev, forma: "lleno", cantidad: "" }))}
                        style={style.btnFormaLlenar}
                    >
                        <Image source={require('../../assets/img/pg3/btn4.png')} style={style.icon} resizeMode={'contain'} />
                        <Text style={style.textForma}>Lleno total</Text>
                        {forma === "lleno" && <FontAwesome name="check" style={style.iconCheck} />}
                    </TouchableOpacity>
                </View>
                {forma === "monto" ? (
                    <TextInputMask
                        type={'money'}
                        options={{
                            precision: 0,
                            separator: ',',
                            delimiter: '.',
                            unit: '$',
                            suffixUnit: ''
                        }}
                        value={cantidad}
                        style={style.input}
                        placeholder="Monto"
                        onChangeText={(cantidad) => setState(prev => ({ ...prev, cantidad }))}
                        ref={campoMonto}
                    />
                ) : forma === "cantidad" && (
                    <TextInputMask
                        type={'only-numbers'}
                        options={{
                            precision: 0,
                            separator: ',',
                            delimiter: '.',
                            unit: '',
                            suffixUnit: ''
                        }}
                        style={style.input}
                        value={cantidad}
                        placeholder="Cantidad"
                        onChangeText={(cantidad) => setState(prev => ({ ...prev, cantidad }))}
                    />
                )}
                {showFrecuencia ? (
                    <TouchableOpacity
                        style={style.eliminarFrecuencia}
                        onPress={() => setState(prev => ({
                            ...prev,
                            showFrecuencia: false,
                            frecuencia: null,
                            diaSeleccionado1: null,
                            diaSeleccionado2: null,
                            franja: null
                        }))}
                    >
                        <FontAwesome name="minus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>Frecuencia pedido</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={style.nuevaFrecuencia}
                        onPress={() => setState(prev => ({ ...prev, showFrecuencia: true }))}
                    >
                        <FontAwesome name="plus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>Frecuencia pedido</Text>
                    </TouchableOpacity>
                )}

                {showFrecuencia && (
                    <View style={style.contenedorFrecuencia}>
                        <ModalSelector
                            style={style.btnFrecuencia}
                            data={frecuencias}
                            initValue="Frecuencia"
                            cancelText="Cancelar"
                            onChange={(option) => {
                                setState(prev => ({
                                    ...prev,
                                    frecuencia: option.key,
                                    diaSeleccionado1: null,
                                    diaSeleccionado2: null,
                                    franja: null
                                }));
                            }}
                            selectStyle={[style.modalSelectorStyle, !frecuencia && { borderColor: "rgba(255, 0, 0, 0.22)" }]}
                            selectTextStyle={style.modalSelectorText}
                            optionStyle={style.modalSelectorItem}
                            optionTextStyle={style.modalSelectorItemText}
                            listStyle={style.modalSelectorList}
                        />
                        {frecuencia ? (
                            frecuencia === "semanal" ? (
                                <ModalSelector
                                    style={style.btnFrecuencia}
                                    data={dias}
                                    initValue={"Dia"}
                                    cancelText="Cancelar"
                                    onChange={(option) => { setState(prev => ({ ...prev, diaSeleccionado1: option.key })) }}
                                    selectStyle={[style.modalSelectorStyle, !diaSeleccionado1 && { borderColor: "rgba(255, 0, 0, 0.22)" }]}
                                    selectTextStyle={style.modalSelectorText}
                                    optionStyle={style.modalSelectorItem}
                                    optionTextStyle={style.modalSelectorItemText}
                                    listStyle={style.modalSelectorList}
                                />
                            ) : frecuencia === "mensual" ? (
                                <ModalSelector
                                    style={style.btnFrecuencia}
                                    data={diasN}
                                    initValue={"Dia"}
                                    cancelText="Cancelar"
                                    onChange={(option) => { setState(prev => ({ ...prev, diaSeleccionado1: option.key })) }}
                                    selectStyle={[style.modalSelectorStyle, !diaSeleccionado1 && { borderColor: "rgba(255, 0, 0, 0.22)" }]}
                                    selectTextStyle={style.modalSelectorText}
                                    optionStyle={style.modalSelectorItem}
                                    optionTextStyle={style.modalSelectorItemText}
                                    listStyle={style.modalSelectorList}
                                />
                            ) : (
                                <View style={style.contenedorFrecuencia}>
                                    <ModalSelector
                                        style={style.btnFrecuencia}
                                        data={dia1}
                                        initValue={"Dia 1"}
                                        cancelText="Cancelar"
                                        onChange={(option) => { setState(prev => ({ ...prev, diaSeleccionado1: option.key })) }}
                                        selectStyle={[style.modalSelectorStyle, !diaSeleccionado1 && { borderColor: "rgba(255, 0, 0, 0.22)" }]}
                                        selectTextStyle={style.modalSelectorText}
                                        optionStyle={style.modalSelectorItem}
                                        optionTextStyle={style.modalSelectorItemText}
                                        listStyle={style.modalSelectorList}
                                    />
                                    <ModalSelector
                                        style={style.btnFrecuencia}
                                        data={dia2}
                                        initValue={"Dia 2"}
                                        cancelText="Cancelar"
                                        onChange={(option) => { setState(prev => ({ ...prev, diaSeleccionado2: option.key })) }}
                                        selectStyle={[style.modalSelectorStyle, !diaSeleccionado2 && { borderColor: "rgba(255, 0, 0, 0.22)" }]}
                                        selectTextStyle={style.modalSelectorText}
                                        optionStyle={style.modalSelectorItem}
                                        optionTextStyle={style.modalSelectorItemText}
                                        listStyle={style.modalSelectorList}
                                    />
                                </View>
                            )
                        ) : null}
                        {/* {
                            frecuencia
                            &&<ModalSelector
                                style={style.btnFrecuencia}
                                data={franjas}
                                initValue={"Franja Horaria"}
                                onChange={(option)=>{ setState(prev => ({ ...prev, franja: option.key })) }} 
                                selectStyle={!franja &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                            />
                        } */}
                    </View>
                )}
                {acceso !== "cliente" && renderCliente()}

                {/* Sección de puntos de entrega mejorada */}
                {puntos.length > 0 && (
                    <View style={style.puntosEntregaContainer}>
                        {puntos.length > 1 ? (
                            <>
                                <Text style={style.puntosEntregaTitle}>
                                    Selecciona el punto de entrega
                                </Text>
                                {puntos.map((e, key) => {
                                    const isSelected = puntoId === e._id;
                                    return (
                                        <TouchableOpacity
                                            key={key}
                                            style={[
                                                style.puntoEntregaCard,
                                                isSelected && style.puntoEntregaCardSelected
                                            ]}
                                            onPress={() => setState(prev => ({ ...prev, puntoId: e._id }))}
                                            activeOpacity={0.7}
                                        >
                                            <View style={style.puntoEntregaHeader}>
                                                <View style={[
                                                    style.puntoEntregaIcon,
                                                    isSelected && style.puntoEntregaIconSelected
                                                ]}>
                                                    <FontAwesome
                                                        name="map-marker"
                                                        style={style.puntoEntregaIconImage}
                                                    />
                                                </View>

                                                <View style={style.puntoEntregaInfo}>
                                                    <Text style={style.puntoEntregaDireccion}>
                                                        {e.direccion}
                                                    </Text>
                                                    <Text style={style.puntoEntregaCapacidad}>
                                                        🏭 Capacidad: {e.capacidad} kg
                                                    </Text>
                                                    {e.observacion && e.observacion.trim() !== "" && (
                                                        <Text style={style.puntoEntregaObservacion}>
                                                            💬 {e.observacion}
                                                        </Text>
                                                    )}
                                                </View>

                                                {isSelected && (
                                                    <View style={style.puntoEntregaCheckContainer}>
                                                        <FontAwesome
                                                            name="check-circle"
                                                            style={style.puntoEntregaCheckIcon}
                                                        />
                                                    </View>
                                                )}
                                            </View>

                                            {isSelected && (
                                                <View style={style.puntoEntregaBadge}>
                                                    <Text style={style.puntoEntregaBadgeText}>
                                                        SELECCIONADO
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    )
                                })}
                            </>
                        ) : (
                            // Punto único - diseño especial
                            puntos.map((e, key) => {
                                return (
                                    <View key={key} style={[
                                        style.puntoEntregaCard,
                                        style.puntoEntregaCardSingle
                                    ]}>
                                        <View style={style.puntoEntregaHeader}>
                                            <View style={[
                                                style.puntoEntregaIcon,
                                                style.puntoEntregaIconSelected
                                            ]}>
                                                <FontAwesome
                                                    name="map-marker"
                                                    style={style.puntoEntregaIconImage}
                                                />
                                            </View>

                                            <View style={style.puntoEntregaInfo}>
                                                <Text style={[
                                                    style.puntoEntregaDireccion,
                                                    { color: '#28a745' }
                                                ]}>
                                                    Punto de entrega único
                                                </Text>
                                                <Text style={style.puntoEntregaDireccion}>
                                                    {e.direccion}
                                                </Text>
                                                <Text style={style.puntoEntregaCapacidad}>
                                                    🏭 Capacidad: {e.capacidad} kg
                                                </Text>
                                                {e.observacion && e.observacion.trim() !== "" && (
                                                    <Text style={style.puntoEntregaObservacion}>
                                                        💬 {e.observacion}
                                                    </Text>
                                                )}
                                            </View>

                                            <View style={style.puntoEntregaCheckContainer}>
                                                <FontAwesome
                                                    name="check-circle"
                                                    style={style.puntoEntregaCheckIcon}
                                                />
                                            </View>
                                        </View>

                                        <View style={style.puntoEntregaBadge}>
                                            <Text style={style.puntoEntregaBadgeText}>
                                                PUNTO AUTOMÁTICO
                                            </Text>
                                        </View>
                                    </View>
                                )
                            })
                        )}
                    </View>
                )}
                {solicitud ? (
                    <TouchableOpacity
                        style={style.eliminarFrecuencia}
                        onPress={() => setState(prev => ({ ...prev, solicitud: null }))}
                    >
                        <FontAwesome name="minus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>{fechaSolicitud}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={style.nuevaFrecuencia}
                        onPress={() => {
                            setState(prev => ({ ...prev, showFechaEntrega: true }));
                        }}
                    >
                        <FontAwesome name="plus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>Fecha Entrega</Text>
                    </TouchableOpacity>
                )}

                <TextInput
                    placeholder="Observaciones"
                    onChangeText={(novedad) => setState(prev => ({ ...prev, novedad }))}
                    value={novedad}
                    multiline={true}
                    style={[style.inputNovedades]}
                />

                <TouchableOpacity
                    style={!forma ? style.btnGuardarDisable : style.btnGuardar}
                    onPress={() => {
                        // Solo validar cliente para usuarios que no son clientes
                        if ((acceso === "admin" || acceso === "solucion" || acceso === "veo" || acceso === "comercial" || acceso === "despacho") && !idCliente) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Selecciona un cliente' });
                        } else if ((acceso === "admin" || acceso === "solucion" || acceso === "veo" || acceso === "comercial" || acceso === "despacho") && !puntoId) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Selecciona una dirección' });
                        } else if (!forma) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Selecciona una forma' });
                        } else if (forma === "monto" && cantidad < 10) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Inserta una cantidad' });
                        } else if (forma === "cantidad" && cantidad < 10) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Inserta una cantidad' });
                        } else if ((frecuencia === "semanal" || frecuencia === "mensual") && !diaSeleccionado1) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Inserta un dia de frecuencia' });
                        } else if (frecuencia === "quincenal" && (!diaSeleccionado1 || !diaSeleccionado2)) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Inserta los dias de frecuencia' });
                        } else if (!fechaSolicitud) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Inserta una fecha de Entrega' });
                        } else if (!guardando) {
                            verificaPedido();
                        }
                    }}
                >
                    <FontAwesome name="caret-square-o-right" style={!forma ? style.iconGuardarDisable : style.iconGuardar} />
                    <Text style={!forma ? style.textGuardarDisable : style.textGuardar}>{!guardando ? "Enviar" : "Enviando..."}</Text>
                    {guardando && <ActivityIndicator color="#ffffff" />}
                </TouchableOpacity>
                <Toast />
            </View>
        )
    }
    const filtroClientes = ({ _id, email, nombre }) => {
        setState(prev => ({
            ...prev,
            cliente: nombre,
            idCliente: _id,
            emailCliente: email,
            showClientes: false
        }));
        getPuntos(_id);
    };
    const modalFechaEntrega = () => {
        const { modalFechaEntrega, fechaSolicitud } = state;

        // Validar que fechaSolicitud no esté vacía antes de formatear
        const fechaFormateada = fechaSolicitud ? moment(fechaSolicitud).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
        const diaActual = moment().format('YYYY-MM-DD');

        return (
            <Modal transparent visible={modalFechaEntrega} animationType="fade" >
                <TouchableOpacity activeOpacity={1} onPress={() => { setState(prev => ({ ...prev, showFechaEntrega: false })) }} >
                    <View style={style.contenedorModalCliente}>
                        <View style={style.subContenedorModalCliente}>
                            <TouchableOpacity activeOpacity={1} onPress={() => setState(prev => ({ ...prev, showFechaEntrega: false }))} style={style.btnModalClose}>
                                <FontAwesome name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <Text style={style.tituloModal}>Fecha entrega</Text>
                            <Calendar
                                style={style.calendar}
                                current={fechaFormateada}
                                minDate={diaActual}
                                firstDay={1}
                                onDayPress={(day) => {
                                    setState(prev => ({
                                        ...prev,
                                        solicitud: true,
                                        showFechaEntrega: false,
                                        fechaSolicitud: day.dateString
                                    }));
                                    Toast.show({
                                        type: 'info',
                                        text1: 'Esta fecha esta sujeta a verificación',
                                        text2: 'si nuestros vehiculos estan en la zona'
                                    });
                                }}
                                markedDates={fechaSolicitud ? { [fechaFormateada]: { selected: true, marked: true } } : {}}
                            />
                        </View>

                    </View>
                </TouchableOpacity>
            </Modal>
        )
    };

    //// verifica si se creo un pedido ese dia
    const verificaPedido = async () => {
        setState(prev => ({ ...prev, guardando: true }));
        const { idCliente, idUsuario, acceso, puntoId } = state;
        const id = acceso === "cliente" ? idUsuario : idCliente;
        console.log(id, puntoId);

        try {
            const response = await verificarPedidoHoy(id, puntoId);
            const { status, pedido } = response;
            console.log(status, pedido);
            if (status) {
                if (pedido > 0) {
                    Alert.alert(
                        `hay ${pedido} pedidos creados hoy para este cliente`,
                        `desea crearlo`,
                        [
                            { text: 'Confirmar', onPress: () => handleSubmit() },
                            { text: 'Cancelar', onPress: () => setState(prev => ({ ...prev, guardando: false })) },
                        ],
                        { cancelable: false },
                    );
                } else {
                    handleSubmit();
                }
            } else {
                response.message.path === "puntoId"
                    ? alert("Inserte un punto de entrega")
                    : alert("tenemos un problema intentalo nuevamente");
                setState(prev => ({ ...prev, guardando: false }));
            }
        } catch (error) {
            console.error('Error verificando pedido:', error);
            setState(prev => ({ ...prev, guardando: false }));
        }
    };
    const handleSubmit = async () => {
        const { forma, cantidad, idCliente, diaSeleccionado1, diaSeleccionado2, frecuencia, novedad: observacion, puntoId, fechaSolicitud, idUsuario } = state;

        const cantidadKl = forma === "cantidad" ? cantidad : 0;
        const cantidadPrecio = forma === "monto" ? campoMonto.current.getRawValue() : 0;

        const data = {
            forma,
            ...(diaSeleccionado1 !== undefined && { dia1: diaSeleccionado1 }),
            ...(diaSeleccionado2 !== undefined && { dia2: diaSeleccionado2 }),
            ...(frecuencia !== undefined && { frecuencia }),
            puntoId,
            fechaSolicitud,
            cantidadKl,
            cantidadPrecio,
            usuarioCrea: idUsuario,
            usuarioId: idCliente,
            observacion
        };

        try {
            const response = await crearPedido(data);
            Toast.show({
                type: 'success',
                text1: 'Pedido creado con exito',
            });
            setState(prev => ({
                ...prev,
                guardando: false,
                idCliente: null,
                forma: null,
                solicitud: false,
                puntos: []
            }));
        } catch (err) {
            console.error('Error creando pedido:', err);
            setState(prev => ({ ...prev, guardando: false }));
            alert("No pudimos procesar el pedido, intentelo mas tarde", JSON.stringify(err));
        }
    };

    const { showFechaEntrega } = state;

    return (
        <View style={style.container} >
            <Image source={require('../../assets/img/pg1/fondo1.jpg')} style={style.cabezera} />
            <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo2.jpg')} >
                {showFechaEntrega && modalFechaEntrega()}
                <KeyboardAwareScrollView style={style.containerNuevo}>
                    {renderPedido()}
                </KeyboardAwareScrollView>
                <Footer navigation={navigation} />
            </ImageBackground>
        </View>
    );
};

export default Nuevo_pedido;
