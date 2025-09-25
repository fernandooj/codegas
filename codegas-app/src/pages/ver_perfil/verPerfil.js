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
import { style } from './style';
import { connect } from 'react-redux';
import axios from 'axios';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { Picker } from '@react-native-picker/picker';
import Footer from '../components/footer';
import TomarFoto from '../components/tomarFoto';
import Toast from 'react-native-toast-message';
import ModalZonas from '../editar_perfil/ModalZonas';
import ModalUbicacion from '../editar_perfil/ModalUbicacion';
import { accesos } from '../../utils/users_info'
import { DataContext } from "../../context/context"
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    getUsuariosAcceso,
    getUsuariosJerarquicos,
    getPerfil,
    cambiarContrasena,
    signUpUser,
    updateUserProfile,
    checkEmail,
    changePassword,
    createMultipleUsers,
    updateMultipleUsers,
    createMultiplePoints,
    assignCommercial,
    uploadAvatar,
    deleteUser,
    changeUserStatus,
    changeValorUnitario
} from '../../redux/actions/usuarioActions';

const verPerfil = (props) => {
    const context = useContext(DataContext);
    const { navigation } = props;
    const route = useRoute();
    const insets = useSafeAreaInsets();

    const [state, setState] = useState({
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
        modalAcceso: false,
        zonas: [],
        puntos: [],
        imagen: [],
        veos: [],
        estructuraJerarquica: { resultados: [] },
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
    });

    // Helper function to update state
    const updateState = (newState) => {
        setState(prevState => ({ ...prevState, ...newState }));
    };

    // Function to load veos (administradores) con estructura jerárquica
    const loadVeos = async () => {
        try {
            await props.getUsuariosAcceso(100, 0, 'administradores');
            // Los veos se cargarán automáticamente en el estado de Redux
            // y se pueden acceder desde props.usuariosAcceso
        } catch (error) {
            console.error('Error cargando veos:', error);
        }
    };

    // Effect para actualizar veos cuando cambien los usuariosAcceso de Redux
    useEffect(() => {
        if (props.usuariosAcceso && props.usuariosAcceso.length > 0) {
            // Crear estructura jerárquica de usuarios
            const estructuraJerarquica = crearEstructuraJerarquica(props.usuariosAcceso);
            updateState({ estructuraJerarquica });

            // Mantener la estructura plana para compatibilidad - incluir TODOS los usuarios
            const crearArrayPlano = (usuarios) => {
                let resultado = [];
                usuarios.forEach(usuario => {
                    // Agregar el usuario actual
                    resultado.push({ key: usuario._id, label: usuario.nombre });
                    // Si tiene hijos, agregarlos recursivamente
                    if (usuario.children && usuario.children.length > 0) {
                        resultado = resultado.concat(crearArrayPlano(usuario.children));
                    }
                });
                return resultado;
            };

            let veos = crearArrayPlano(props.usuariosAcceso);
            updateState({ veos });
        }
    }, [props.usuariosAcceso]);

    // Función para crear estructura jerárquica de usuarios usando los datos de la DB
    const crearEstructuraJerarquica = (usuarios) => {
        // Los usuarios ya vienen con la estructura jerárquica desde la DB
        // Solo necesitamos procesar la estructura children que ya viene
        const procesarUsuario = (usuario) => {
            return {
                nombre: usuario.nombre,
                _id: usuario._id,
                email: usuario.email,
                nivel: usuario.nivel || 0,
                es_padre: usuario.es_padre || false,
                ruta_jerarquica: usuario.ruta_jerarquica || usuario.nombre,
                hijos: usuario.children ? usuario.children.map(procesarUsuario) : []
            };
        };

        // Procesar todos los usuarios de nivel 0 (padres)
        const resultados = usuarios
            .filter(usuario => !usuario.idPadre) // Solo usuarios sin padre
            .map(procesarUsuario);

        return { resultados };
    };

    useEffect(() => {
        const loadData = async () => {
            // const accesoPerfil = await AsyncStorage.getItem('acceso');
            const { acceso: accesoPerfil, userId } = context;
            console.log('accesoPerfil inicial del context:', accesoPerfil);

            let acceso = accesoPerfil == 'despacho' ? 'cliente' : 'usuario';
            console.log('acceso calculado:', acceso);
            updateState({ accesoPerfil, acceso });

            // Si el acceso ya es comercial, cargar veos inmediatamente
            if (accesoPerfil === 'comercial') {
                await loadVeos();
            }


            /**
            * DEVUELVE EL LISTADO DE LAS ZONAS
            */
            axios.get('zon/zona').then((res) => {
                res.data.status && updateState({ zonas: res.data.zona });
            });

            const { params } = route;
            if (params.tipoAcceso) {
                updateState({ tipoAcceso: params.tipoAcceso });
                params.tipoAcceso == "solucion" && updateState({ acceso: "cliente" });
            }

            if (!params.tipoAcceso) {
                axios.get(`users/id/${userId}`).then((e) => {
                    const { user } = e.data;
                    axios.get(`pun/punto/byCliente/${userId}`).then(ubi => {
                        let ubicaciones = ubi.data.status ? ubi.data.puntos : []

                        // Mapear las ubicaciones correctamente como en editarPerfil
                        ubicaciones = ubicaciones.map(data => {
                            let data1 = userId;
                            let data2 = data.idCliente;
                            if (data1 === data2) {
                                return {
                                    direccion: data.direccion,
                                    email: undefined,
                                    idCliente: undefined,
                                    idZona: data.idzona,
                                    nombre: undefined,
                                    celular: undefined,
                                    nombreZona: data.nombrezona,
                                    observacion: data.observacion,
                                    capacidad: data.capacidad,
                                    _id: data._id
                                }
                            } else {
                                return {
                                    direccion: data.direccion,
                                    email: data.email,
                                    idCliente: data.idCliente,
                                    idZona: data.idzona,
                                    nombre: data.nombre,
                                    celular: data.celular,
                                    nombreZona: data.nombrezona,
                                    observacion: data.observacion,
                                    capacidad: data.capacidad,
                                    _id: data._id
                                }
                            }
                        });

                        updateState({
                            razon_social: user.razon_social ? user.razon_social : '',
                            cedula: user.cedula ? user.cedula : '',
                            email: user.email ? user.email : '',
                            nombre: user.nombre ? user.nombre : '',
                            password: user.password ? user.password : '',
                            celular: user.celular ? user.celular : '',
                            tipo: user.tipo ? user.tipo : '',
                            acceso: user.acceso ? user.acceso : '',
                            imagen: user.avatar ? [{ uri: user.avatar }] : [],
                            codt: user.codt ? user.codt : '',
                            valorUnitario: user.valorunitario ? user.valorunitario : '',
                            idUsuario: user._id ? user._id : '',
                            codMagister: user.codMagister ? user.codMagister : '',
                            editado: user.editado ? user.editado : false,
                            ubicaciones: ubicaciones,
                            direccion_factura: user.direccion_factura ? user.direccion_factura : "",
                        });
                    });
                });
            } else if (params.tipoAcceso == "editar") {
                axios.get(`users/id/${params.idUsuario}`).then(e => {
                    const { user } = e.data
                    axios.get(`pun/punto/byCliente/${params.idUsuario}`).then(ubi => {
                        let ubicaciones = ubi.data.status ? ubi.data.puntos : []
                        ubicaciones = ubicaciones.map(data => {
                            let data1 = params.idUsuario
                            let data2 = data.idCliente
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
                                }
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
                                }
                            }
                        });

                        updateState({
                            razon_social: user.razon_social ? user.razon_social : "",
                            cedula: user.cedula ? user.cedula : "",
                            email: user.email ? user.email : "",
                            nombre: user.nombre ? user.nombre : "",
                            password: user.password ? user.password : "",
                            celular: user.celular ? user.celular : "",
                            tipo: user.tipo ? user.tipo : "",
                            acceso: user.acceso ? user.acceso : "",
                            imagen: user.avatar ? [{ uri: user.avatar }] : [],
                            codt: user.codt ? user.codt : "",
                            ubicaciones,
                            activo: user.activo && user.activo,
                            idUsuario: user._id ? user._id : "",
                            veo: user.nombrepadre || "",
                            codMagister: user.codMagister ? user.codMagister : "",
                            valorUnitario: user.valorunitario,
                            direccion_factura: user.direccion_factura ? user.direccion_factura : "",
                        });
                    });
                });
            }
        };

        loadData();
    }, [context, navigation]);

    const renderPerfil = () => {
        let { razon_social, cedula, direccion_factura, email, nombre, celular, codt, acceso, valorUnitario, tipoAcceso, imagen, cargando, ubicaciones, tipo, activo, idUsuario, accesoPerfil, modalCliente, veos, veo, editado, codMagister } = state
        valorUnitario = valorUnitario ? valorUnitario.toString() : '';
        razon_social = razon_social ? razon_social.toUpperCase() : razon_social;
        email = email ? email.toUpperCase() : email;
        direccion_factura = direccion_factura ? direccion_factura.toUpperCase() : direccion_factura;
        nombre = nombre ? nombre.toUpperCase() : nombre;
        console.log('accesoPerfil', accesoPerfil);
        console.log('tipo en verPerfil:', tipo);
        return (
            <ScrollView keyboardDismissMode="on-drag" style={style.contenedorPerfil}>
                {tipoAcceso == "admin" ? <Text style={style.titulo}>Nuevo {acceso}</Text> : <Text style={style.titulo}>{nombre || 'Editar perfil'}</Text>}
                {/* ACCESO */}
                {
                    ((tipoAcceso == "admin" && accesoPerfil !== "despacho") || tipoAcceso == "editar")
                    && <View>
                        <Text style={style.textInfo}>Acceso</Text>
                        <TouchableOpacity
                            style={style.tipo}
                            onPress={() => setState(prev => ({ ...prev, modalAcceso: true }))}
                        >
                            <Text style={style.pickerText}>
                                {acceso ? accesos.find(item => item.value === acceso)?.label || 'Seleccionar acceso' : 'Seleccionar acceso'}
                            </Text>
                        </TouchableOpacity>
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
                    onBlur={email => verificaEmail(email)}
                    style={[
                        email.length < 3 ? [style.input, style.inputRequired] : style.input,
                        accesoPerfil === "veo" && style.inputDisabled
                    ]}
                    autoCapitalize="characters"
                    editable={accesoPerfil !== "veo"}
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
                <Text style={style.textInfo}>Cedula / Nit</Text>
                <TextInput
                    type='outlined'
                    placeholder="Cedula / Nit"
                    placeholderTextColor="#aaa"
                    keyboardType='numeric'
                    value={cedula}
                    onChangeText={cedula => updateState({ cedula })}
                    style={[
                        cedula.length < 5 ? [style.input, style.inputRequired] : style.input,
                        accesoPerfil === "veo" && style.inputDisabled
                    ]}
                    editable={accesoPerfil !== "veo"}
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

                {/* VEO - Solo mostrar cuando se viene desde la página de clientes */}
                {
                    acceso == "veo" && tipoAcceso == "editar"
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
                        <TouchableOpacity
                            style={[
                                style.tipo,
                                tipo && { backgroundColor: '#e3f2fd', borderColor: '#2196f3' }
                            ]}
                            onPress={() => {
                                Alert.alert(
                                    'Seleccionar Tipo',
                                    'Elija el tipo de cliente:',
                                    [
                                        { label: 'Residencial', value: 'Residencial' },
                                        { label: 'Comercial', value: 'Comercial' },
                                        { label: 'Industrial', value: 'Industrial' }
                                    ].map(item => ({
                                        text: item.label,
                                        onPress: () => updateState({ tipo: item.value })
                                    }))
                                );
                            }}
                        >
                            <Text style={[
                                style.pickerText,
                                tipo && { color: '#2196f3', fontWeight: '600' }
                            ]}>
                                {tipo || 'Seleccionar tipo'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                }

                {modalCliente && (
                    <View style={style.modalAcceso}>
                        <View style={style.subModalAcceso}>
                            <TouchableOpacity
                                style={style.btnModalClose}
                                onPress={() => updateState({ modalCliente: false })}
                            >
                                <Text style={style.iconCerrar}>×</Text>
                            </TouchableOpacity>
                            <Text style={style.tituloModal}>Seleccionar Veo</Text>
                            <ScrollView style={{ maxHeight: 400 }}>
                                {state.estructuraJerarquica.resultados.map(usuario =>
                                    renderUsuarioJerarquico(usuario)
                                )}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {
                    accesoPerfil == "comercial" || acceso == "cliente" || tipoAcceso == "admin"
                    && <View>
                        <Text style={style.textInfo}>Comercial Veo</Text>
                        <TouchableOpacity
                            onPress={async () => {
                                if (accesoPerfil !== "cliente") {
                                    await loadVeos();
                                    updateState({ modalCliente: true });
                                }
                            }}
                            style={style.inputVeo}>
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
                            <Text style={style.textGuardar}>{cargando ? "Editando" : "Editar"}</Text>
                        </TouchableOpacity>
                        : (tipoAcceso == "editar" && (accesoPerfil == "admin" || accesoPerfil == "despacho"))
                            ? <TouchableOpacity style={style.btnGuardar} onPress={() => editarUsuario("editar")}>
                                {cargando && <ActivityIndicator style={{ marginRight: 5 }} />}
                                <Text style={style.textGuardar}>{cargando ? "Editando" : "Editar Usuario"}</Text>
                            </TouchableOpacity>
                            : (accesoPerfil == "admin" || accesoPerfil == "despacho")
                            && <TouchableOpacity style={style.btnGuardar} onPress={() => handleSubmit()}>
                                {cargando && <ActivityIndicator style={{ marginRight: 5 }} />}
                                <Text style={style.textGuardar}>{cargando ? "Guardando" : "Guardar"}</Text>
                            </TouchableOpacity>
                }
                {
                    (tipoAcceso == "editar" && (accesoPerfil == "admin" || accesoPerfil == "veo"))
                    && <TouchableOpacity style={[style.btnGuardar, { backgroundColor: "#feac00", marginBottom: 70 }]} onPress={() => navigation.navigate("chart", { idUsuario })}>
                        <Text style={style.textGuardar}>{"Graficos"}</Text>
                    </TouchableOpacity>
                }

            </ScrollView>

        )
    }

    const cambiarValorUnitario = async () => {
        let { valorUnitario, idUsuario } = state
        try {
            const res = await changeValorUnitario(valorUnitario, idUsuario);
            if (res.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Valor unitario editado',
                    visibilityTime: 3000,
                })
            }
        } catch (error) {
            console.error('Error al cambiar valor unitario:', error);
        }
    }

    const verificaEmail = async () => {
        const { email } = state;
        try {
            const res = await checkEmail(email);
            if (res.data.status) {
                Toast.show({
                    type: 'error',
                    text1: 'Este email ya existe!',
                    visibilityTime: 3000,
                })
                // updateState({email:""})
            }
        } catch (error) {
            console.error('Error al verificar email:', error);
        }
    }

    const asignarVeo = (idVeo) => {
        const { veos } = state
        let veo = veos.filter(e => {
            return e.key == idVeo
        })

        // Validar que el veo existe antes de acceder a sus propiedades
        if (veo.length > 0 && veo[0]) {
            updateState({ veo: veo[0].label, modalCliente: false, idVeo })
            Toast.show({
                type: 'success',
                text1: 'Veo seleccionado',
                visibilityTime: 3000,
            })
        } else {
            console.error('Veo no encontrado:', { idVeo, veos })
            Toast.show({
                type: 'error',
                text1: 'Error: Usuario no encontrado',
                visibilityTime: 3000,
            })
        }
    }

    const eliminarUsuario = () => {
        const { nombre, idUsuario } = state
        Alert.alert(
            'Seguro desea eliminar',
            `al usuario ${nombre}`,
            [
                { text: 'Confirmar', onPress: () => confirmar() },

            ],
            { cancelable: false }
        )
        const confirmar = async () => {
            try {
                const res = await deleteUser(idUsuario);
                if (res.status) {
                    navigation.navigate("Home")
                    Toast.show({
                        type: 'success',
                        text1: 'Usuario eliminado con exito',
                        visibilityTime: 3000,
                    })
                }
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
            }
        }
    }

    const cambiarEstadoUsuario = () => {
        const { nombre, idUsuario, activo } = state

        Alert.alert(
            `Seguro desea ${activo ? "Desactivar" : "Activar"}`,
            `al usuario ${nombre}`,
            [
                { text: 'Confirmar', onPress: () => confirmar() },

            ],
            { cancelable: false }
        )
        const confirmar = async () => {
            try {
                const res = await changeUserStatus(idUsuario, !activo);
                if (res.status) {
                    navigation.navigate("clientes")
                    Toast.show({
                        type: 'success',
                        text1: 'Usuario guardado con exito',
                        visibilityTime: 3000,
                    })
                }
            } catch (error) {
                console.error('Error al cambiar estado del usuario:', error);
            }
        }
    }

    const actualizaUbicacion = () => {
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
        ubicaciones.push(data)
        updateState({ ubicaciones })
    }

    const actualizaArrayUbicacion = (type, value, key) => {
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
    }


    const actualizaZona = (id, nombre) => {
        const { key, ubicaciones } = state
        ubicaciones[key].idZona = id
        ubicaciones[key].nombreZona = nombre
        updateState({ ubicaciones, modalZona: false })
    }


    const renderFormPass = () => {
        const { password, confirmar, showLoading, cargando } = state
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
        </View>
    }

    const guardarUbicacion = () => {
        let { ubicaciones } = state
        ubicaciones = ubicaciones.filter((e, index) => {
            return e.direccion != undefined
        })
        ubicaciones = ubicaciones.filter((e, index) => {
            return e.direccion != ""
        })
        const isEmpty = Object.values(ubicaciones).every(x => {
            if (!x.idZona) {
                return false
            } else {
                return true
            }
        })

        !isEmpty ? alert("Zonas son obligatorios") : updateState({ ubicaciones, modalUbicacion: false })
    }

    const avatar = async (imagen, idUser) => {
        updateState({ showLoading: true })
        let data = new FormData();
        imagen = imagen[0]
        state.tipoAcceso ? data.append('crear', true) : null
        data.append('imagen', imagen);
        data.append('imagenOtroUsuario', true);
        data.append('idUser', idUser);

        try {
            const res = await uploadAvatar(data);
            if (res.status) {
                if (state.tipoAcceso) {
                    alert("Usuario guardado con exito")
                    navigation.navigate("Perfil")
                } else {
                    loginExitoso(res.user)
                }
            }
        } catch (err) {
            updateState({ cargando: false })
            console.error('Error al subir avatar:', err);
        }
    }

    const handleSubmit = (esEditar) => {
        const { razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, imagen, ubicaciones, valorUnitario } = state
        if (acceso == "cliente") {
            if (razon_social == "" || direccion_factura == "" || nombre == "" || email == "" || tipo == "" || acceso == "usuario" || ubicaciones.length < 1) {
                Alert.alert(
                    'Todos los campos son obligatorios',
                    '',
                    [
                    ],
                    { cancelable: false }
                )
            } else if (celular.length < 7) {
                Toast.show({
                    type: 'error',
                    text1: 'Telefono incorrecto',
                    visibilityTime: 3000,
                })

            } else if (cedula.length < 5) {
                Toast.show({
                    type: 'error',
                    text1: 'Cedula incorrecta',
                    visibilityTime: 3000,
                })
            } else {
                esEditar == "editar" ? editarUsuario() : guardarUsuario()
            }
        } else {
            if (cedula == "" || email == "" || nombre == "" || acceso == "usuario" || celular == "" || !imagen) {
                Alert.alert(
                    'Todos los campos son obligatorios',
                    "",
                    [
                    ],
                    { cancelable: false }
                )
            } else {
                esEditar == "editar" ? editarUsuario() : guardarUsuario()
            }
        }
    }

    const eliminarUbicacion = (key) => {
        let { ubicaciones, ubicacionesEliminadas } = state
        ubicaciones.filter((e, index) => {
            if (index == key) {
                ubicacionesEliminadas.push(e._id)
            }
        })
        ubicaciones = ubicaciones.filter((e, index) => {
            return index != key
        })

        updateState({ ubicaciones, ubicacionesEliminadas })
    }

    const guardarUsuario = async (e) => {
        updateState({ cargando: true })
        const { razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, ubicaciones, imagen, codMagister, valorUnitario, idVeo } = state

        // Verificar si el email ya existe antes de guardar
        try {
            const emailCheck = await checkEmail(email);
            if (emailCheck.exists) {
                updateState({ cargando: false });
                Toast.show({
                    type: 'error',
                    text1: 'Este email ya existe. Por favor, use otro email.',
                    visibilityTime: 3000,
                });
                return;
            }
        } catch (error) {
            console.error('Error al verificar email:', error);
            updateState({ cargando: false });
            Toast.show({
                type: 'error',
                text1: 'Error al verificar email. Intente nuevamente.',
                visibilityTime: 3000,
            });
            return;
        }
        let clientes = ubicaciones.filter(e => {
            return e.email
        })
        let puntos = ubicaciones.filter(e => {
            return !e.email
        })
        puntos = puntos.map(e => {
            return { direccion: e.direccion, idZona: e.idZona, observacion: e.observacion, capacidad: e.capacidad }
        })

        // Preparar datos para enviar, incluyendo idPadre si se seleccionó un veo
        const datosUsuario = {
            razon_social,
            cedula,
            direccion_factura,
            nombre,
            email,
            celular,
            tipo,
            acceso,
            codt,
            puntos,
            codMagister,
            valorUnitario: valorUnitario && valorUnitario !== "" ? parseInt(valorUnitario) : 0
        };

        // Agregar idPadre si se seleccionó un veo
        if (idVeo) {
            datosUsuario.idPadre = idVeo;
        }

        try {
            const e = await signUpUser(datosUsuario);
            if (e.status) {
                // El backend devuelve el ID del usuario en e.code cuando es exitoso
                const userId = parseInt(e.code);
                const userName = nombre; // Usar el nombre del estado

                if (idVeo) {
                    // await assignCommercial(userId, idVeo);
                }

                if (acceso == "cliente") {
                    if (clientes.length > 0) {
                        try {
                            await createMultipleUsers(clientes, userId, userName);
                            navigation.navigate("Home")
                            Toast.show({
                                type: 'success',
                                text1: 'Usuario guardado con exito',
                                visibilityTime: 3000,
                            })
                        } catch (err2) {
                            updateState({ cargando: false })
                        }
                    } else {
                        try {
                            const res = await createMultiplePoints(puntos, userId);
                            navigation.navigate("Home")
                            Toast.show({
                                type: 'success',
                                text1: 'Usuario guardado con exito',
                                visibilityTime: 3000,
                            })
                        } catch (err2) {
                            updateState({ cargando: false })
                        }
                    }
                } else {
                    if (imagen.length === 0) {
                        navigation.navigate("Home")
                        Toast.show({
                            type: 'success',
                            text1: 'Usuario eliminado con exito',
                            visibilityTime: 3000,
                        })
                    } else {
                        avatar(imagen, userId)
                    }
                }
            } else {
                updateState({ cargando: false })
                Toast.show({
                    type: 'error',
                    text1: 'Este email ya existe',
                    visibilityTime: 3000,
                })
            }
        } catch (err) {
            updateState({ cargando: false })
        }
    }

    // Función para convertir imagen a base64
    const convertImageToBase64 = async (imageUri) => {
        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result;
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error convirtiendo imagen a base64:', error);
            return null;
        }
    };

    const editarUsuario = async (e) => {
        updateState({ cargando: true })
        const { razon_social, cedula, ubicaciones, direccion_factura, nombre, email, celular, tipo, acceso, codt, imagen, editaAvatar, idUsuario, ubicacionesEliminadas, editado, codMagister, valorUnitario, idVeo } = state

        // Verificar si el email ya existe en otro usuario antes de editar
        try {
            const emailCheck = await checkEmail(email);
            if (emailCheck.exists && emailCheck.user._id !== idUsuario) {
                updateState({ cargando: false });
                Toast.show({
                    type: 'error',
                    text1: 'Este email ya existe en otro usuario. Por favor, use otro email.',
                    visibilityTime: 3000,
                });
                return;
            }
        } catch (error) {
            console.error('Error al verificar email:', error);
            updateState({ cargando: false });
            Toast.show({
                type: 'error',
                text1: 'Error al verificar email. Intente nuevamente.',
                visibilityTime: 3000,
            });
            return;
        }
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

        // Convertir imagen a base64 si existe y se editó el avatar
        let imagenBase64 = null;
        console.log('Frontend - editaAvatar:', editaAvatar, 'imagen:', imagen ? 'EXISTE' : 'NO EXISTE', 'imagen.length:', imagen ? imagen.length : 0);
        console.log('Frontend - Tipo de imagen:', typeof imagen, 'Es array:', Array.isArray(imagen), 'Imagen completa:', imagen);

        // Verificar si hay imagen para convertir (puede ser array, string o objeto con uri)
        const tieneImagen = editaAvatar && imagen && (
            (Array.isArray(imagen) && imagen.length > 0) ||
            (typeof imagen === 'string' && imagen.trim() !== '') ||
            (typeof imagen === 'object' && imagen.uri && imagen.uri.trim() !== '')
        );

        if (tieneImagen) {
            console.log('Frontend - Convirtiendo imagen a base64...');
            // Obtener la URI según el tipo de dato
            let imagenUri;
            if (Array.isArray(imagen)) {
                imagenUri = imagen[0].uri || imagen[0];
            } else if (typeof imagen === 'string') {
                imagenUri = imagen;
            } else if (typeof imagen === 'object' && imagen.uri) {
                imagenUri = imagen.uri;
            }

            console.log('Frontend - URI a convertir:', imagenUri);
            imagenBase64 = await convertImageToBase64(imagenUri);
            console.log('Frontend - Imagen convertida a base64:', imagenBase64 ? 'EXITOSO' : 'FALLÓ');
        } else {
            console.log('Frontend - No se convierte imagen:', {
                editaAvatar,
                tieneImagen: tieneImagen,
                esArray: Array.isArray(imagen),
                esString: typeof imagen === 'string',
                imagenLength: imagen ? (Array.isArray(imagen) ? imagen.length : imagen.length || 'N/A') : 'N/A'
            });
        }

        // Preparar datos para enviar, incluyendo idPadre si se seleccionó un veo
        const datosUsuario = {
            editado,
            puntos,
            puntosNuevos,
            razon_social,
            cedula,
            direccion_factura,
            nombre,
            email,
            celular,
            tipo,
            acceso,
            codt,
            ubicacionesEliminadas,
            codMagister,
            valorUnitario: valorUnitario && valorUnitario !== "" ? parseInt(valorUnitario) : 0
        };

        // Agregar imagen si se editó el avatar
        if (imagenBase64) {
            datosUsuario.imagen = imagenBase64;
        }

        // Agregar idPadre si se seleccionó un veo
        if (idVeo) {
            datosUsuario.idPadre = idVeo;
        }

        console.log('Frontend - Enviando datosUsuario:', {
            tieneImagen: !!datosUsuario.imagen,
            imagenLength: datosUsuario.imagen ? datosUsuario.imagen.length : 0,
            editaAvatar
        });

        try {
            const e = await updateUserProfile(idUsuario, datosUsuario);
            if (acceso == "cliente") {
                ////////////////////////////////////////////        EDITO LOS CLIENTES
                if (clientes.length > 0) {
                    try {
                        await updateMultipleUsers(clientes, idUsuario, e.user.nombre);
                        // AsyncStorage.setItem('nombre', e.user.nombre)
                        navigation.navigate("Home")
                        Toast.show({
                            type: 'success',
                            text1: 'Usuario guardado con exito',
                            visibilityTime: 3000,
                        })
                    } catch (err2) {
                        updateState({ cargando: false })
                    }
                }
                ////////////////////////////////////////////        INSERTO LOS CLIENTES
                if (clientesNuevos.length > 0) {
                    try {
                        await createMultipleUsers(clientesNuevos, idUsuario, e.user.nombre);
                        // AsyncStorage.setItem('nombre', e.user.nombre)
                        // navigation.navigate("Home")
                        Toast.show({
                            type: 'success',
                            text1: 'Usuario guardado con exito',
                            visibilityTime: 3000,
                        })
                    } catch (err2) {
                        updateState({ cargando: false })
                    }
                }

                if (editado == false) {
                    updateState({ showPass: true, cargando: false })
                } else {
                    // AsyncStorage.setItem('nombre', e.user.nombre)
                    navigation.navigate("Home")
                    Toast.show({
                        type: 'success',
                        text1: 'Usuario editado con exito',
                        visibilityTime: 3000,
                    })
                    updateState({ cargando: false })
                }

            } else {
                edicionExitosa(nombre, e.user.avatar)
            }
        } catch (err) {
            updateState({ cargando: false })
        }
    }

    const cambiarPass = async () => {
        const { email, password, confirmar } = state
        if (password.length < 3 || confirmar.length < 3) {
            alert("Inserte ambos campos")
        }
        else if (password != confirmar) {
            alert("Las contraseñas no coinciden")
        } else {
            try {
                const e = await changePassword(email, password);
                if (e.status) {
                    Toast.show({
                        type: 'success',
                        text1: 'Informacion editada',
                        visibilityTime: 3000,
                    })
                    navigation.navigate("Home")
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Tenemos un problema, intentelo mas tarde',
                        visibilityTime: 3000,
                    })
                }
            } catch (err) {
            }
        }
    }

    const edicionExitosa = async (nombre, avatar = null) => {
        updateState({ cargando: false })

        // Actualizar contexto y estado local si es edición de perfil propio
        if (!state.tipoAcceso || state.tipoAcceso === "") {
            // Actualizar contexto en tiempo real con el nuevo avatar
            if (context.updateUserData && avatar) {
                context.updateUserData({
                    nombre: nombre,
                    avatar: avatar
                });
            }

            // Actualizar estado local con el nuevo avatar
            if (avatar) {
                updateState({ imagen: [{ uri: avatar }] });
            }
        }

        Toast.show({
            type: 'success',
            text1: 'Usuario editado',
            visibilityTime: 3000,
        })
        navigation.navigate("Home")
    }

    const loginExitoso = async (user) => {
        // AsyncStorage.setItem('nombre', user.nombre)
        // AsyncStorage.setItem('avatar', user.avatar)
        updateState({ cargando: false })
        Toast.show({
            type: 'success',
            text1: 'Usuario guardado con exito',
            visibilityTime: 3000,
        })
        navigation.navigate("Home")
        // updateState({userId:user._id, cargando:false, nombre:user.nombre, email:user.email, acceso:user.acceso, avatar:user.avatar ?user.avatar :"null"})
    }

    // Componente para renderizar usuarios jerárquicamente
    const renderUsuarioJerarquico = (usuario, nivel = 0) => {
        const paddingLeft = nivel * 20;
        const esPadre = usuario.es_padre || nivel === 0;
        const tieneHijos = usuario.hijos && usuario.hijos.length > 0;

        return (
            <View key={usuario._id}>
                <TouchableOpacity
                    style={[
                        style.btnAcceso,
                        {
                            paddingLeft: paddingLeft + 15,
                            backgroundColor: esPadre ? '#f0f8ff' : '#ffffff',
                            borderLeftWidth: esPadre ? 3 : 0,
                            borderLeftColor: esPadre ? '#00218b' : 'transparent'
                        }
                    ]}
                    onPress={() => {
                        asignarVeo(usuario._id);
                    }}
                >
                    <Text style={esPadre ? style.textAccesoPadre : style.textAccesoHijo}>
                        {nivel > 0 ? '└─ ' : ''}{usuario.nombre}
                        {usuario.email && <Text style={{ fontSize: 12, color: '#999' }}> ({usuario.email})</Text>}
                    </Text>
                    {usuario.ruta_jerarquica && usuario.ruta_jerarquica !== usuario.nombre && (
                        <Text style={{ fontSize: 10, color: '#666', fontStyle: 'italic' }}>
                            {usuario.ruta_jerarquica}
                        </Text>
                    )}
                </TouchableOpacity>
                {/* Renderizar hijos recursivamente */}
                {tieneHijos && usuario.hijos.map(hijo => renderUsuarioJerarquico(hijo, nivel + 1))}
            </View>
        );
    };

    const renderModalAcceso = () => {
        return (
            <View style={style.modalAcceso}>
                <View style={style.subModalAcceso}>
                    <TouchableOpacity
                        style={style.btnModalClose}
                        onPress={() => updateState({ modalAcceso: false })}
                    >
                        <Text style={style.iconCerrar}>×</Text>
                    </TouchableOpacity>
                    <Text style={style.tituloModal}>Seleccionar Acceso</Text>
                    <ScrollView style={{ maxHeight: 300 }}>
                        {accesos.map((item) => (
                            <TouchableOpacity
                                key={item.key}
                                style={style.btnAcceso}
                                onPress={async () => {
                                    updateState({ acceso: item.value, modalAcceso: false });
                                    // Cargar veos solo cuando se selecciona comercial
                                    if (item.value === 'comercial') {
                                        await loadVeos();
                                    }
                                }}
                            >
                                <Text style={style.textAcceso}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        );
    };

    const { modalUbicacion, showPass, modalAcceso } = state

    return (
        <View style={[style.container, { paddingTop: insets.top }]}>
            <ImageBackground style={[style.container]} source={require('../../assets/img/pg1/fondo2.jpg')} >
                {modalAcceso ? renderModalAcceso() : null}

                {/* Modal de Ubicaciones */}
                <ModalUbicacion
                    visible={modalUbicacion}
                    ubicaciones={state.ubicaciones}
                    modalZona={state.modalZona}
                    zonas={state.zonas}
                    idZona={state.idZona}
                    terminoBuscador={state.terminoBuscador}
                    activeScroll={state.activeScroll}
                    selectedUbicacionKey={state.key || 0}
                    onClose={() => updateState({ modalUbicacion: false })}
                    onSave={guardarUbicacion}
                    onAddUbicacion={actualizaUbicacion}
                    onDeleteUbicacion={eliminarUbicacion}
                    onUpdateUbicacion={actualizaArrayUbicacion}
                    onOpenZonas={(key) => updateState({ modalZona: true, key })}
                    onCloseZonas={() => updateState({ modalZona: false })}
                    onSelectZona={actualizaZona}
                    onUpdateTermino={(termino) => updateState({ terminoBuscador: termino })}
                    onUpdateActiveScroll={(active) => updateState({ activeScroll: active })}
                />
                {
                    showPass
                        ? renderFormPass()
                        : renderPerfil()
                }
                <Footer navigation={navigation} />
            </ImageBackground>
        </View>
    )
}

const mapState = state => {
    return {
        perfil: state.usuario.perfil.user,
        usuariosAcceso: state.usuario.usuariosAcceso || [],
    };
};

const mapDispatch = dispatch => {
    return {
        getPerfil: () => {
            dispatch(getPerfil());
        },
        cambiarContrasena: (password, email) => {
            dispatch(cambiarContrasena(password, email));
        },
        getUsuariosAcceso: (limit, start, acceso) => {
            dispatch(getUsuariosAcceso(limit, start, acceso));
        },
        getUsuariosJerarquicos: (limit, start, acceso) => {
            dispatch(getUsuariosJerarquicos(limit, start, acceso));
        }
    };
};

verPerfil.defaultProps = {
    perfil: { categoria: [] }
}

export default connect(mapState, mapDispatch)(verPerfil)