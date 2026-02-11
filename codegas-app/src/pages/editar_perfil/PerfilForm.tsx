import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Alert,
    Modal,
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Toast from 'react-native-toast-message';
import { style } from './style';
import { accesos } from '../../utils/constants';
import TomarFoto from '../components/tomarFoto';

interface Veo {
    key: string;
    _id: string;
    label: string;
    idPadre: string | null;
    email?: string;
    children: Veo[];
}

interface Ubicacion {
    direccion?: string;
    nombre?: string;
    email?: string;
    celular?: string;
    idZona?: string;
    nombreZona?: string;
    capacidad?: string;
    lat?: string;
    lng?: string;
    activo: boolean;
    nuevo?: boolean;
    acceso: string;
    _id?: string;
}

interface PerfilFormProps {
    // Estado del formulario
    razon_social: string;
    cedula: string;
    direccion_factura: string;
    email: string;
    nombre: string;
    celular: string;
    tipo: string;
    acceso: string;
    codt: string;
    valorUnitario: string;
    codMagister: string;
    imagen: any[];
    ubicaciones: Ubicacion[];
    veo: string;
    activo: boolean;
    cargando: boolean;
    tipoAcceso: string;
    accesoPerfil: string;
    idUsuario: string;
    veos: Veo[];

    // Control de scroll
    scrollEnabled?: boolean;

    // Funciones de actualización
    onUpdateState: (updates: any) => void;
    onVerificaEmail: () => void;
    onEditarUsuario: () => void;
    onCambiarEstadoUsuario: () => void;
    onEliminarUsuario: () => void;
    onHandleSubmit: (esEditar?: string) => void;
    onNavigate: (screen: string, params?: any) => void;
}

const PerfilForm: React.FC<PerfilFormProps> = ({
    razon_social,
    cedula,
    direccion_factura,
    email,
    nombre,
    celular,
    tipo,
    acceso,
    codt,
    valorUnitario = '',
    codMagister,
    imagen,
    ubicaciones,
    veo,
    activo,
    cargando,
    tipoAcceso,
    accesoPerfil,
    idUsuario,
    veos,
    scrollEnabled = true,
    onUpdateState,
    onVerificaEmail,
    onEditarUsuario,
    onCambiarEstadoUsuario,
    onEliminarUsuario,
    onHandleSubmit,
    onNavigate
}) => {
    const [modalAccesoVisible, setModalAccesoVisible] = useState(false);
    const [opcionesAccesoFiltradas, setOpcionesAccesoFiltradas] = useState<typeof accesos>([]);

    const valorUnitarioStr = valorUnitario ? valorUnitario.toString() : '';
    const razonSocialUpper = razon_social ? razon_social.toUpperCase() : razon_social;
    const emailUpper = email ? email.toUpperCase() : email;
    const direccionFacturaUpper = direccion_factura ? direccion_factura.toUpperCase() : direccion_factura;
    const nombreUpper = nombre ? nombre.toUpperCase() : nombre;
    console.log('valorUnitario', valorUnitario);
    return (
        <View style={style.formContainer}>
            {/* Header moderno */}
            <View style={style.headerContainer}>
                <Text style={style.headerTitle}>
                    {tipoAcceso === "admin" ? `Nuevo ${acceso}` :
                        tipoAcceso === "crear" ? "Crear Usuario" :
                            nombre ? `${nombre}` : 'Editar Usuario'}
                </Text>
                <Text style={style.headerSubtitle}>
                    Complete la información del usuario
                </Text>
            </View>

            <ScrollView
                keyboardDismissMode="on-drag"
                style={style.scrollViewContainer}
                contentContainerStyle={style.scrollViewContent}
                scrollEnabled={scrollEnabled}
            >
                {/* ACCESO */}
                {
                    // Mostrar campo solo si:
                    // 1. Es admin y no es despacho
                    // 2. Es modo editar y NO es cliente
                    // 3. Es modo crear Y el usuario tiene acceso admin (desde página usuarios)
                    // 4. Es modo editar Y el usuario tiene acceso admin (desde página usuarios)
                    ((tipoAcceso === "admin" && accesoPerfil !== "despacho") ||
                        (tipoAcceso === "editar" && acceso !== "cliente") ||
                        (tipoAcceso === "editar" && accesoPerfil === "admin") ||
                        (tipoAcceso === "crear" && accesoPerfil === "admin"))
                    && <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>
                            Tipo de Acceso
                        </Text>
                        <TouchableOpacity
                            style={style.selectorContainer}
                            onPress={() => {
                                // Filtrar opciones según el contexto
                                let opcionesAcceso = accesos;

                                // Si viene desde la página usuarios (accesoPerfil === "admin"), quitar opción "cliente"
                                if (accesoPerfil === "admin") {
                                    opcionesAcceso = accesos.filter(item => item.value !== "cliente");
                                }
                                // Si es edición y el usuario no es cliente, quitar opción "cliente"
                                else if (tipoAcceso === "editar" && acceso !== "cliente") {
                                    opcionesAcceso = accesos.filter(item => item.value !== "cliente");
                                }

                                // Guardar opciones filtradas y abrir modal
                                setOpcionesAccesoFiltradas(opcionesAcceso);
                                setModalAccesoVisible(true);
                            }}
                        >
                            <Text style={style.selectorText}>
                                {accesos.find(item => item.value === acceso)?.label || 'Seleccionar acceso'}
                            </Text>
                            <FontAwesome
                                name="chevron-down"
                                size={16}
                                color="#666"
                                style={style.selectorIcon}
                            />
                        </TouchableOpacity>
                    </View>
                }

                {/* EMAIL */}
                <View style={style.fieldContainer}>
                    <Text style={style.fieldLabel}>
                        Email
                    </Text>
                    <TextInput
                        placeholder="Ingrese el email"
                        keyboardType='email-address'
                        placeholderTextColor="#aaa"
                        value={email}
                        onChangeText={email => onUpdateState({ email })}
                        onBlur={email => onVerificaEmail()}
                        style={[
                            style.fieldInput,
                            email.length < 3 && style.fieldInputError,
                            accesoPerfil === "veo" && style.fieldInputDisabled
                        ]}
                        autoCapitalize="none"
                        editable={accesoPerfil !== "veo"}
                    />
                </View>

                {/* RAZON SOCIAL */}
                {
                    acceso === "cliente"
                    && <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>
                            Razón Social
                        </Text>
                        <TextInput
                            placeholder="Ingrese la razón social"
                            placeholderTextColor="#aaa"
                            autoCapitalize="characters"
                            value={razon_social}
                            onChangeText={razon_social => onUpdateState({ razon_social })}
                            style={[
                                style.fieldInput,
                                razon_social.length < 3 && style.fieldInputError
                            ]}
                        />
                    </View>
                }

                {/* CEDULA */}
                <View style={style.fieldContainer}>
                    <Text style={style.fieldLabel}>
                        Cédula / NIT
                    </Text>
                    <TextInput
                        placeholder="Ingrese la cédula o NIT"
                        placeholderTextColor="#aaa"
                        keyboardType='numeric'
                        value={cedula}
                        onChangeText={cedula => onUpdateState({ cedula })}
                        style={[
                            style.fieldInput,
                            cedula.length < 5 && style.fieldInputError,
                            accesoPerfil === "veo" && style.fieldInputDisabled
                        ]}
                        editable={accesoPerfil !== "veo"}
                    />
                </View>

                {/* DIRECCION */}
                {
                    acceso === "cliente"
                    && <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>
                            Dirección de Facturación
                        </Text>
                        <TextInput
                            placeholder="Ingrese la dirección de facturación"
                            placeholderTextColor="#aaa"
                            autoCapitalize="characters"
                            value={direccion_factura}
                            onChangeText={direccion_factura => onUpdateState({ direccion_factura })}
                            style={[
                                style.fieldInput,
                                direccion_factura.length < 3 && style.fieldInputError
                            ]}
                        />
                    </View>
                }

                {/* UBICACION */}
                {
                    acceso === "cliente"
                    && <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>
                            Ubicación entrega
                        </Text>
                        <TouchableOpacity
                            style={[
                                style.selectorContainer,
                                ubicaciones.length < 1 && style.fieldInputError,
                                tipoAcceso === "crear" && { opacity: 0.5, backgroundColor: '#f5f5f5' }
                            ]}
                            onPress={() => {
                                if (tipoAcceso === "crear") {
                                    // En modo creación, mostrar mensaje informativo
                                    Toast.show({
                                        type: 'info',
                                        text1: 'Primero crea el usuario',
                                        text2: 'Las ubicaciones se agregarán después de crear el usuario'
                                    });
                                } else {
                                    // En modo edición, abrir modal de ubicaciones
                                    onUpdateState({ modalUbicacion: true });
                                }
                            }}
                            disabled={tipoAcceso === "crear"}
                        >
                            <Text style={[
                                style.selectorText,
                                ubicaciones.length < 1 && { color: '#dc3545' },
                                tipoAcceso === "crear" && { color: '#999' }
                            ]}>
                                {tipoAcceso === "crear"
                                    ? "Disponible después de crear el usuario"
                                    : ubicaciones.length < 1
                                        ? "Agregar ubicación de entrega"
                                        : `Tienes ${ubicaciones.length} ubicaciones guardadas`
                                }
                            </Text>
                            <FontAwesome
                                name={tipoAcceso === "crear" ? "lock" : "chevron-right"}
                                size={16}
                                color={tipoAcceso === "crear" ? "#999" : "#666"}
                                style={style.selectorIcon}
                            />
                        </TouchableOpacity>
                    </View>
                }

                {/* CODT */}
                {
                    acceso === "cliente"
                    && <>
                        <Text style={style.textInfo}>Codt</Text>
                        <TextInput
                            placeholder="CODT"
                            autoCapitalize='none'
                            placeholderTextColor="#aaa"
                            value={codt}
                            onChangeText={codt => onUpdateState({ codt })}
                            style={style.input}
                            editable={accesoPerfil == "cliente" ? false : true}
                        />
                    </>
                }

                {/* NOMBRES */}
                <Text style={style.textInfo}>Nombres</Text>
                <TextInput
                    placeholder="Nombres"
                    autoCapitalize='none'
                    placeholderTextColor="#aaa"
                    value={nombre}
                    onChangeText={nombre => onUpdateState({ nombre })}
                    style={nombre.length < 3 ? [style.input, style.inputRequired] : style.input}
                />

                {/* CELULAR */}
                <Text style={style.textInfo}>Celular</Text>
                <TextInput
                    placeholder="Celular"
                    autoCapitalize='none'
                    placeholderTextColor="#aaa"
                    value={celular}
                    onChangeText={celular => onUpdateState({ celular })}
                    style={celular.length < 7 ? [style.input, style.inputRequired] : style.input}
                />

                {/* VEO - Solo mostrar cuando se viene desde la página de clientes */}
                {
                    acceso === "veo" && tipoAcceso === "editar"
                    && <><Text style={style.textInfo}>Codigo Magister</Text>
                        <TextInput
                            placeholder="Codigo Magister"
                            autoCapitalize='none'
                            placeholderTextColor="#aaa"
                            value={codMagister}
                            onChangeText={codMagister => onUpdateState({ codMagister })}
                            style={codMagister.length < 3 ? [style.input, style.inputRequired] : style.input}
                        />
                    </>
                }

                {/* VALOR UNITARIO */}
                {
                    acceso === "cliente" && (
                        <>
                            <Text style={style.textInfo}>Valor Unitario</Text>
                            <TextInput
                                placeholder="Valor Unitario"
                                autoCapitalize='none'
                                placeholderTextColor="#aaa"
                                value={valorUnitario ? String(valorUnitario) : ''}
                                onChangeText={valorUnitario => onUpdateState({ valorUnitario })}
                                style={valorUnitario && String(valorUnitario).length < 3 ? [style.input, style.inputRequired] : style.input}
                                editable={accesoPerfil == "cliente" ? false : true}
                            />
                        </>
                    )
                }

                {/* TIPO */}
                {
                    acceso === "cliente"
                    && <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>
                            Tipo de Cliente
                        </Text>
                        <TouchableOpacity
                            style={[
                                style.modernSelectorContainer,
                                tipo && style.modernSelectorSelected
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
                                        onPress: () => onUpdateState({ tipo: item.value })
                                    }))
                                );
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={[
                                    style.modernSelectorText,
                                    tipo && style.modernSelectorTextSelected
                                ]}>
                                    {tipo || 'Seleccionar tipo'}
                                </Text>
                                {tipo && (
                                    <Text style={style.modernSelectorSecondaryText}>
                                        Tipo seleccionado
                                    </Text>
                                )}
                            </View>
                            <View style={[
                                style.modernSelectorIconContainer,
                                tipo && style.modernSelectorIconContainerSelected
                            ]}>
                                <FontAwesome
                                    name="chevron-down"
                                    size={14}
                                    style={[
                                        style.modernSelectorIcon,
                                        tipo && style.modernSelectorIconSelected
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                }

                {/* VEO SELECTOR */}
                {
                    (acceso === "veo" || acceso === "comercial" || acceso === "cliente")
                    && <View style={style.veoContainer}>
                        <Text style={style.veoLabel}>
                            Comercial VEO
                        </Text>
                        <TouchableOpacity
                            onPress={() => accesoPerfil == "cliente" ? null : onUpdateState({ modalCliente: true })}
                            style={[
                                style.veoSelector,
                                veo && style.veoSelectorSelected
                            ]}
                        >
                            <View style={style.veoSelectorContent}>
                                <Text style={[
                                    style.veoSelectorText,
                                    veo && style.veoSelectorTextSelected
                                ]}>
                                    {veo || "Seleccionar VEO"}
                                </Text>
                                {veo && (
                                    <Text style={style.veoSelectorSecondaryText}>
                                        VEO asignado
                                    </Text>
                                )}
                            </View>
                            <View style={[
                                style.veoSelectorIconContainer,
                                veo && style.veoSelectorIconContainerSelected
                            ]}>
                                <FontAwesome
                                    name="chevron-down"
                                    size={14}
                                    style={[
                                        style.veoSelectorIcon,
                                        veo && style.veoSelectorIconSelected
                                    ]}
                                />
                            </View>
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
                            imagenes={(imagen) => { onUpdateState({ imagen, editaAvatar: true, showLoading: false }) }}
                        />
                    </View>
                }

                {/* BOTON ACTUALIZAR USUARIO */}
                {
                    (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "despacho"))
                    && <View style={style.updateUserContainer}>
                        <TouchableOpacity
                            style={style.updateUserButton}
                            onPress={() => onEditarUsuario()}
                        >
                            {cargando && <ActivityIndicator color="white" style={style.updateUserButtonLoading} />}
                            <Text style={style.updateUserButtonText}>
                                {cargando ? "Guardando..." : "Actualizar Usuario"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                }

                {/* BOTONES DE ESTADO Y ACCIONES */}
                {
                    (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "despacho" || accesoPerfil === "comercial"))
                    && <View style={style.actionButtonsContainer}>
                        {/* BOTON CAMBIAR ESTADO */}
                        <TouchableOpacity
                            style={[
                                style.actionButton,
                                activo ? style.actionButtonDeactivate : style.actionButtonActivate
                            ]}
                            onPress={() => onCambiarEstadoUsuario()}
                        >
                            <FontAwesome
                                name={activo ? "ban" : "check"}
                                size={16}
                                color="white"
                                style={style.actionButtonIcon}
                            />
                            <Text style={style.actionButtonText}>
                                {activo ? "Desactivar" : "Activar"}
                            </Text>
                        </TouchableOpacity>

                        {/* BOTON ELIMINAR */}
                        <TouchableOpacity
                            style={[
                                style.actionButton,
                                style.actionButtonDelete
                            ]}
                            onPress={() => onEliminarUsuario()}
                        >
                            <FontAwesome
                                name="trash"
                                size={16}
                                color="white"
                                style={style.actionButtonIcon}
                            />
                            <Text style={style.actionButtonText}>
                                Eliminar
                            </Text>
                        </TouchableOpacity>
                    </View>
                }

                {/* BOTONES DE ACCIÓN PRINCIPALES */}
                {
                    // Mostrar botones principales solo para perfil propio o modo crear/admin
                    (tipoAcceso === "" || (tipoAcceso === "admin" || tipoAcceso === "crear")) && (
                        <View style={style.mainButtonsContainer}>
                            {/* BOTON GUARDAR/CREAR PRINCIPAL */}
                            <TouchableOpacity
                                style={style.primaryButton}
                                onPress={() => tipoAcceso === "" ? onHandleSubmit("editar") : onHandleSubmit()}
                            >
                                {cargando && <ActivityIndicator color="white" style={style.primaryButtonLoading} />}
                                <Text style={style.primaryButtonText}>
                                    {cargando
                                        ? "Guardando..."
                                        : (tipoAcceso === ""
                                            ? "Guardar Cambios"
                                            : "Crear Usuario"
                                        )
                                    }
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )
                }

                {/* BOTONES SECUNDARIOS */}
                <View style={style.secondaryButtonsContainer}>
                    {
                        (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "veo"))
                        && <TouchableOpacity
                            style={[
                                style.secondaryButton,
                                style.secondaryButtonCharts
                            ]}
                            onPress={() => onNavigate("chart", { idUsuario })}
                        >
                            <FontAwesome
                                name="bar-chart"
                                size={16}
                                color="white"
                                style={style.secondaryButtonIcon}
                            />
                            <Text style={style.secondaryButtonText}>
                                Ver Gráficos
                            </Text>
                        </TouchableOpacity>
                    }

                    {
                        (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "despacho"))
                        && <TouchableOpacity
                            style={[
                                style.secondaryButton,
                                style.secondaryButtonReview
                            ]}
                            onPress={() => onNavigate("puntos", { idUsuario })}
                        >
                            <FontAwesome
                                name="clipboard"
                                size={16}
                                color="white"
                                style={style.secondaryButtonIcon}
                            />
                            <Text style={style.secondaryButtonText}>
                                Crear Revisión
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
            </ScrollView>

            {/* Modal de selección de acceso */}
            <Modal
                visible={modalAccesoVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalAccesoVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        width: '100%',
                        maxWidth: 400,
                        maxHeight: '70%',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                        elevation: 5,
                    }}>
                        {/* Header del modal */}
                        <View style={{
                            borderBottomWidth: 1,
                            borderBottomColor: '#e9ecef',
                            padding: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#333'
                            }}>
                                Seleccionar Tipo de Acceso
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalAccesoVisible(false)}
                                style={{
                                    padding: 5
                                }}
                            >
                                <FontAwesome name="times" style={{ fontSize: 24, color: '#666' }} />
                            </TouchableOpacity>
                        </View>

                        {/* Lista de opciones */}
                        <ScrollView
                            style={{ maxHeight: 400 }}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={true}
                        >
                            <View style={{ padding: 15 }}>
                                {opcionesAccesoFiltradas.map((item, index) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={{
                                            padding: 16,
                                            backgroundColor: acceso === item.value ? '#007bff' : '#f8f9fa',
                                            borderRadius: 8,
                                            marginBottom: 10,
                                            borderWidth: 1,
                                            borderColor: acceso === item.value ? '#007bff' : '#e9ecef',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                        onPress={() => {
                                            onUpdateState({ acceso: item.value });
                                            setModalAccesoVisible(false);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: acceso === item.value ? '600' : 'normal',
                                            color: acceso === item.value ? 'white' : '#333'
                                        }}>
                                            {item.label}
                                        </Text>
                                        {acceso === item.value && (
                                            <FontAwesome name="check" style={{ fontSize: 16, color: 'white' }} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PerfilForm;
