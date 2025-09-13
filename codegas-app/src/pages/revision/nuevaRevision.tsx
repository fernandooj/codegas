import React, { useState, useEffect, useContext, useCallback } from 'react'
import { View, Text, TouchableOpacity, Switch, TextInput, Platform, Image, Dimensions, Alert, ActivityIndicator } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message';
import ModalFilterPicker from 'react-native-modal-filter-picker'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import TomarFoto from "../components/tomarFoto";
import SubirDocumento from "../components/subirDocumento";
import { useSelector, useDispatch } from "react-redux";
import { getUsuariosAcceso, getUsuarios, getUserById } from '../../redux/actions/usuarioActions'
import { getVehiculos } from '../../redux/actions/vehiculoActions'
import { getTanques } from '../../redux/actions/tanqueActions'
import {
    getTanquesByPunto,
    getPuntoById,
    getRevisionById,
    addUserToTanque,
    sendNotificationDesvincularUsuario,
    getDepartamentos,
    getCiudades,
    getPoblados,
    sendSolicitudServicio,
    createRevision,
    updateRevision,
    updateRevisionInstalacion,
    updateRevisionCoordenadas,
    addImagesToRevision
} from '../../redux/actions/revisionActions'
import Footer from '../components/footer'
import { style } from './style'
import { DataContext } from "../../context/context"
import { images, sectores, ubicaciones, propiedades, m3s } from '../../utils/constants'

const NuevaRevision = ({ navigation, route }: any) => {
    const { acceso: accesoPerfil, userId: idUsuario } = useContext(DataContext) as any;
    const dispatch = useDispatch();
    const tanques = useSelector((state: any) => state.tanque.tanques || []);
    const conductores = useSelector((state: any) => state.usuario.usuariosAcceso || []);
    const vehiculos = useSelector((state: any) => state.vehiculo.vehiculos || []);

    const [state, setState] = useState({
        modalCliente: false,
        modalSectores: false,
        modalZona: false,
        modalDpto: false,
        modalCiudad: false,
        modalPoblado: false,
        modalPropiedad: false,
        modalUbicacion: false,
        modalM3: false,
        modalPlacas: false,
        modalCapacidad: false,
        modalAlerta: false,
        extintores: false,
        avisos: false,
        distancias: false,
        electricas: false,
        accesorios: false,
        clientes: [],
        puntos: [],
        placas: [],
        imgIsometrico: [],
        imgOtrosComodato: [],
        imgSoporteEntrega: [],
        imgAlerta: [],
        imgDepTecnico: [],
        imgNMedidor: [],
        imgNComodato: [],
        otrosComodato: [],
        imgOtrosSi: [],
        soporteEntrega: [],
        imgPuntoConsumo: [],
        imgProtocoloLlenado: [],
        imgHojaSeguridad: [],
        imgVisual: [],
        tanqueArray: [],
        tanqueIdArray: [],
        dptos: [{ key: "", label: "" }],
        ciudades: [{ key: "", label: "" }],
        poblados: [{ key: "", label: "" }],
        lat: 4.597825,
        lng: -74.0755723,
        revisionId: null,
        puntoId: null,
        usuarioId: null,
        accesoPerfil,
        idUsuario,
        loading: false,
        // Additional properties
        nControl: "",
        capacidad: "",
        fabricante: "",
        barrio: "",
        sector: "",
        m3: "",
        usuariosAtendidos: "",
        propiedad: "",
        nMedidorText: "",
        ubicacion: "",
        nComodatoText: "",
        cedulaCliente: "",
        codtCliente: "",
        razon_socialCliente: "",
        direccion_facturaCliente: "",
        nombreCliente: "",
        celularCliente: "",
        emailCliente: "",
        direccion: "",
        observacion: "",
        zonaId: "",
        observaciones: "",
        estado: "",
        solicitudServicio: "",
        alertaText: "",
        alertaFecha: "",
        nActa: "",
        depTecnicoText: "",
        depTecnicoEstado: "",
        poblado: "",
        ciudad: "",
        dpto: "",
        cliente: "",
        idCliente: "",
        placaText: "",
        tanques: []
    });

    const updateState = useCallback((updates: any) => {
        setState(prevState => ({ ...prevState, ...updates }));
    }, []);

    useEffect(() => {
        dispatch(getTanques(0, 10, undefined) as any);

        const params = route?.params || navigation?.state?.params || {};
        const { revisionId, puntoId, clienteId } = params;
        updateState({ revisionId, puntoId, usuarioId: clienteId });

        if (clienteId) {
            filtroClientes(clienteId);
        }

        if (puntoId) {
            getTanquesByPunto(puntoId)
                .then(res => {
                    const tanqueIdArray = res.tanque.map((e: any) => e._id);
                    updateState({ tanqueArray: res.tanque, tanqueIdArray });
                })
                .catch(error => {
                    console.error('Error getting tanques by punto:', error);
                });

            getPuntoById(puntoId)
                .then(res => {
                    const { capacidad, direccion, observacion } = res.punto;
                    updateState({ capacidad, direccion, observacion });
                })
                .catch(error => {
                    console.error('Error getting punto by id:', error);
                });
        }

        buscarRevision();
        buscarDepto();
    }, []);

    useEffect(() => {
        if (tanques.length > 0) {
            let placas = tanques.map((e: any) => {
                return {
                    key: e._id,
                    label: e.placaText
                }
            })
            updateState({ placas });
        }
    }, [tanques]);

    const buscarRevision = useCallback(() => {
        const params = route?.params || navigation?.state?.params || {};
        let revisionId = params.revisionId || state.revisionId;

        if (revisionId) {
            getRevisionById(revisionId)
                .then(res => {
                    const { revision } = res

                    let tanqueIdArray: string[] = []
                    revision.tanqueid.map((e: any) => {
                        tanqueIdArray.push(e._id)
                    })

                    updateState({
                        revisionId: revision._id,
                        poblado: revision.poblado,
                        tanqueArray: revision.tanqueid,
                        tanqueIdArray,
                        nControl: revision.nControl ? revision.nControl : "",
                        capacidad: revision.capacidad ? revision.capacidad : "",
                        fabricante: revision.fabricante ? revision.fabricante : "",
                        barrio: revision.barrio ? revision.barrio : "",
                        sector: revision.sector ? revision.sector : "",
                        m3: revision.m3 ? revision.m3 : "",
                        usuariosAtendidos: revision.usuariosAtendidos ? revision.usuariosAtendidos : "",
                        propiedad: revision.propiedad ? revision.propiedad : "",
                        nMedidorText: revision.nMedidorText ? revision.nMedidorText : "",
                        ubicacion: revision.ubicacion ? revision.ubicacion : "",
                        nComodatoText: revision.nComodatoText ? revision.nComodatoText : "",
                        usuarioId: revision._id,
                        cedulaCliente: revision.razon_social,
                        codtCliente: revision.codt,
                        razon_socialCliente: revision.cedula,
                        direccion_facturaCliente: revision.direccion_factura,
                        nombreCliente: revision.nombre,
                        celularCliente: revision.celular,
                        emailCliente: revision.email,
                        puntos: revision.puntoId ? [revision.puntoId] : [],
                        direccion: revision.puntoId ? revision.puntoId.direccion : null,
                        puntoId: revision.puntoId ? revision.puntoId._id : null,
                        zonaId: revision.zonaId ? revision.zonaId._id : null,
                        observaciones: revision.observaciones ? revision.observaciones : "",
                        estado: revision.estado ? revision.estado : "",
                        solicitudServicio: revision.solicitudServicio ? revision.solicitudServicio : "",
                        imgAlerta: revision.alerta ? revision.alerta : [],
                        alertaText: revision.alertaText ? revision.alertaText : "",
                        alertaFecha: revision.alertaFecha ? revision.alertaFecha : "",
                        nActa: revision.nActa ? revision.nActa : "",
                        avisos: revision.avisos ? revision.avisos : false,
                        extintores: revision.extintores ? revision.extintores : false,
                        distancias: revision.distancias ? revision.distancias : false,
                        electricas: revision.electricas ? revision.electricas : false,
                        accesorios: revision.accesorios ? revision.accesorios : false,
                        imgDepTecnico: revision.depTecnico ? revision.depTecnico : [],
                        depTecnicoText: revision.depTecnicoText ? revision.depTecnicoText : "",
                        depTecnicoEstado: revision.depTecnicoEstado ? revision.depTecnicoEstado : "",
                        imgSoporteEntrega: revision.soporteentrega ? revision.soporteentrega : [],
                        imgPuntoConsumo: revision.puntoconsumo ? revision.puntoconsumo : [],
                        imgVisual: revision.visual ? revision.visual : [],
                        imgNComodato: revision.nCcmodato ? revision.ncomodato : [],
                        imgIsometrico: revision.isometrico ? revision.isometrico : [],
                        imgOtrosComodato: revision.otroscomodato ? revision.otroscomodato : [],
                        imgProtocoloLlenado: revision.protocolollenado ? revision.protocolollenado : [],
                        imgHojaSeguridad: revision.hojaseguridad ? revision.hojaseguridad : [],
                        imgOtrosSi: revision.otrossi ? revision.otrossi : [],
                    })

                    Geolocation.getCurrentPosition(e => {
                        let lat = parseFloat(e.coords.latitude.toString())
                        let lng = parseFloat(e.coords.longitude.toString())
                        lat = revision.coordenadas ? revision.coordenadas.coordinates[1] : lat;
                        lng = revision.coordenadas ? revision.coordenadas.coordinates[0] : lng;
                        updateState({ lat, lng })
                    }, (error) => Geolocation.watchPosition(e => {
                        let lat = parseFloat(e.coords.latitude.toString())
                        let lng = parseFloat(e.coords.longitude.toString())
                        lat = revision.coordenadas ? revision.coordenadas.coordinates[1] : lat;
                        lng = revision.coordenadas ? revision.coordenadas.coordinates[0] : lng;
                        updateState({ lat, lng })
                    },
                        (error) => console.log('error'),
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 })
                    )
                })
                .catch(error => {
                    console.error('Error getting revision by id:', error);
                })
        }
    }, [state.revisionId, route?.params, navigation?.state?.params, updateState]);

    const filtroClientes = useCallback((idCliente: any) => {
        // Usar getUserById para obtener el usuario específico
        getUserById(idCliente)
            .then((res: any) => {
                if (res && res.user) {
                    const user = res.user;
                    const cliente = {
                        key: user._id,
                        label: user.cedula ? user.razon_social + " | " + user.cedula + " | " + user.codt : user.razon_social,
                        email: user.email,
                        direccion_factura: user.direccion_factura,
                        nombre: user.nombre,
                        razon_social: user.razon_social,
                        cedula: user.cedula,
                        celular: user.celular,
                        codt: user.codt
                    };

                    updateState({
                        cliente: cliente.label,
                        idCliente,
                        cedulaCliente: cliente.cedula,
                        codtCliente: cliente.codt,
                        emailCliente: cliente.email,
                        razon_socialCliente: cliente.razon_social,
                        direccion_facturaCliente: cliente.direccion_factura,
                        celularCliente: cliente.celular,
                        nombreCliente: cliente.nombre,
                        modalCliente: false
                    });
                }
            })
            .catch((error: any) => {
                console.error('Error getting usuario by id:', error);
            })
    }, [updateState]);

    const buscarTanque = useCallback((id: any) => {
        const { tanqueArray, tanqueIdArray, usuarioId, puntoId } = state
        const tanque = tanques.filter(({ _id }: any) => {
            return _id === id.key
        })
        if ((tanqueIdArray as any[]).includes(tanque[0]._id)) {
            Alert.alert("Error", "Este tanque ya esta agregado")
        } else {
            Alert.alert(
                `Asignar tanque`,
                `Seguro desea agregar este tanque a este usuario?`,
                [
                    { text: 'Confirmar', onPress: () => confirmar() },
                    { text: 'Cancelar', onPress: () => console.log("e") },
                ],
                { cancelable: false },
            )
            const confirmar = () => {
                const data = {
                    tanqueId: id.key,
                    usuarioId: usuarioId,
                    puntoId: puntoId
                };

                addUserToTanque(data)
                    .then((e: any) => {
                        if (e.status) {
                            const newTanqueArray = [...tanqueArray, tanque[0]]
                            const newTanqueIdArray = [...tanqueIdArray, tanque[0]._id]
                            updateState({ tanqueArray: newTanqueArray, tanqueIdArray: newTanqueIdArray, modalPlacas: false })
                        }
                    })
                    .catch(error => {
                        console.error('Error adding user to tanque:', error);
                    })
            }
        }
    }, [state.tanqueArray, state.tanqueIdArray, state.usuarioId, state.puntoId, tanques, updateState]);

    const alertaEliminarTanque = useCallback((placaText: any, codt: any, razon_social: any) => {
        Alert.alert(
            `Vas a enviar una notificacion, para eliminar este tanque a este usuario`,
            `${placaText}`,
            [
                { text: 'Confirmar', onPress: () => confirmar() },
                { text: 'Cancelar', onPress: () => console.log("e") },
            ],
            { cancelable: false },
        )
        const confirmar = () => {
            sendNotificationDesvincularUsuario(placaText, codt, razon_social)
                .then((res: any) => {
                    console.log(res)
                    if (res.status) {
                        Alert.alert("Éxito", "Notificacion enviada")
                    }
                })
                .catch(error => {
                    console.error('Error sending notification:', error);
                })
        }
    }, []);

    const buscarDepto = useCallback(() => {
        getDepartamentos()
            .then((res: any) => {
                let dptos = res
                dptos = dptos.map((e: any) => {
                    return {
                        key: e.name,
                        label: e.name
                    }
                })
                updateState({ dptos })
            })
            .catch(error => {
                console.error('Error getting departamentos:', error);
            })
    }, [updateState]);

    const buscarCiudad = useCallback((ciudad: any) => {
        getCiudades()
            .then((res: any) => {
                let ciudades = res
                ciudades = ciudades.filter((e: any) => {
                    return ciudad === e.dpto
                })
                ciudades = ciudades.map((e: any) => {
                    return {
                        key: e.ciudad,
                        label: e.ciudad
                    }
                })
                updateState({ dpto: ciudad, ciudades, modalDpto: false })
            })
            .catch(error => {
                console.error('Error getting ciudades:', error);
            })
    }, [updateState]);

    const buscarPoblado = useCallback((ciudad: any) => {
        getPoblados()
            .then((res: any) => {
                let poblados = res
                poblados = poblados.filter((e: any) => {
                    return ciudad === e.ciudad
                })
                poblados = poblados.map((e: any) => {
                    return {
                        key: e.codigo,
                        label: e.poblado
                    }
                })
                updateState({ ciudad: ciudad, poblados, modalCiudad: false })
            })
            .catch(error => {
                console.error('Error getting poblados:', error);
            })
    }, [updateState]);

    const solicitudServicio = useCallback(() => {
        const { solicitudServicio, revisionId, nControl, codtCliente, direccion, razon_socialCliente } = state
        sendSolicitudServicio(revisionId, { solicitudServicio, nControl, codtCliente, direccion, razon_socialCliente })
            .then((res: any) => {
                if (res.status) {
                    Toast.show({ type: 'success', text1: 'Solicitud enviada' })
                    updateState({ modalAlerta: false, solicitudServicio: "" })
                } else {
                    Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' })
                }
            })
            .catch(error => {
                console.error('Error sending solicitud servicio:', error);
                Toast.show({ type: 'error', text1: 'Error al enviar solicitud' })
            })
    }, [state.solicitudServicio, state.revisionId, state.nControl, state.codtCliente, state.direccion, state.razon_socialCliente, updateState]);

    const uploadImagen = useCallback((imagen: any, type: any, mime: any) => {
        updateState({ loading: true })
        const { revisionId } = state

        const data = {
            mime,
            imagen: imagen.imagen,
            revisionId,
            type,
            name: imagen.name
        }
        console.log(data)
        addImagesToRevision(data)
            .then((res: any) => {
                if (res.status) {
                    buscarRevision()
                    updateState({ loading: false })
                    Toast.show({ type: 'success', text1: 'Imagen Subida' })
                } else {
                    Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' })
                }
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                updateState({ loading: false })
                Toast.show({ type: 'error', text1: 'Error al subir imagen' })
            })
    }, [state.revisionId, buscarRevision, updateState]);

    const crearStep1 = useCallback(() => {
        const { tanqueIdArray, tanqueArray, idUsuario, usuarioId, puntoId } = state

        createRevision({ tanqueId: tanqueIdArray, usuarioId, puntoId, usuarioCrea: idUsuario })
            .then((res: any) => {
                if (res.status) {
                    updateState({ revisionId: res.revision._id, nControl: res.revision.nControl })
                    let totalCapacidad: any[] = []
                    tanqueArray.map((e: any) => {
                        e.capacidad = e.capacidad.replace(/^\D+/g, '');
                        e.capacidad = parseInt(e.capacidad)
                        totalCapacidad.push(e.capacidad)
                    })
                    totalCapacidad = totalCapacidad.reduce((a, b) => a + b)

                    updateState({ capacidad: totalCapacidad })
                } else {
                    Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' })
                }
            })
            .catch(error => {
                console.error('Error creating revision:', error);
                Toast.show({ type: 'error', text1: 'Error al crear revisión' })
            })
    }, [state.tanqueIdArray, state.tanqueArray, state.idUsuario, state.usuarioId, state.puntoId, updateState]);

    const editarStep1 = useCallback(() => {
        const { sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, zonaId, usuarioId, puntoId, nComodatoText, nMedidorText, ubicacion, tanqueArray } = state
        updateRevision(revisionId, { tanqueId: tanqueIdArray, sector, barrio, usuariosAtendidos, m3, zonaId, usuarioId, puntoId, nComodatoText, nMedidorText, ubicacion })
            .then((res: any) => {
                if (res.status) {
                    let totalCapacidad: any[] = []
                    tanqueArray.map((e: any) => {
                        e.capacidad = e.capacidad.replace(/^\D+/g, '');
                        e.capacidad = parseInt(e.capacidad)
                        totalCapacidad.push(e.capacidad)
                    })
                    totalCapacidad = totalCapacidad.reduce((a, b) => a + b)

                    updateState({ capacidad: totalCapacidad })
                } else {
                    Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' })
                }
            })
            .catch(error => {
                console.error('Error updating revision step 1:', error);
                Toast.show({ type: 'error', text1: 'Error al actualizar revisión' })
            })
    }, [state.sector, state.barrio, state.usuariosAtendidos, state.m3, state.revisionId, state.tanqueIdArray, state.zonaId, state.usuarioId, state.puntoId, state.nComodatoText, state.nMedidorText, state.ubicacion, state.tanqueArray, updateState]);

    const editarStep2 = useCallback(() => {
        const { zonaId, usuarioId, puntoId, sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, nComodatoText, nMedidorText, ubicacion, capacidad } = state

        updateRevision(revisionId, { sector, barrio, usuariosAtendidos, m3, tanqueId: tanqueIdArray, zonaId, usuarioId, puntoId, nComodatoText, nMedidorText, ubicacion })
            .then((res: any) => {
                if (res.status) {
                    // Handle success
                } else {
                    Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' })
                }
            })
            .catch(error => {
                console.error('Error updating revision step 2:', error);
                Toast.show({ type: 'error', text1: 'Error al actualizar revisión' })
            })
    }, [state.zonaId, state.usuarioId, state.puntoId, state.sector, state.barrio, state.usuariosAtendidos, state.m3, state.revisionId, state.tanqueIdArray, state.nComodatoText, state.nMedidorText, state.ubicacion, state.capacidad, updateState]);

    const editarStep3 = useCallback(() => {
        const { observaciones, avisos, extintores, distancias, electricas, accesorios, revisionId } = state
        let data = new FormData();

        data.append('observaciones', observaciones);
        data.append('avisos', avisos);
        data.append('extintores', extintores);
        data.append('distancias', distancias);
        data.append('electricas', electricas);
        data.append('accesorios', accesorios);

        updateRevisionInstalacion(revisionId, data)
            .then((res: any) => {
                // Handle success
            })
            .catch(err => {
                console.log({ err })
                updateState({ cargando: false })
            })
    }, [state.observaciones, state.avisos, state.extintores, state.distancias, state.electricas, state.accesorios, state.revisionId, updateState]);

    const editarStep5 = useCallback(() => {
        let { lat, lng, revisionId, poblado, ciudad, dpto } = state
        lat = lat ? lat : 4.597825;
        lng = lng ? lng : -74.0755723;
        console.log({ lat, lng, poblado, ciudad, dpto })

        updateRevisionCoordenadas(revisionId, { lat, lng, poblado, ciudad, dpto })
            .then((res: any) => {
                console.log(res)
                if (res.status) {
                    Alert.alert("Éxito", "Revisión Guardada")
                    // navigation.navigate("Home")
                } else {
                    Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' })
                }
            })
            .catch(error => {
                console.error('Error updating revision coordinates:', error);
                Toast.show({ type: 'error', text1: 'Error al guardar revisión' })
            })
    }, [state.lat, state.lng, state.revisionId, state.poblado, state.ciudad, state.dpto, updateState]);

    const step1 = useCallback(() => {
        const { tanqueIdArray, tanqueArray, modalPlacas, placas, placaText, puntoId, usuarioId } = state

        return (
            <View>
                {/* PLACAS */}
                <ModalFilterPicker
                    placeholderText="Placas ..."
                    visible={modalPlacas}
                    onSelect={(e: any) => buscarTanque(e)}
                    onCancel={() => updateState({ modalPlacas: false })}
                    crearTanque={(e: any) => {
                        navigation.navigate("nuevoTanque", { placaText: e, puntoId, usuarioId });
                        updateState({ modalPlacas: false })
                    }}
                    options={placas}
                    revision
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Placa</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalPlacas: true })}>
                        <Text style={placaText ? style.textBtnActive : style.textBtn}>{placaText ? placaText : "Placas"}</Text>
                    </TouchableOpacity>
                </View>

                {
                    tanqueArray.map((e: any, key: number) => {
                        return (
                            <View style={style.contenedorUsuario} key={key}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <TouchableOpacity style={{ width: "90%", alignItems: "center" }} onPress={() => navigation.navigate("nuevoTanque", { tanqueId: e._id })}>
                                        <View style={style.subContenedorUsuario}>
                                            <Text style={style.row1}>Placa:</Text>
                                            <Text style={style.row2}>{e.placaText}</Text>
                                        </View>
                                        <View style={style.subContenedorUsuario}>
                                            <Text style={style.row1}>Capacidad:</Text>
                                            <Text style={style.row2}>{e.capacidad}</Text>
                                        </View>
                                        <View style={style.subContenedorUsuario}>
                                            <Text style={style.row1}>Propiedad:</Text>
                                            <Text style={style.row2}>{e.propiedad}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => e.usuarioId ? alertaEliminarTanque(e.placaText, e.usuarioId.codt, e.usuarioId.razon_social) : null}>
                                        <FontAwesome name="trash" style={style.iconTrash} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }, [state.tanqueIdArray, state.tanqueArray, state.modalPlacas, state.placas, state.placaText, state.puntoId, state.usuarioId, buscarTanque, alertaEliminarTanque, updateState, navigation]);

    const step2 = useCallback(() => {
        const { modalSectores, sector, barrio, usuariosAtendidos, modalM3, m3, usuarioId, modalCliente, clientes, codtCliente, cedulaCliente, razon_socialCliente, celularCliente, emailCliente, nombreCliente, direccion_facturaCliente, puntos, puntoId, modalPropiedad, propiedad, nComodatoText, nMedidorText, ubicacion, modalUbicacion, capacidad, direccion, observacion } = state

        return (
            <View>
                {/* SECTORES */}
                <ModalFilterPicker
                    placeholderText="Sectores ..."
                    visible={modalSectores}
                    onSelect={(e: any) => updateState({ sector: e.key, modalSectores: false })}
                    onCancel={() => updateState({ modalSectores: false })}
                    options={sectores}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Sector</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalSectores: true })}>
                        <Text style={sector ? style.textBtnActive : style.textBtn}>{sector ? sector : "Sector"}</Text>
                    </TouchableOpacity>
                </View>

                {/* BARRIO */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Barrio</Text>
                    <TextInput
                        placeholder="Barrio"
                        value={barrio}
                        style={style.inputStep2}
                        onChangeText={(barrio: string) => updateState({ barrio })}
                    />
                </View>

                {/* USUARIOS ATENDIDOS */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Usuarios Atendidos</Text>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="Usuarios Atendidos"
                        style={style.inputStep2}
                        value={usuariosAtendidos}
                        onChangeText={(usuariosAtendidos: string) => updateState({ usuariosAtendidos })}
                    />
                </View>

                {/* M3 */}
                <ModalFilterPicker
                    placeholderText="M3 ..."
                    visible={modalM3}
                    onSelect={(e: any) => updateState({ m3: e.key, modalM3: false })}
                    onCancel={() => updateState({ modalM3: false })}
                    options={m3s}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>M3</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalM3: true })}>
                        <Text style={m3 ? style.textBtnActive : style.textBtn}>{m3 ? m3 : "M3"}</Text>
                    </TouchableOpacity>
                </View>

                {/* NO MEDIDOR TEXTO */}
                {
                    m3 == "Si"
                    && <View style={style.contenedorSetp2}>
                        <Text style={style.row1Step2}>N° Medidor</Text>
                        <TextInput
                            placeholder="N° Medidor"
                            value={nMedidorText}
                            style={style.inputStep2}
                            onChangeText={(nMedidorText: string) => updateState({ nMedidorText })}
                        />
                    </View>
                }

                {/* UBICACIONES */}
                <ModalFilterPicker
                    placeholderText="ubicaciones ..."
                    visible={modalUbicacion}
                    onSelect={(e: any) => updateState({ ubicacion: e.key, modalUbicacion: false })}
                    onCancel={() => updateState({ modalUbicacion: false })}
                    options={ubicaciones}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Ubicación</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalUbicacion: true })}>
                        <Text style={ubicacion ? style.textBtnActive : style.textBtn}>{ubicacion ? ubicacion : "Ubicación"}</Text>
                    </TouchableOpacity>
                </View>

                {/* NUMERO DE COMODATO */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>N Comodato</Text>
                    <TextInput
                        placeholder="N Comodato"
                        value={nComodatoText}
                        style={style.inputStep2}
                        onChangeText={(nComodatoText: string) => updateState({ nComodatoText })}
                    />
                </View>

                {/* USUARIO */}
                <ModalFilterPicker
                    placeholderText="Filtrar ..."
                    visible={modalCliente}
                    onSelect={(e: any) => filtroClientes(e)}
                    onCancel={() => updateState({ modalCliente: false })}
                    options={clientes}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />

                {
                    usuarioId
                    && <View style={style.contenedorUsuario}>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Identificación:</Text>
                            <Text style={style.row2}>{cedulaCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>CODT:</Text>
                            <Text style={style.row2}>{codtCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Razón Social:</Text>
                            <Text style={style.row2}>{razon_socialCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Dirección:</Text>
                            <Text style={style.row2}>{direccion_facturaCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Nombre:</Text>
                            <Text style={style.row2}>{nombreCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Celular:</Text>
                            <Text style={style.row2}>{celularCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Email:</Text>
                            <Text style={style.row2}>{emailCliente}</Text>
                        </View>
                    </View>
                }
                <View style={style.btnZonaActiva} >
                    <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon} resizeMode={'contain'} />
                    <View>
                        <Text style={style.textZona}>{direccion}</Text>
                        <Text style={style.textZona}>Almacenamiento: {capacidad}</Text>
                        <Text style={style.textZona}>Observacion: {observacion}</Text>
                    </View>
                </View>
            </View>
        )
    }, [state.modalSectores, state.sector, state.barrio, state.usuariosAtendidos, state.modalM3, state.m3, state.usuarioId, state.modalCliente, state.clientes, state.codtCliente, state.cedulaCliente, state.razon_socialCliente, state.celularCliente, state.emailCliente, state.nombreCliente, state.direccion_facturaCliente, state.puntos, state.puntoId, state.modalPropiedad, state.propiedad, state.nComodatoText, state.nMedidorText, state.ubicacion, state.modalUbicacion, state.capacidad, state.direccion, state.observacion, updateState, filtroClientes]);

    const step3 = useCallback(() => {
        const { observaciones, avisos, extintores, distancias, electricas, accesorios, estado, solicitudServicio, imgAlerta, alertaText, alertaFecha, nActa, depTecnicoEstado, imgDepTecnico, depTecnicoText } = state
        return (
            <View>
                {/* OBSERVACIONES */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Observaciones</Text>
                    <TextInput
                        placeholder="Observaciones"
                        style={style.inputStep4}
                        value={observaciones}
                        onChangeText={(observaciones: string) => updateState({ observaciones })}
                    />
                </View>
                <View style={style.separador}></View>
                {
                    estado == "2"
                        ? <View style={style.contenedorSetp2}>
                            <Text style={style.row1Step2}>Solicitud</Text>
                            <Text style={style.row1Step2}>{solicitudServicio}</Text>
                        </View>
                        : estado == "3"
                            ? <>
                                <View style={style.contenedorSetp2}>
                                    <Text style={style.row1Step2}>Solicitud</Text>
                                    <Text style={style.row1Step2}>{solicitudServicio}</Text>
                                </View>
                                <View style={style.contenedorSetp2}>
                                    <Text style={style.row1Step2}>Comentario</Text>
                                    <Text style={style.row1Step2}>{alertaText}</Text>
                                </View>
                                <View style={style.contenedorSetp2}>
                                    <Text style={style.row1Step2}>Fecha</Text>
                                    <Text style={style.row1Step2}>{alertaFecha}</Text>
                                </View>
                                <View style={style.contenedorSetp2}>
                                    <Text style={style.row1Step2}>N Acta</Text>
                                    <Text style={style.row1Step2}>{nActa}</Text>
                                </View>
                                <TomarFoto
                                    source={imgAlerta}
                                    width={180}
                                    titulo="Retiro de tanques"
                                    limiteImagenes={1}
                                    imagenes={(imgAlerta: any) => { updateState({ imgAlerta }) }}
                                />
                            </>
                            : <TouchableOpacity style={style.nuevaFrecuencia} onPress={() => updateState({ modalAlerta: true })}>
                                <Text style={style.textGuardar}>Nueva Alerta</Text>
                            </TouchableOpacity>
                }
                <View style={style.separador}></View>
                {
                    depTecnicoEstado
                        ? <>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step2}>Observacion</Text>
                                <Text style={style.row1Step2}>{depTecnicoText}</Text>
                            </View>
                            <TomarFoto
                                source={imgDepTecnico}
                                width={180}
                                titulo="Retiro de tanques"
                                limiteImagenes={1}
                                imagenes={(imgDepTecnico: any) => { updateState({ imgDepTecnico }) }}
                            />
                        </>
                        : <>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step3}>Falta de Avisos reglamentarios</Text>
                                <Switch
                                    trackColor={{ true: '#d60606', false: Platform.OS == 'android' ? '#d3d3d3' : '#fbfbfb' }}
                                    thumbColor={Platform.OS == 'ios' ? '#FFFFFF' : (avisos ? '#d60606' : '#ffffff')}
                                    ios_backgroundColor="#fbfbfb"
                                    style={[avisos ? style.switchEnableBorder : style.switchDisableBorder]}
                                    value={avisos}
                                    onValueChange={(avisos: boolean) => updateState({ avisos })}
                                />
                            </View>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step3}>Falta extintores</Text>
                                <Switch
                                    trackColor={{ true: '#d60606', false: Platform.OS == 'android' ? '#d3d3d3' : '#fbfbfb' }}
                                    thumbColor={Platform.OS == 'ios' ? '#FFFFFF' : (extintores ? '#d60606' : '#ffffff')}
                                    ios_backgroundColor="#fbfbfb"
                                    style={[extintores ? style.switchEnableBorder : style.switchDisableBorder]}
                                    onValueChange={(extintores: boolean) => updateState({ extintores })}
                                    value={extintores}
                                />
                            </View>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step3}>No cumple distancias</Text>
                                <Switch
                                    trackColor={{ true: '#d60606', false: Platform.OS == 'android' ? '#d3d3d3' : '#fbfbfb' }}
                                    thumbColor={Platform.OS == 'ios' ? '#FFFFFF' : (distancias ? '#d60606' : '#ffffff')}
                                    ios_backgroundColor="#fbfbfb"
                                    style={[distancias ? style.switchEnableBorder : style.switchDisableBorder]}
                                    onValueChange={(distancias: boolean) => updateState({ distancias })}
                                    value={distancias}
                                />
                            </View>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step3}>Fuentes ignición cerca</Text>
                                <Switch
                                    trackColor={{ true: '#d60606', false: Platform.OS == 'android' ? '#d3d3d3' : '#fbfbfb' }}
                                    thumbColor={Platform.OS == 'ios' ? '#FFFFFF' : (electricas ? '#d60606' : '#ffffff')}
                                    ios_backgroundColor="#fbfbfb"
                                    style={[electricas ? style.switchEnableBorder : style.switchDisableBorder]}
                                    onValueChange={(electricas: boolean) => updateState({ electricas })}
                                    value={electricas}
                                />
                            </View>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step3}>Cumple accesorios y materiales</Text>
                                <Switch
                                    trackColor={{ true: '#d60606', false: Platform.OS == 'android' ? '#d3d3d3' : '#fbfbfb' }}
                                    thumbColor={Platform.OS == 'ios' ? '#FFFFFF' : (accesorios ? '#d60606' : '#ffffff')}
                                    ios_backgroundColor="#fbfbfb"
                                    style={[accesorios ? style.switchEnableBorder : style.switchDisableBorder]}
                                    onValueChange={(accesorios: boolean) => updateState({ accesorios })}
                                    value={accesorios}
                                />
                            </View>
                        </>
                }
            </View>
        )
    }, [state.observaciones, state.avisos, state.extintores, state.distancias, state.electricas, state.accesorios, state.estado, state.solicitudServicio, state.imgAlerta, state.alertaText, state.alertaFecha, state.nActa, state.depTecnicoEstado, state.imgDepTecnico, state.depTecnicoText, updateState]);

    const step4 = useCallback(() => {
        return (
            <View>
                {
                    images.map(({ title, type, mime, source }: any) => {
                        if (mime === 'image/jpeg') {
                            return (
                                <React.Fragment key={title}>
                                    <TomarFoto
                                        source={(state as any)[source]}
                                        width={180}
                                        titulo={title}
                                        limiteImagenes={4}
                                        imagenes={(e: any) => { uploadImagen(e, type, mime) }}
                                    />
                                    <View style={style.separador}></View>
                                </React.Fragment>
                            )
                        } else {
                            return (
                                <React.Fragment key={title}>
                                    <SubirDocumento
                                        navigate={navigation.navigate}
                                        source={(state as any)[source]}
                                        width={180}
                                        titulo={title}
                                        limiteImagenes={4}
                                        imagenes={(e: any) => { uploadImagen(e, type, mime) }}
                                    />
                                    <View style={style.separador}></View>
                                </React.Fragment>
                            )
                        }
                    })
                }
            </View>
        )
    }, [state, navigation, uploadImagen]);

    const step5 = useCallback(() => {
        const { lat, lng, accesoPerfil, modalDpto, dpto, dptos, modalCiudad, ciudades, ciudad, modalPoblado, poblados, poblado } = state
        return (
            <View>
                {
                    (accesoPerfil == "admin" || accesoPerfil == "adminTanque")
                        ? <>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step2}>Latitud</Text>
                                <TextInput
                                    placeholder="Latitud"
                                    style={style.inputStep2}
                                    value={lat ? lat.toString() : ""}
                                    onChangeText={(lat: string) => updateState({ lat })}
                                />
                            </View>
                            <View style={style.contenedorSetp2}>
                                <Text style={style.row1Step2}>Longitud</Text>
                                <TextInput
                                    placeholder="Longitud"
                                    style={style.inputStep2}
                                    value={lng ? lng.toString() : ""}
                                    onChangeText={(lng: string) => updateState({ lng })}
                                />
                            </View>
                        </>
                        : <><Text>Lat: {lat}</Text>
                            <Text>Lng: {lng}</Text></>
                }
                {/* DEPARTAMENTOS */}
                <ModalFilterPicker
                    placeholderText="Dpto ..."
                    visible={modalDpto}
                    onSelect={(e: any) => buscarCiudad(e.key)}
                    onCancel={() => updateState({ modalDpto: false })}
                    options={dptos}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Dpto</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalDpto: true })}>
                        <Text style={dpto ? style.textBtnActive : style.textBtn}>{dpto ? dpto : "Dpto"}</Text>
                    </TouchableOpacity>
                </View>

                {/* CIUDADES */}
                <ModalFilterPicker
                    placeholderText="ciudad ..."
                    visible={modalCiudad}
                    onSelect={(e: any) => buscarPoblado(e.key)}
                    onCancel={() => updateState({ modalCiudad: false })}
                    options={ciudades}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>ciudad</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalCiudad: true })}>
                        <Text style={ciudad ? style.textBtnActive : style.textBtn}>{ciudad ? ciudad : "ciudad"}</Text>
                    </TouchableOpacity>
                </View>

                {/* POBLADOS */}
                <ModalFilterPicker
                    placeholderText="Poblado ..."
                    visible={modalPoblado}
                    onSelect={(e: any) => updateState({ poblado: e.key, modalPoblado: false })}
                    onCancel={() => updateState({ modalPoblado: false })}
                    options={poblados}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Poblado</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={() => updateState({ modalPoblado: true })}>
                        <Text style={poblado ? style.textBtnActive : style.textBtn}>{poblado ? poblado : "Poblado"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }, [state.lat, state.lng, state.accesoPerfil, state.modalDpto, state.dpto, state.dptos, state.modalCiudad, state.ciudades, state.ciudad, state.modalPoblado, state.poblados, state.poblado, buscarCiudad, buscarPoblado, updateState]);

    const renderModalAlerta = useCallback(() => {
        const { solicitudServicio } = state
        return (
            <View style={style.modal}>
                <View style={style.subContenedorModal}>
                    <TouchableOpacity activeOpacity={1} onPress={() => updateState({ modalAlerta: false })} style={style.btnModalClose}>
                        <FontAwesome name={'times-circle'} style={style.iconCerrar} />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Solicitud Servicio"
                        style={style.inputAlerta}
                        value={solicitudServicio}
                        onChangeText={(solicitudServicio: string) => updateState({ solicitudServicio })}
                    />
                    <TouchableOpacity style={style.nuevaAlerta} onPress={() => solicitudServicio()}>
                        <Text style={style.textGuardar}>Enviar Alerta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }, [state.solicitudServicio, updateState]);

    const renderSteps = useCallback(() => {
        const { tanqueArray, revisionId, modalAlerta } = state

        return (
            <ProgressSteps activeStepIconBorderColor="#002587" progressBarColor="#002587" activeLabelColor="#002587" >
                <ProgressStep label="Datos" nextBtnDisabled={tanqueArray.length == 0 ? true : false} nextBtnText="Siguiente" onNext={() => revisionId ? editarStep1() : crearStep1()}>
                    <View style={{ alignItems: 'center' }}>
                        {step1()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Información" nextBtnText="Siguiente" previousBtnText="Anterior" onNext={() => editarStep2()}>
                    <View style={{ alignItems: 'center' }}>
                        {step2()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Instalación" nextBtnText="Siguiente" previousBtnText="Anterior" onNext={() => editarStep3()}>
                    <View style={{ alignItems: 'center' }}>
                        {modalAlerta && renderModalAlerta()}
                        {step3()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Doc. adicionales" nextBtnText="Siguiente" previousBtnText="Anterior">
                    <View style={{ alignItems: 'center' }}>
                        {step4()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Coordenadas" finishBtnText="Guardar" previousBtnText="Anterior" onSubmit={() => editarStep5()}>
                    <View style={{ alignItems: 'center' }}>
                        {step5()}
                    </View>
                </ProgressStep>
            </ProgressSteps>
        )
    }, [state.tanqueArray, state.revisionId, state.modalAlerta, step1, step2, step3, step4, step5, renderModalAlerta, editarStep1, crearStep1, editarStep2, editarStep3, editarStep5]);

    const addTanque = useCallback((nombre: any, cantidad: any) => {
        let tanques = state.tanques.filter((e: any) => {
            if (e.nombre == nombre) e.cantidad = e.cantidad + cantidad
            return e
        })
        updateState({ tanques })
    }, [state.tanques, updateState]);

    return (
        <>
            <View style={style.container}>
                {renderSteps()}
                {state.loading && <View style={style.loadingContain}>
                    <ActivityIndicator color="#00218b" size={'large'} />
                </View>}
            </View>
            <Footer navigation={navigation} />
            <Toast />
        </>
    );
};

export default NuevaRevision;
