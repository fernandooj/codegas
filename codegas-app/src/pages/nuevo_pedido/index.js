import React, { useState, useEffect, useContext, useRef } from 'react'
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, ImageBackground, Image, Alert, ScrollView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Toast from 'react-native-toast-message';
import axios from 'axios'
import moment from 'moment'
import ModalSelector from 'react-native-modal-selector'
import { Calendar } from 'react-native-calendars';
import { TextInputMask } from 'react-native-masked-text'

import { connect } from "react-redux";
import { DataContext } from "../../context/context"
import { getUsuariosAcceso } from '../../redux/actions/usuarioActions'
import Footer from '../components/footer'
import { style } from './style'

import { frecuencias, dias, diasN, dia1, dia2 } from '../../utils/pedido_info'

const Nuevo_pedido = ({ navigation, getUsuariosAcceso }) => {
    const context = useContext(DataContext);
    const campoMonto = useRef(null);

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
        const initializeComponent = async () => {
            try {
                const res = await axios.get(`users/by/adminsolucion`);
                if (res.data.status) {
                    setState(prev => ({ ...prev, usuarios: res.data.usuarios }));
                }
            } catch (error) {
                console.error('Error fetching usuarios:', error);
            }

            const { acceso, userId: idUsuario, email, nombre } = context;

            if (!nombre && idUsuario) {
                navigation.navigate("verPerfil", { tipoAcceso: null });
            }

            setState(prev => ({ ...prev, idUsuario, acceso, email, nombre }));

            if (acceso === 'cliente') {
                getPuntos(idUsuario);
            }
        };

        initializeComponent();
    }, [context, navigation]);

    const getPuntos = (id) => {
        axios.get(`pun/punto/byCliente/${id}`)
            .then(e => {
                if (e.data.status) {
                    if (e.data.puntos.length === 1) {
                        setState(prev => ({
                            ...prev,
                            puntos: e.data.puntos,
                            puntoId: e.data.puntos[0]._id
                        }));
                    } else {
                        setState(prev => ({ ...prev, puntos: e.data.puntos }));
                    }
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Tuvimos un problema',
                        text2: 'intentele mas tarde'
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching puntos:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error al cargar puntos',
                    text2: 'Intente más tarde'
                });
            });
    };

    const getClientes = () => {
        const { terminoBuscador } = state;
        axios.get(`users/acceso/10/0/clientes/${terminoBuscador}`)
            .then(res => {
                if (res.data.status) {
                    setState(prev => ({ ...prev, clientes: res.data.user }));
                }
            })
            .catch(error => {
                console.error('Error fetching clientes:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error al cargar clientes',
                    text2: 'Intente más tarde'
                });
            });
    };
    const renderUsuarios = () => {
        const { clientes } = state;
        return clientes.map((e, key) => {
            return (
                <View style={[style.contenedorUsers, { backgroundColor: e.activo ? "white" : "red" }]} key={key}>
                    <TouchableOpacity
                        style={{ flexDirection: "row" }}
                        onPress={() => filtroClientes(e)}
                        disabled={!e.activo} // Deshabilitar si no está activo
                    >
                        <View style={{ width: "90%" }}>
                            {e.acceso === "cliente" && (
                                <Text style={[style.textUsers, !e.activo && { color: 'white' }]}>
                                    {e.idPadre ? "Punto consumo: " + e.idPadre.razon_social : e.razon_social}
                                </Text>
                            )}
                            <Text style={[style.textUsers, !e.activo && { color: 'white' }]}>{e.nombre}</Text>
                            <Text style={[style.textUsers, !e.activo && { color: 'white' }]}>{e.codt}</Text>
                        </View>
                        <View style={{ justifyContent: "center" }}>
                            <FontAwesome name={'angle-right'} style={style.iconCerrar} />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        })
    };
    const renderCliente = () => {
        const { idCliente, cliente } = state;
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
        return (
            <Modal transparent visible={true} animationType="fade" >
                <TouchableOpacity activeOpacity={1} >
                    <View style={style.contenedorModalCliente}>
                        <View style={style.subContenedorModalCliente}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => setState(prev => ({
                                    ...prev,
                                    showClientes: false,
                                    terminoBuscador: '',
                                    clientes: []
                                }))}
                                style={style.btnModalClose}
                            >
                                <FontAwesome name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row" }}>
                                <TextInput
                                    placeholder="Buscar cliente"
                                    value={terminoBuscador}
                                    style={style.inputStep2}
                                    onChangeText={(terminoBuscador) => setState(prev => ({ ...prev, terminoBuscador }))}
                                />
                                <TouchableOpacity
                                    style={style.buscarCliente}
                                    onPress={() => {
                                        if (terminoBuscador.length > 1) {
                                            getClientes();
                                            setState(prev => ({ ...prev, showRenderUsuarios: true }));
                                        } else {
                                            alert("Inserte un valor");
                                        }
                                    }}
                                >
                                    <FontAwesome name='search' style={style.iconSearch} />
                                </TouchableOpacity>
                            </View>
                            {showRenderUsuarios && (
                                <ScrollView>
                                    {renderUsuarios()}
                                </ScrollView>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
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
                {puntos.length > 1 ? (
                    <View>
                        <Text>Selecciona el punto de entrega</Text>
                        {puntos.map((e, key) => {
                            return (
                                <TouchableOpacity
                                    key={key}
                                    style={style.btnZona}
                                    onPress={() => setState(prev => ({ ...prev, puntoId: e._id }))}
                                >
                                    <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon} resizeMode={'contain'} />
                                    <View>
                                        <Text style={style.textZona}>{e.direccion}</Text>
                                        <Text style={style.textZona}>Capacidad: {e.capacidad}</Text>
                                        {e.observacion && (
                                            <Text style={style.textZona}>
                                                Observacion: {e.observacion === "" ? "&nbsp;" : e.observacion}
                                            </Text>
                                        )}
                                    </View>
                                    {(puntoId === e._id) && <FontAwesome name="check" style={style.iconCheck} />}
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                ) : (
                    puntos.map((e, key) => {
                        return (
                            <View key={key} style={style.btnZona} >
                                <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon} resizeMode={'contain'} />
                                <View>
                                    <Text style={style.textZona}>Punto de entrega</Text>
                                    <Text style={style.textZona}>{e.direccion}</Text>
                                    <Text style={style.textZona}>Capacidad: {e.capacidad}</Text>
                                    {e.observacion && e.observacion.length !== 0 ? (
                                        <Text style={style.textZona}>
                                            Observacion: {e.observacion === "" ? "&nbsp;" : e.observacion}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        )
                    })
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
        const fechaFormateada = moment(fechaSolicitud).format("YYYY-MM-DD");
        const diaActual = moment().add(0, 'days').format('YYYY-MM-DD');

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
                                //minDate={diaActual}
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
                                markedDates={{ [fechaFormateada]: { selected: true, marked: true } }}
                            />
                        </View>

                    </View>
                </TouchableOpacity>
            </Modal>
        )
    };

    //// verifica si se creo un pedido ese dia
    const verificaPedido = () => {
        setState(prev => ({ ...prev, guardando: true }));
        const { idCliente, idUsuario, acceso, puntoId } = state;
        const id = acceso === "cliente" ? idUsuario : idCliente;
        console.log(id, puntoId);

        axios.get(`ped/pedido/today/${id}/${puntoId}`)
            .then(res => {
                const { status, pedido } = res.data;
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
                    res.data.message.path === "puntoId"
                        ? alert("Inserte un punto de entrega")
                        : alert("tenemos un problema intentalo nuevamente");
                    setState(prev => ({ ...prev, guardando: false }));
                }
            })
            .catch(error => {
                console.error('Error verificando pedido:', error);
                setState(prev => ({ ...prev, guardando: false }));
            });
    };
    const handleSubmit = () => {
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

        axios({
            method: 'post',
            url: 'ped/pedido',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(e => {
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
            })
            .catch(err => {
                console.error('Error creando pedido:', err);
                setState(prev => ({ ...prev, guardando: false }));
                alert("No pudimos procesar el pedido, intentelo mas tarde", JSON.stringify(err));
            });
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

const mapState = state => {
    return {

    };
};

const mapDispatch = dispatch => {
    return {
        getUsuariosAcceso: (acceso) => {
            dispatch(getUsuariosAcceso(10, 0, acceso));
        },
    };
};



export default connect(
    mapState,
    mapDispatch
)(Nuevo_pedido);
