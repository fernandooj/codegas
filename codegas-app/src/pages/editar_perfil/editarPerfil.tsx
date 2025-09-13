import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Button,
    TextInput,
    ImageBackground,
    ActivityIndicator,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './style';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { Picker } from '@react-native-picker/picker';
import Footer from '../components/footer';
import TomarFoto from '../components/tomarFoto';
import Toast from 'react-native-toast-message';
import { DataContext } from "../../context/context"
import { accesos } from '../../utils/constants';
import {
    getUserById,
    getPointsByClient,
    signUp,
    updateUserProfile,
    getVeos,
    getActiveZones,
    changeValorUnitario,
    checkEmail,
    assignCommercial,
    deleteUser,
    changeUserStatus,
    createMultipleUsers,
    createMultiplePoints,
    updateMultipleUsers,
    changePassword,
    uploadAvatar
} from '../../redux/actions/usuarioActions';
import {
    EditarPerfilProps,
    EditarPerfilState,
    ContextType,
    RootState,
    UpdateStateFunction,
    RenderPerfilFunction,
    RenderFormPassFunction,
    ModalZonasFunction,
    ModalUbicacionFunction,
    CambiarValorUnitarioFunction,
    VerificaEmailFunction,
    AsignarVeoFunction,
    EliminarUsuarioFunction,
    CambiarEstadoUsuarioFunction,
    ActualizaUbicacionFunction,
    ActualizaArrayUbicacionFunction,
    ActualizaZonaFunction,
    GuardarUbicacionFunction,
    AvatarFunction,
    HandleSubmitFunction,
    EliminarUbicacionFunction,
    GuardarUsuarioFunction,
    EditarUsuarioFunction,
    CambiarPassFunction,
    EdicionExitosaFunction,
    LoginExitosoFunction,
    Ubicacion,
    Veo,
    Zona,
    User,
    ApiResponse,
    SignUpData,
    UpdateUserData,
    MultipleUsersData,
    MultiplePointsData,
    FormDataUpload
} from './types';

// Import FormData as a type to avoid conflicts
import { FormData as FormDataType } from 'form-data';
const VerPerfil: React.FC<EditarPerfilProps> = ({ navigation, route }) => {
    const context = useContext<ContextType>(DataContext);
    const dispatch = useDispatch();
    const perfil = useSelector((state: RootState) => state.usuario.perfil.user);

    const [state, setState] = useState<EditarPerfilState>({
        razon_social: '',
        cedula: '',
        direccion_factura: '',
        email: '',
        nombre: '',
        password: '',
        celular: '',
        tipo: '',
        acceso: 'usuario',
        codt: '',
        codMagister: '',
        terminoBuscador: '',
        valorUnitario: '',
        modalUbicacion: false,
        modalZona: false,
        modalCliente: false,
        userId: null,
        zonas: [],
        puntos: [],
        imagen: [],
        veos: [],
        ubicacionesEliminadas: [], //envio los id de las ubicaciones eliminados
        ubicaciones: [
            {
                direccion: undefined,
                nombre: undefined,
                email: undefined,
                celular: undefined,
                idZona: undefined,
                nombreZona: undefined,
                capacidad: undefined,
                nuevo: true,
                acceso: 'cliente',
            },
        ],
        cargando: false,
        showPass: false,
        activo: true,
        idUsuario: '',
        veo: '',
        editado: false,
        editaAvatar: false,
        showLoading: false,
        activeScroll: false,
        idZona: '',
        key: 0,
        idVeo: '',
        tipoAcceso: '',
        accesoPerfil: '',
        observacion: '',
        direccion: '',
        emailUbicacion: '',
        celularUbicacion: '',
        nombreUbicacion: '',
        nombreZona: '',
        confirmar: ''
    });

    const updateState: UpdateStateFunction = useCallback((updates) => {
        setState(prevState => ({ ...prevState, ...updates }));
    }, []);
    useEffect(() => {
        const initializeData = async () => {
            const { acceso: accesoPerfil, userId } = context;
            let acceso = accesoPerfil == 'despacho' ? 'cliente' : 'usuario';
            updateState({ accesoPerfil, acceso, userId });

            const params = route?.params;
            if (params?.tipoAcceso) {
                updateState({ tipoAcceso: params.tipoAcceso });
                if (params.tipoAcceso == "solucion") {
                    updateState({ acceso: "cliente" });
                }
            }

            if (!params?.tipoAcceso) {
                try {
                    const e = await getUserById(userId);
                    const { user } = e;
                    const ubi = await getPointsByClient(params?.idUsuario);
                    let ubicaciones = ubi.status ? ubi.puntos : [];
                    updateState({
                        razon_social: user.razon_social ? user.razon_social : '',
                        cedula: user.cedula ? user.cedula : '',
                        email: user.email ? user.email : '',
                        nombre: user.nombre ? user.nombre : '',
                        password: user.password ? user.password : '',
                        celular: user.celular ? user.celular : '',
                        tipo: user.tipo ? user.tipo : '',
                        acceso: user.acceso ? user.acceso : '',
                        imagen: user.avatar ? user.avatar : [],
                        codt: user.codt ? user.codt : '',
                        valorUnitario: user.valorunitario ? user.valorunitario : '',
                        idUsuario: user._id ? user._id : '',
                        codMagister: user.codMagister ? user.codMagister : '',
                        editado: user.editado ? user.editado : false,
                        ubicaciones: ubicaciones,
                        accesoPerfil: 'cliente',
                        direccion_factura: user.direccion_factura ? user.direccion_factura : "",
                    });
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            } else if (params?.tipoAcceso == "editar") {
                try {
                    const e = await getUserById(params.idUsuario);
                    const { user } = e;
                    const ubi = await getPointsByClient(params.idUsuario);
                    let ubicaciones = ubi.status ? ubi.puntos : [];

                    ubicaciones = ubicaciones.map(data => {
                        let data1 = params.idUsuario;
                        let data2 = data.idCliente;
                        if (data1 === data2) {
                            return {
                                direccion: data.direccion,
                                email: undefined,
                                idCliente: undefined,
                                idZona: data.idZona,
                                nombre: undefined,
                                celular: undefined,
                                nombreZona: data.nombreZona,
                                observacion: data.observacion,
                                capacidad: data.capacidad,
                                _id: data._id
                            };
                        } else {
                            return {
                                direccion: data.direccion,
                                email: data.email,
                                idCliente: data.idCliente,
                                idZona: data.idZona,
                                nombre: data.nombre,
                                celular: data.celular,
                                nombreZona: data.nombreZona,
                                observacion: data.observacion,
                                capacidad: data.capacidad,
                                _id: data._id
                            };
                        }
                    });

                    console.log(user);
                    updateState({
                        razon_social: user.razon_social ? user.razon_social : "",
                        cedula: user.cedula ? user.cedula : "",
                        email: user.email ? user.email : "",
                        nombre: user.nombre ? user.nombre : "",
                        password: user.password ? user.password : "",
                        celular: user.celular ? user.celular : "",
                        tipo: user.tipo ? user.tipo : "",
                        acceso: user.acceso ? user.acceso : "",
                        imagen: user.avatar ? user.avatar : [],
                        codt: user.codt ? user.codt : "",
                        ubicaciones,
                        activo: user.activo && user.activo,
                        idUsuario: user._id ? user._id : "",
                        veo: user.veos ? user.veos.nombre : "",
                        codMagister: user.codMagister ? user.codMagister : "",
                        valorUnitario: user.valorunitario,
                        direccion_factura: user.direccion_factura ? user.direccion_factura : "",
                    });
                } catch (error) {
                    console.error('Error loading edit data:', error);
                }
            }
        };

        initializeData();
    }, [context, route?.params, updateState]);
    const editarUsuario: EditarUsuarioFunction = useCallback((e?: any) => {
        updateState({ cargando: true });
        const { razon_social, cedula, ubicaciones, direccion_factura, nombre, email, celular, tipo, acceso, codt, imagen, editaAvatar, idUsuario, ubicacionesEliminadas, editado, codMagister, valorUnitario } = state;
        let clientes = ubicaciones.filter(e => {
            return e.email && e.idCliente
        })

        let clientesNuevos = ubicaciones.filter(e => {
            return e.email && !e.idCliente
        })

        let puntos = ubicaciones.filter(e => {
            return !e.email
        })

        puntos = ubicaciones.map(e => {
            return { direccion: e.direccion, idZona: e.idZona, observacion: e.observacion, _id: e._id, capacidad: e.capacidad }
        })
        let puntosNuevos = puntos.filter(e => {
            return !e._id
        })
        puntos = puntos.filter(e => {
            return e._id
        })
        console.log({ editado, puntos, puntosNuevos })
        updateUserProfile(idUsuario, { editado, puntos, puntosNuevos, razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, ubicacionesEliminadas, codMagister, valorUnitario })
            .then(e => {
                console.log(e)
                if (acceso == "cliente") {
                    ////////////////////////////////////////////        EDITO LOS CLIENTES
                    if (clientes.length > 0) {

                        updateMultipleUsers(clientes, idUsuario, e.user.nombre)
                            .then(res => {
                                AsyncStorage.setItem('nombre', e.user.nombre)
                                Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                                setTimeout(() => {
                                    navigation.navigate("clientes", {
                                        scrollPosition: route?.params?.scrollPosition || 0
                                    });
                                }, 1500);
                                updateState({ cargando: false })
                            })
                            .catch(err2 => {
                                console.log(err2)
                                updateState({ cargando: false })
                            })
                    }
                    ////////////////////////////////////////////        INSERTO LOS CLIENTES
                    if (clientesNuevos.length > 0) {
                        console.log("perrito")
                        createMultipleUsers(clientesNuevos, idUsuario, e.user.nombre)
                            .then(res => {
                                AsyncStorage.setItem('nombre', e.user.nombre)
                                Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                                setTimeout(() => {
                                    navigation.navigate("clientes", {
                                        scrollPosition: route?.params?.scrollPosition || 0
                                    });
                                }, 1500);
                                updateState({ cargando: false })
                            })
                            .catch(err2 => {
                                console.log(err2)
                                updateState({ cargando: false })
                            })
                    }
                    ////////////////////////////////////////////       EDITO LOS PUNTOS
                    // if(puntos.length>0){
                    //     axios.put("pun/punto/varios",{puntos, idPadre:idUsuario})
                    //     .then(res=>{
                    //         AsyncStorage.setItem('nombre', e.data.user.nombre)
                    //         //navigation.navigate("Home")
                    //         Toast.show("Usuario guardado con exito")
                    //     })
                    //     .catch(err2=>{
                    //         console.log(err2)
                    //         this.setState({cargando:false})
                    //     })
                    // }
                    ////////////////////////////////////////////       INSERTO LOS PUNTOS
                    // if(puntosNuevos.length>0){
                    //     axios.post("pun/punto/varios", {puntos:puntosNuevos, idPadre:idUsuario, idCliente:idUsuario})
                    //     .then(res=>{
                    //         AsyncStorage.setItem('nombre', e.data.user.nombre)
                    //         navigation.navigate("Home")
                    //         Toast.show("Usuario guardado con exito")
                    //     })
                    //     .catch(err2=>{
                    //         console.log(err2)
                    //         this.setState({cargando:false})
                    //     })
                    // }
                    if (editado == false) {
                        // Si es la primera vez editando, actualizar directamente sin mostrar formulario de contraseña
                        AsyncStorage.setItem('nombre', e.user.nombre || '')
                        Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                        setTimeout(() => {
                            navigation.navigate("clientes", {
                                scrollPosition: route?.params?.scrollPosition || 0
                            });
                        }, 1500);
                        updateState({ cargando: false })
                    } else {
                        AsyncStorage.setItem('nombre', e.user.nombre || '')
                        Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                        setTimeout(() => {
                            navigation.navigate("clientes", {
                                scrollPosition: route?.params?.scrollPosition || 0
                            });
                        }, 1500);
                        updateState({ cargando: false })
                    }

                } else {
                    if (editaAvatar) {
                        if (imagen.length === 0) {
                            Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                            setTimeout(() => {
                                navigation.navigate("clientes", {
                                    scrollPosition: route?.params?.scrollPosition || 0
                                });
                            }, 1500);
                            updateState({ cargando: false })
                        } else {
                            avatar(imagen, e.user._id)
                        }
                    } else {
                        Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                        setTimeout(() => {
                            navigation.navigate("clientes", {
                                scrollPosition: route?.params?.scrollPosition || 0
                            });
                        }, 1500);
                        updateState({ cargando: false })
                    }
                }
            })
            .catch(err => {
                console.log(err);
                updateState({ cargando: false });
            })
    }, [state.razon_social, state.cedula, state.ubicaciones, state.direccion_factura, state.nombre, state.email, state.celular, state.tipo, state.acceso, state.codt, state.imagen, state.editaAvatar, state.idUsuario, state.ubicacionesEliminadas, state.editado, state.codMagister, state.valorUnitario, updateState, navigation]);

    const renderPerfil: RenderPerfilFunction = useCallback(() => {
        let { razon_social, cedula, direccion_factura, email, nombre, celular, codt, acceso, valorUnitario, tipoAcceso, imagen, cargando, ubicaciones, tipo, activo, idUsuario, accesoPerfil, modalCliente, veos, veo, editado, codMagister } = state;
        valorUnitario = valorUnitario ? valorUnitario.toString() : '';
        razon_social = razon_social ? razon_social.toUpperCase() : razon_social;
        email = email ? email.toUpperCase() : email;
        direccion_factura = direccion_factura ? direccion_factura.toUpperCase() : direccion_factura;
        nombre = nombre ? nombre.toUpperCase() : nombre;

        return (
            <ScrollView keyboardDismissMode="on-drag" style={style.contenedorPerfil}>
                {tipoAcceso == "admin" ? <Text style={style.titulo}>Nuevo {acceso}</Text> : <Text style={style.titulo}>Editar perfil</Text>}
                {/* ACCESO */}
                {
                    ((tipoAcceso == "admin" && accesoPerfil !== "despacho") || tipoAcceso == "editar")
                    && <View style={style.tipo}>
                        <Picker
                            placeholder={{
                                label: 'Acceso',
                                value: null,
                                color: '#00218b',
                            }}
                            items={accesos}
                            onValueChange={acceso => { updateState({ acceso }) }}
                            mode="dropdown"
                            style={{
                                ...style,
                                placeholder: {
                                    color: 'rgba(0,0,0,1)',
                                    fontSize: 15,
                                },
                            }}
                            value={acceso}
                        />
                    </View>
                }
                {/* EMAIL */}
                <Text style={style.textInfo}>Email</Text>
                <TextInput
                    type='outlined'
                    placeholder="Email"

                    keyboardType='email-address'
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={email => updateState({ email })}
                    onBlur={email => verificaEmail()}
                    style={email.length < 3 ? [style.input, style.inputRequired] : style.input}
                    autoCapitalize="characters"
                />

                {/* RAZON SOCIAL */}
                {
                    acceso == "cliente"
                    && <View>
                        <Text style={style.textInfo}>Razón Social</Text>
                        <TextInput
                            type='outlined'
                            placeholderTextColor="#aaa"
                            placeholder="Razón Social"
                            autoCapitalize="characters"
                            value={razon_social}
                            onChangeText={razon_social => updateState({ razon_social })}
                            style={razon_social.length < 3 ? [style.input, style.inputRequired] : style.input}

                        />
                    </View>
                }

                {/* CEDULA */}
                <Text style={style.textInfo}>Cedula/ Nit</Text>
                <TextInput
                    type='outlined'
                    placeholder="Cedula / Nit"
                    placeholderTextColor="#aaa"
                    keyboardType='numeric'
                    value={cedula}
                    onChangeText={cedula => updateState({ cedula })}
                    style={cedula.length < 5 ? [style.input, style.inputRequired] : style.input}
                />
                {/* DIRECCION */}
                {
                    acceso == "cliente"
                    && <View>
                        <Text style={style.textInfo}>Dirección factura</Text>
                        <TextInput
                            type='outlined'
                            placeholder="Dirección factura"
                            placeholderTextColor="#aaa"
                            autoCapitalize="characters"
                            value={direccion_factura}
                            onChangeText={direccion_factura => updateState({ direccion_factura })}
                            style={direccion_factura.length < 3 ? [style.input, style.inputRequired] : style.input}
                        />
                    </View>
                }
                {/* UBICACION */}
                {
                    acceso == "cliente"
                    && <View>
                        <Text style={style.textInfo}>Ubicación entrega</Text>
                        <TouchableOpacity style={ubicaciones.length < 1 ? [style.btnUbicacion, style.inputRequired] : style.btnUbicacion} onPress={() => updateState({ modalUbicacion: true })}>
                            {
                                ubicaciones[0]
                                    ? ubicaciones[0].direccion
                                        ? <Text>{ubicaciones.length < 1 ? "Ubicación entrega" : `Tienes ${ubicaciones.length} ubicaciones guardadas`}</Text>
                                        : <Text>Ubicación entrega</Text>
                                    : null
                            }

                        </TouchableOpacity>
                    </View>
                }
                {/* CODT */}
                {
                    acceso == "cliente"
                    && <>
                        <Text style={style.textInfo}>Codt</Text>
                        <TextInput
                            type='outlined'
                            placeholder="CODT"
                            autoCapitalize='none'
                            placeholderTextColor="#aaa"
                            value={codt}
                            onChangeText={codt => updateState({ codt })}
                            style={style.input}
                            editable={accesoPerfil == "cliente" ? false : true}
                        />
                    </>
                }

                {/* NOMBRES */}
                <Text style={style.textInfo}>Nombres</Text>
                <TextInput
                    type='outlined'
                    label='Nombres'
                    placeholder="Nombres"
                    autoCapitalize='none'
                    placeholderTextColor="#aaa"
                    value={nombre}
                    onChangeText={nombre => updateState({ nombre })}
                    style={nombre.length < 3 ? [style.input, style.inputRequired] : style.input}
                />
                {/* CELULAR */}
                <Text style={style.textInfo}>Celular</Text>
                <TextInput
                    type='outlined'
                    placeholder="Celular"
                    autoCapitalize='none'
                    placeholderTextColor="#aaa"
                    value={celular}
                    onChangeText={celular => updateState({ celular })}
                    style={celular.length < 7 ? [style.input, style.inputRequired] : style.input}
                />

                {/* VEO */}
                {
                    acceso == "veo"
                    && <><Text style={style.textInfo}>Codigo Magister</Text>
                        <TextInput
                            type='outlined'
                            placeholder="Codigo Magister"
                            autoCapitalize='none'
                            placeholderTextColor="#aaa"
                            value={codMagister}
                            onChangeText={codMagister => updateState({ codMagister })}
                            style={codMagister.length < 3 ? [style.input, style.inputRequired] : style.input}
                        />
                    </>
                }
                {/* VALOR UNITARIO */}
                {
                    acceso == "cliente"
                    && <>
                        <Text style={style.textInfo}>Valor Unitario</Text>
                        <TextInput
                            type='outlined'
                            placeholder="Valor Unitario"
                            autoCapitalize='none'
                            placeholderTextColor="#aaa"
                            value={valorUnitario}
                            onChangeText={valorUnitario => updateState({ valorUnitario })}
                            style={valorUnitario.length < 3 ? [style.input, style.inputRequired] : style.input}
                            editable={accesoPerfil == "cliente" ? false : true}
                            onBlur={() => cambiarValorUnitario()}
                        />
                    </>
                }


                {/* TIPO */}
                {
                    acceso == "cliente"
                    && <View>
                        <Text style={style.textInfo}>Tipo</Text>
                        <View style={style.tipo}>
                            <Picker
                                placeholder={{
                                    label: 'Tipo',
                                    value: null,
                                    color: '#00218b',
                                }}
                                items={[
                                    { label: 'Residencial', value: 'Residencial', key: 'Residencial' },
                                    { label: 'Comercial', value: 'Comercial', key: 'Comercial' },
                                    { label: 'Industrial', value: 'Industrial', key: 'Industrial' }
                                ]}
                                onValueChange={tipo => { updateState({ tipo }); }}

                                mode="dropdown"
                                style={{
                                    placeholder: {
                                        color: 'rgba(0,0,0,.2)',
                                        fontSize: 15,
                                    },
                                }}
                                value={tipo}
                            />
                        </View>
                    </View>
                }

                <ModalFilterPicker
                    placeholderText="Filtrar ..."
                    visible={modalCliente}
                    onSelect={(e) => asignarVeo(e.key)}
                    onCancel={() => updateState({ modalCliente: false })}
                    options={veos}
                    cancelButtonText="CANCELAR"
                />

                {
                    (tipoAcceso == "editar" && (accesoPerfil == "admin" || accesoPerfil == "comercial") || acceso == "cliente")
                    && <View>
                        <Text style={style.textInfo}>Comercial Veo</Text>
                        <TouchableOpacity onPress={() => accesoPerfil == "cliente" ? null : updateState({ modalCliente: true })} style={style.inputVeo}>
                            <Text style={style.textVeo}>{veo ? veo : "Veos"}</Text>
                        </TouchableOpacity>
                    </View>
                }

                {/* AVATAR */}
                {
                    acceso !== "cliente"
                    && <View>
                        <TomarFoto
                            width={110}
                            source={imagen}
                            titulo="Foto de perfil"
                            limiteImagenes={1}
                            imagenes={(imagen) => { updateState({ imagen, editaAvatar: true, showLoading: false }) }}
                        />
                    </View>
                }
                {/* BOTON CAMBIAR ESTADO */}
                {
                    (tipoAcceso == "editar" && (accesoPerfil == "admin" || accesoPerfil == "despacho"))
                    && <TouchableOpacity style={[style.btnGuardar, { backgroundColor: activo ? "green" : "orange", marginBottom: 0 }]} onPress={() => cambiarEstadoUsuario()}>
                        <Text style={style.textGuardar}>{activo ? "Desactivar" : "Activar"}</Text>
                    </TouchableOpacity>
                }

                {/* BOTON ELIMINAR */}
                {
                    (tipoAcceso == "editar" && (accesoPerfil == "admin" || accesoPerfil == "despacho"))
                    && <TouchableOpacity style={[style.btnGuardar, { backgroundColor: "red", marginBottom: 0 }]} onPress={() => eliminarUsuario()}>
                        <Text style={style.textGuardar}>{"Eliminar"}</Text>
                    </TouchableOpacity>
                }

                {/* BOTON GUARDAR */}
                {
                    !tipoAcceso
                        ? <TouchableOpacity style={style.btnGuardar} onPress={() => handleSubmit("editar")}>
                            {cargando && <ActivityIndicator style={{ marginRight: 5 }} />}
                            <Text style={style.textGuardar}>{cargando ? "Guardando" : "Guardar"}</Text>
                        </TouchableOpacity>
                        : (tipoAcceso == "editar" && (accesoPerfil == "admin" || accesoPerfil == "despacho"))
                            ? <TouchableOpacity style={style.btnGuardar} onPress={() => editarUsuario("editar")}>
                                {cargando && <ActivityIndicator style={{ marginRight: 5 }} />}
                                <Text style={style.textGuardar}>{cargando ? "Guardando" : "Editar"}</Text>
                            </TouchableOpacity>
                            : (accesoPerfil == "admin" || accesoPerfil == "despacho")
                            && <TouchableOpacity style={style.btnGuardar} onPress={() => handleSubmit()}>
                                {cargando && <ActivityIndicator style={{ marginRight: 5 }} />}
                                <Text style={style.textGuardar}>{cargando ? "Guardando" : "Guardar"}</Text>
                            </TouchableOpacity>
                }
                {
                    (tipoAcceso == "editar" && (accesoPerfil == "admin" || accesoPerfil == "veo"))
                    && <TouchableOpacity style={[style.btnGuardar, { backgroundColor: "#feac00", marginBottom: 0 }]} onPress={() => navigation.navigate("chart", { idUsuario })}>
                        <Text style={style.textGuardar}>{"Graficos"}</Text>
                    </TouchableOpacity>
                }
                {
                    (tipoAcceso == "editar" && (accesoPerfil == "admin" || accesoPerfil == "despacho"))
                    && <TouchableOpacity style={[style.btnGuardar, { backgroundColor: "blue", marginBottom: 70 }]} onPress={() => navigation.navigate("puntos", { idUsuario })}>
                        <Text style={style.textGuardar}>{"Crear Revisión"}</Text>
                    </TouchableOpacity>
                }
            </ScrollView>

        );
    }, [state]);

    const cambiarValorUnitario: CambiarValorUnitarioFunction = useCallback(() => {
        let { valorUnitario, idUsuario } = state;
        changeValorUnitario(valorUnitario, idUsuario)
            .then(res => {
                if (res.status) {
                    Toast.show({ type: 'success', text1: 'Valor unitario editado' })
                }
            })
    }, [state.valorUnitario, state.idUsuario]);
    const verificaEmail: VerificaEmailFunction = useCallback(() => {
        let { email } = state;
        checkEmail(email)
            .then(res => {
                if (res.data && res.data.status === "SUCCESS") {
                    Toast.show({ type: 'error', text1: 'Este email ya existe!' })
                }
            })
            .catch(err => {
                // Email no existe, está bien
            })
    }, [state.email]);
    const asignarVeo: AsignarVeoFunction = useCallback((idVeo: string) => {
        const { idUsuario, veos, tipoAcceso } = state;
        let veo = veos.filter(e => {
            return e.key == idVeo
        });
        updateState({ veo: veo[0].label, modalCliente: false, idVeo });
        assignCommercial(idUsuario, idVeo)
            .then(res => {
                if (res.status) {
                    setTimeout(() => {
                        Toast.show({ type: 'success', text1: 'Usuario asignado' })
                    }, 100);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [state.idUsuario, state.veos, state.tipoAcceso, updateState]);
    const eliminarUsuario: EliminarUsuarioFunction = useCallback(() => {
        const { nombre, idUsuario } = state;
        Alert.alert(
            'Seguro desea eliminar',
            `al usuario ${nombre}`,
            [
                { text: 'Confirmar', onPress: () => confirmar() },
                { text: 'Cancelar', onPress: () => console.log("cancelado") },
            ],
            { cancelable: false }
        );
        const confirmar = () => {
            deleteUser(idUsuario)
                .then(res => {
                    if (res.status) {
                        Toast.show({ type: 'success', text1: 'Usuario eliminado con éxito' });
                        setTimeout(() => {
                            navigation.navigate("clientes", {
                                scrollPosition: route?.params?.scrollPosition || 0
                            });
                        }, 1500);
                    }
                })
                .catch(err => {
                    console.log(err);
                    Toast.show({ type: 'error', text1: 'Error al eliminar usuario' });
                });
        }
    }, [state.nombre, state.idUsuario, navigation]);
    const cambiarEstadoUsuario: CambiarEstadoUsuarioFunction = useCallback(() => {
        const { nombre, idUsuario, activo } = state;

        Alert.alert(
            `Seguro desea ${activo ? "Desactivar" : "Activar"}`,
            `al usuario ${nombre}`,
            [
                { text: 'Confirmar', onPress: () => confirmar() },
                { text: 'Cancelar', onPress: () => console.log("cancelado") },
            ],
            { cancelable: false }
        );
        const confirmar = () => {
            changeUserStatus(idUsuario, !activo)
                .then(res => {
                    if (res.status) {
                        Toast.show({ type: 'success', text1: `Usuario ${!activo ? 'activado' : 'desactivado'} con éxito` });
                        setTimeout(() => {
                            navigation.navigate("Home");
                        }, 1500);
                    }
                })
                .catch(err => {
                    console.log(err);
                    Toast.show({ type: 'error', text1: 'Error al cambiar estado del usuario' });
                });
        }
    }, [state.nombre, state.idUsuario, state.activo, navigation]);
    const actualizaUbicacion: ActualizaUbicacionFunction = useCallback(() => {
        let {
            observacion,
            ubicaciones,
            direccion,
            emailUbicacion,
            celularUbicacion,
            nombreUbicacion,
            nombreZona,
        } = state;
        let data = {
            direccion,
            email: emailUbicacion,
            celular: celularUbicacion,
            nombre: nombreUbicacion,
            observacion,
            nombreZona,
            nuevo: true,
            acceso: 'cliente',
        };
        ubicaciones.push(data);
        updateState({ ubicaciones });
    }, [state.observacion, state.ubicaciones, state.direccion, state.emailUbicacion, state.celularUbicacion, state.nombreUbicacion, state.nombreZona, updateState]);
    const actualizaArrayUbicacion: ActualizaArrayUbicacionFunction = useCallback((type: string, value: string, key: number) => {
        let { ubicaciones } = state;
        type == 'direccion'
            ? (ubicaciones[key].direccion = value)
            : type == 'observacion'
                ? (ubicaciones[key].observacion = value)
                : type == 'emailUbicacion'
                    ? (ubicaciones[key].email = value)
                    : type == 'celularUbicacion'
                        ? (ubicaciones[key].celular = value)
                        : type == 'capacidad'
                            ? (ubicaciones[key].capacidad = value)
                            : (ubicaciones[key].nombre = value);
        updateState({ ubicaciones });
    }, [state.ubicaciones, updateState]);
    const modalZonas: ModalZonasFunction = useCallback(() => {
        const { zonas, idZona, terminoBuscador } = state;

        return (
            <View animationType="fade" >
                <TouchableOpacity activeOpacity={1}  >
                    <View style={style.modalZona}>
                        <View style={style.subModalZona}>
                            <TouchableOpacity activeOpacity={1} onPress={() => updateState({ modalZona: false })} style={style.btnModalClose}>
                                <FontAwesome name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <TextInput
                                type='outlined'
                                label='Buscar Zona'
                                placeholder="Buscar Zona"

                                onChangeText={terminoBuscador => updateState({ terminoBuscador })}
                                style={style.inputZona}
                            />
                            <ScrollView>
                                {
                                    zonas.map((e, key) => {
                                        return (
                                            <TouchableOpacity style={style.btnZona} key={key} onPress={() => actualizaZona(e._id, e.nombre)}>
                                                <Text style={style.textZona}>{e.nombre}</Text>
                                                {idZona == e._id && <FontAwesome name={'check'} style={style.iconZona} />}
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }, [state.zonas, state.idZona, state.terminoBuscador]);

    const actualizaZona: ActualizaZonaFunction = useCallback((id: string, nombre: string) => {
        const { key, ubicaciones } = state;
        ubicaciones[key].idZona = id;
        ubicaciones[key].nombreZona = nombre;
        updateState({ ubicaciones, modalZona: false });
    }, [state.key, state.ubicaciones, updateState]);

    const modalUbicacion: ModalUbicacionFunction = useCallback(() => {
        let { modalZona, ubicaciones, activeScroll } = state;
        return (
            <View>
                {modalZona ? modalZonas() : null}
                <View>
                    <TouchableOpacity activeOpacity={1}  >
                        <View style={[style.modal, { top: activeScroll ? -150 : 0 }]}>
                            <View style={style.subContenedorModal}>
                                <TouchableOpacity activeOpacity={1} onPress={() => updateState({ modalUbicacion: false })} style={style.btnModalClose}>
                                    <FontAwesome name={'times-circle'} style={style.iconCerrar} />
                                </TouchableOpacity>
                                <ScrollView keyboardDismissMode="on-drag" >
                                    <Text style={style.tituloModal}>Si el pedido lo realizara el encargado del punto por favor inserta su informacion, de lo contrario solo inserta la dirección y zona</Text>
                                    <View>
                                        {
                                            ubicaciones.map((e, key) => {
                                                console.log({ dir: e.direccion })
                                                return (
                                                    <View key={key}>
                                                        <View>
                                                            <TextInput
                                                                type='outlined'
                                                                label='Dirección'
                                                                placeholder="Dirección"
                                                                value={e.direccion ? e.direccion.toUpperCase() : e.direccion}
                                                                onChangeText={direccion => actualizaArrayUbicacion("direccion", direccion, key)}
                                                                style={style.input}
                                                            />
                                                            <Text style={style.asterisco}>*</Text>
                                                        </View>
                                                        <View>
                                                            <TouchableOpacity style={style.btnUbicacion} onPress={() => updateState({ modalZona: true, key })}>
                                                                <Text style={style.textZona}>{e.nombreZona ? e.nombreZona : "Zona"}</Text>
                                                            </TouchableOpacity>
                                                            <Text style={style.asterisco}>*</Text>
                                                        </View>
                                                        <TextInput
                                                            type='outlined'
                                                            label='capacidad'
                                                            placeholder="Capacidad almacenamiento"
                                                            value={e.capacidad}
                                                            onChangeText={capacidad => actualizaArrayUbicacion("capacidad", capacidad, key)}
                                                            style={style.input}
                                                        />
                                                        <TextInput
                                                            type='outlined'
                                                            label='observacion al momento de ingresar el vehiculo'
                                                            placeholder="observaciones ingreso del vehiculo"
                                                            // value={e.observacion.toUpperCase()}
                                                            onChangeText={observacion => actualizaArrayUbicacion("observacion", observacion, key)}
                                                            style={[style.input, { marginBottom: (e.nuevo || !e.idCliente) && key > 0 ? 40 : 10 }]}
                                                        />
                                                        {
                                                            (e.nuevo || e.idCliente)
                                                            && <TextInput
                                                                type='outlined'
                                                                label='Email'
                                                                placeholder="Email"
                                                                value={e.email}
                                                                onFocus={() => updateState({ activeScroll: true })}
                                                                onBlur={() => updateState({ activeScroll: false })}
                                                                onChangeText={emailUbicacion => actualizaArrayUbicacion("emailUbicacion", emailUbicacion, key)}
                                                                style={style.input}
                                                            />
                                                        }
                                                        {
                                                            (e.nuevo || e.idCliente)
                                                            && <TextInput
                                                                type='outlined'
                                                                label='Celular'
                                                                placeholder="Celular"
                                                                value={e.celular}
                                                                onFocus={() => updateState({ activeScroll: true })}
                                                                onBlur={() => updateState({ activeScroll: false })}
                                                                onChangeText={celularUbicacion => actualizaArrayUbicacion("celularUbicacion", celularUbicacion, key)}
                                                                style={style.input}
                                                            />
                                                        }
                                                        {
                                                            (e.nuevo || e.idCliente)
                                                            && <TextInput
                                                                type='outlined'
                                                                label='Nombre'
                                                                placeholder="Nombre"
                                                                value={e.nombre}
                                                                onFocus={() => updateState({ activeScroll: true })}
                                                                onBlur={() => updateState({ activeScroll: false })}
                                                                onChangeText={nombreUbicacion => actualizaArrayUbicacion("nombreUbicacion", nombreUbicacion, key)}
                                                                style={[style.input, { marginBottom: key > 0 ? 40 : 10 }]}
                                                            />
                                                        }
                                                        {
                                                            key > 0
                                                            && <TouchableOpacity style={style.btnEliminar} onPress={() => eliminarUbicacion(key)}>
                                                                <FontAwesome name={'trash'} style={style.iconEliminar} />
                                                            </TouchableOpacity>
                                                        }

                                                        <Text style={style.separador}></Text>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                    <View style={style.contenedorAdd}>
                                        <TouchableOpacity onPress={() => actualizaUbicacion()} style={style.btnAdd}>
                                            <FontAwesome name={'plus'} style={style.iconAdd} />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={style.btnGuardarUbicacion} onPress={() => guardarUbicacion()}>
                                        <Text style={style.textGuardar}>Guardar</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }, [state.modalZona, state.ubicaciones, state.activeScroll, modalZonas, updateState]);

    const renderFormPass: RenderFormPassFunction = useCallback(() => {
        const { password, confirmar, showLoading, cargando } = state;
        return <View style={style.contenedorPerfil}>
            <Text style={style.tituloContrasena}>Inserta tu contraseña</Text>
            <TextInput
                type='outlined'
                label='Contraseña'
                placeholder="Contraseña"
                value={password}
                onChangeText={password => updateState({ password })}
                style={style.input}
                secureTextEntry
            />
            <TextInput
                type='outlined'
                label='Confirmar'
                placeholder="Confirmar"
                value={confirmar}
                onChangeText={confirmar => updateState({ confirmar })}
                style={style.input}
                secureTextEntry={true}
            />
            {/* <Button color="#0071bb" loading={showLoading} 
                        title="Guardar"
                        disabled={ password!==confirmar ?true :false} 
                        onPress={() => savePassword()}
                    /> */}
            <TouchableOpacity style={style.btnGuardar} onPress={() => cambiarPass()}>
                {cargando && <ActivityIndicator style={{ marginRight: 5 }} />}
                <Text style={style.textGuardar}>{cargando ? "Guardando" : "Guardar"}</Text>
            </TouchableOpacity>
            {
                password !== confirmar
                && <Button
                    title="No coinciden"
                    color="#0071bb" loading={showLoading}
                />
            }
        </View>;
    }, [state.password, state.confirmar, state.showLoading, state.cargando]);
    const { modalUbicacion: showModalUbicacion, showPass } = state;

    return (
        <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo2.jpg')} >
            {showModalUbicacion ? modalUbicacion() : null}
            {
                showPass
                    ? renderFormPass()
                    : renderPerfil()
            }
            <Footer navigation={navigation} />
            <Toast />
        </ImageBackground>
    );
    const guardarUbicacion: GuardarUbicacionFunction = useCallback(() => {
        let { ubicaciones } = state;
        ubicaciones = ubicaciones.filter((e, index) => {
            return e.direccion != undefined
        });
        ubicaciones = ubicaciones.filter((e, index) => {
            return e.direccion != ""
        });
        const isEmpty = Object.values(ubicaciones).every(x => {
            if (!x.idZona) {
                return false
            } else {
                return true
            }
        });

        !isEmpty ? Alert.alert("Error", "Zonas son obligatorios") : updateState({ ubicaciones, modalUbicacion: false });
    }, [state.ubicaciones, updateState]);
    ///////////////////////////////////////////////////////////////
    //////////////          ACTUALIZA EL AVATAR
    ///////////////////////////////////////////////////////////////
    const avatar: AvatarFunction = useCallback((imagen: string[], idUser: string) => {
        updateState({ showLoading: true });
        let data = new FormDataType();
        imagen = imagen[0];
        state.tipoAcceso ? data.append('crear', true) : null;
        data.append('imagen', imagen);
        data.append('imagenOtroUsuario', true);
        data.append('idUser', idUser);
        uploadAvatar(data)
            .then((res) => {
                console.log(res);
                if (res.status) {
                    if (state.tipoAcceso) {
                        Alert.alert("Éxito", "Usuario guardado con exito");
                        navigation.navigate("Perfil");
                    } else {
                        loginExitoso(res.user);
                    }
                }
            })
            .catch(err => {
                updateState({ cargando: false });
            })
    }, [state.tipoAcceso, updateState, navigation]);


    /////////////////////////////////////////////////////////////////////////
    //////////////         VERIFICO QUE EL USUARIO TENGA TODOS LOS DATOS
    ///////////////////////////////////////////////////////////////////////
    const handleSubmit: HandleSubmitFunction = useCallback((esEditar?: string) => {
        const { razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, imagen, ubicaciones, valorUnitario } = state;
        console.log({ razon_social, cedula, direccion_factura, nombre, email, tipo, celular, tipo, acceso, codt, imagen, ubicaciones, valorUnitario })
        if (acceso == "cliente") {
            if (razon_social == "" || direccion_factura == "" || nombre == "" || email == "" || tipo == "" || ubicaciones.length < 1) {
                Alert.alert(
                    'Todos los campos son obligatorios',
                    '',
                    [
                        { text: 'Cerrar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                )
            } else if (celular.length < 7) {
                Toast.show({ type: 'error', text1: 'Telefono incorrecto' })

            } else if (cedula.length < 5) {
                Toast.show({ type: 'error', text1: 'Cedula incorrecta' })
            } else {
                esEditar == "editar" ? editarUsuario() : guardarUsuario()
            }
        } else {
            if (cedula == "" || email == "" || nombre == "" || celular == "" || !imagen) {
                Alert.alert(
                    'Todos los campos son obligatorios',
                    "",
                    [
                        { text: 'Cerrar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                )
            } else {
                esEditar == "editar" ? editarUsuario() : guardarUsuario();
            }
        }
    }, [state.razon_social, state.cedula, state.direccion_factura, state.nombre, state.email, state.celular, state.tipo, state.acceso, state.codt, state.imagen, state.ubicaciones, state.valorUnitario]);

    /////////////////////////////////////////////////////////////////////////
    //////////////         ELIMINO LA UBICACION SELECCIONADA
    ///////////////////////////////////////////////////////////////////////
    const eliminarUbicacion: EliminarUbicacionFunction = useCallback((key: number) => {
        let { ubicaciones, ubicacionesEliminadas } = state;
        ubicaciones.filter((e, index) => {
            if (index == key && e._id) {
                ubicacionesEliminadas.push(e._id)
            }
        });
        ubicaciones = ubicaciones.filter((e, index) => {
            return index != key
        });

        updateState({ ubicaciones, ubicacionesEliminadas });
    }, [state.ubicaciones, state.ubicacionesEliminadas, updateState]);
    const guardarUsuario: GuardarUsuarioFunction = useCallback((e?: any) => {
        updateState({ cargando: true });
        const { razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, ubicaciones, imagen, codMagister, valorUnitario, idVeo } = state;
        let clientes = ubicaciones.filter(e => {
            return e.email
        })
        let puntos = ubicaciones.filter(e => {
            return !e.email
        })
        puntos = puntos.map(e => {
            return { direccion: e.direccion, idZona: e.idZona, observacion: e.observacion, capacidad: e.capacidad }
        })

        signUp({ razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, puntos, codMagister, valorUnitario })
            .then(e => {

                console.log(e)
                if (e.status) {
                    assignCommercial(e.user._id, idVeo)
                    if (acceso == "cliente") {
                        if (clientes.length > 0) {
                            createMultipleUsers(clientes, e.user._id, e.user.nombre)
                                .then(res => {
                                    navigation.navigate("Home")
                                    Toast.show({ type: 'success', text1: 'Usuario guardado con exito' })

                                })
                                .catch(err2 => {
                                    console.log(err2)
                                    updateState({ cargando: false })
                                })
                        } else {
                            createMultiplePoints(puntos, e.user._id)
                                .then(res => {
                                    console.log(res)
                                    navigation.navigate("Home")
                                    Toast.show({ type: 'success', text1: 'Usuario guardado con exito' })
                                })
                                .catch(err2 => {
                                    console.log(err2)
                                    updateState({ cargando: false })
                                })
                        }
                    } else {
                        if (imagen.length === 0) {
                            navigation.navigate("Home")
                            Toast.show({ type: 'error', text1: 'Usuario eliminado con exito' })
                        } else {
                            avatar(imagen, e.user._id)
                        }
                    }
                } else {
                    updateState({ cargando: false });
                    Toast.show({ type: 'error', text1: 'Este email ya existe' })
                }
            })
            .catch(err => {
                console.log(err);
                updateState({ cargando: false });
            })
    }, [state.razon_social, state.cedula, state.direccion_factura, state.nombre, state.email, state.celular, state.tipo, state.acceso, state.codt, state.ubicaciones, state.imagen, state.codMagister, state.valorUnitario, state.idVeo, updateState, navigation]);
    const cambiarPass: CambiarPassFunction = useCallback(() => {
        const { email, password, confirmar } = state;
        if (password.length < 3 || confirmar.length < 3) {
            Alert.alert("Error", "Inserte ambos campos")
        }
        else if (password != confirmar) {
            Alert.alert("Error", "Las contraseñas no coinciden")
        } else {
            changePassword(email, password)
                .then(e => {
                    console.log(e)
                    if (e.status) {
                        Toast.show({ type: 'success', text1: 'Información editada' })
                        navigation.navigate("Home")
                    } else {
                        Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [state.email, state.password, state.confirmar, navigation]);

    const edicionExitosa: EdicionExitosaFunction = useCallback(async (nombre: string) => {
        updateState({ cargando: false });
        Toast.show({ type: 'success', text1: 'Usuario Editado' });
        navigation.navigate("Home");
    }, [updateState, navigation]);
    const loginExitoso: LoginExitosoFunction = useCallback(async (user: User) => {
        console.log(user);
        AsyncStorage.setItem('nombre', user.nombre || '');
        AsyncStorage.setItem('avatar', user.avatar ? JSON.stringify(user.avatar) : '');
        updateState({ cargando: false });
        Toast.show({ type: 'success', text1: 'Informacion guardado' });
        navigation.navigate("Home");
    }, [updateState, navigation]);
};

export default VerPerfil; 
