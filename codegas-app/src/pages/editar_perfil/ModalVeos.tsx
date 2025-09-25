import React, { useCallback, useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    Animated,
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { style } from './style';

interface Veo {
    key: string;
    _id: string;
    label: string;
    idPadre: string | null;
    email?: string;
    children: Veo[];
}

interface ModalVeosProps {
    visible: boolean;
    veos: Veo[];
    terminoBuscador: string;
    idVeo: string;
    onClose: () => void;
    onSelectVeo: (idVeo: string) => void;
    onUpdateTermino: (termino: string) => void;
}

const ModalVeos: React.FC<ModalVeosProps> = ({
    visible,
    veos,
    terminoBuscador,
    idVeo,
    onClose,
    onSelectVeo,
    onUpdateTermino
}) => {
    const [modalAnimation] = useState(new Animated.Value(0));
    const [overlayAnimation] = useState(new Animated.Value(0));

    // Effect para debug: mostrar VEOs cuando se abre el modal
    useEffect(() => {
        if (visible) {
            console.log('🔍 ModalVeos - Modal abierto, VEOs recibidos del backend:');
            console.log('🔍 ModalVeos - Cantidad de VEOs:', veos.length);
            console.log('🔍 ModalVeos - VEOs completos:', JSON.stringify(veos, null, 2));
            console.log('🔍 ModalVeos - Primer VEO (ejemplo):', veos[0]);
            if (veos.length > 0) {
                console.log('🔍 ModalVeos - Estructura del primer VEO:');
                console.log('  - key:', veos[0].key);
                console.log('  - _id:', veos[0]._id);
                console.log('  - label:', veos[0].label);
                console.log('  - idPadre:', veos[0].idPadre);
                console.log('  - email:', veos[0].email);
                console.log('  - children count:', veos[0].children?.length || 0);
                if (veos[0].children && veos[0].children.length > 0) {
                    console.log('  - primer child:', veos[0].children[0]);
                }
            }
        }
    }, [visible, veos]);

    // Effect para animaciones del modal
    useEffect(() => {
        if (visible) {
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
    }, [visible]);

    const closeModal = useCallback(() => {
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
            onClose();
        });
    }, [onClose]);

    const handleSelectVeo = useCallback((veoKey: string) => {
        console.log('🔍 ModalVeos - VEO seleccionado:');
        console.log('🔍 ModalVeos - veoKey recibido:', veoKey);

        // Función recursiva para buscar VEO en todos los niveles
        const buscarVeoRecursivamente = (veosArray: Veo[], targetKey: string): Veo | null => {
            for (let veo of veosArray) {
                // Comparar keys como strings
                if (String(veo.key) === String(targetKey)) {
                    return veo;
                }
                // Buscar recursivamente en children
                if (veo.children && veo.children.length > 0) {
                    const encontrado = buscarVeoRecursivamente(veo.children, targetKey);
                    if (encontrado) {
                        return encontrado;
                    }
                }
            }
            return null;
        };

        // Buscar el VEO completo para mostrar más información
        const veoSeleccionado = buscarVeoRecursivamente(veos, veoKey);
        if (veoSeleccionado) {
            console.log('🔍 ModalVeos - VEO encontrado:', veoSeleccionado);
            console.log('🔍 ModalVeos - Datos del VEO seleccionado:');
            console.log('  - ID:', veoSeleccionado._id);
            console.log('  - Nombre:', veoSeleccionado.label);
            console.log('  - Email:', veoSeleccionado.email);
            console.log('  - ID Padre:', veoSeleccionado.idPadre);
        } else {
            console.log('❌ ModalVeos - VEO no encontrado con key:', veoKey);
        }

        onSelectVeo(veoKey);
        closeModal();
    }, [onSelectVeo, closeModal, veos]);

    // Función para renderizar el árbol completo de VEOs usando los children del backend
    const renderVeoTree = useCallback(() => {

        // Filtrar VEOs basándose en el término de búsqueda (recursivamente)
        const filtrarVeosRecursivamente = (veosArray: Veo[]): Veo[] => {
            return veosArray.reduce((acc, veo) => {
                const coincideNombre = terminoBuscador === '' ||
                    veo.label.toLowerCase().includes(terminoBuscador.toLowerCase());

                // Filtrar children recursivamente
                const childrenFiltrados = veo.children && veo.children.length > 0 ?
                    filtrarVeosRecursivamente(veo.children) : [];

                // Incluir el VEO si coincide el nombre o tiene hijos que coinciden
                if (coincideNombre || childrenFiltrados.length > 0) {
                    acc.push({
                        ...veo,
                        children: childrenFiltrados
                    });
                }

                return acc;
            }, [] as Veo[]);
        };

        // Obtener solo los VEOs padre (aquellos sin idPadre)
        const veosPadre = veos.filter(veo =>
            !veo.idPadre ||
            veo.idPadre === null ||
            veo.idPadre === undefined ||
            veo.idPadre === '' ||
            veo.idPadre === 'null' ||
            veo.idPadre === 'undefined'
        );


        // Aplicar filtro si hay término de búsqueda
        const veosFiltrados = terminoBuscador === '' ? veosPadre : filtrarVeosRecursivamente(veosPadre);


        return veosFiltrados.map((veo, index) => renderVeoItem(veo, index, 0));
    }, [veos, terminoBuscador]);

    const renderVeoItem = useCallback((veo: Veo, index: number, nivel: number = 0) => {
        const paddingLeft = nivel * 25;
        const tieneHijos = veo.children && veo.children.length > 0;
        const esSeleccionado = idVeo === veo.key;


        // Generar el prefijo visual para el árbol
        const getTreePrefix = (nivel: number, esUltimo: boolean = false) => {
            if (nivel === 0) return '';
            return esUltimo ? '└── ' : '├── ';
        };

        return (
            <View key={veo.key || index}>
                <TouchableOpacity
                    onPress={() => handleSelectVeo(veo.key)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 16,
                        paddingHorizontal: 16,
                        paddingLeft: 16 + (paddingLeft * 0.8), // Reducir un poco el padding para que no se vea tan separado
                        backgroundColor: esSeleccionado ? '#e8f5e8' : '#fff',
                        borderRadius: 12,
                        marginVertical: 2,
                        marginHorizontal: 8,
                        borderWidth: esSeleccionado ? 2 : 1,
                        borderColor: esSeleccionado ? '#4caf50' : '#f0f0f0',
                        shadowColor: esSeleccionado ? '#4caf50' : '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: esSeleccionado ? 0.15 : 0.05,
                        shadowRadius: 4,
                        elevation: esSeleccionado ? 4 : 1
                    }}
                    activeOpacity={0.7}
                >
                    {/* Prefijo visual del árbol */}
                    {nivel > 0 && (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 8,
                            minWidth: nivel * 20
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: '#2196f3',
                                fontWeight: 'bold',
                                fontFamily: 'monospace'
                            }}>
                                {getTreePrefix(nivel)}
                            </Text>
                        </View>
                    )}

                    {/* Icono principal */}
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: esSeleccionado ? '#4caf50' : (tieneHijos ? '#2196f3' : '#ff9800'),
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 14,
                        shadowColor: esSeleccionado ? '#4caf50' : (tieneHijos ? '#2196f3' : '#ff9800'),
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 3
                    }}>
                        <Text style={{
                            fontSize: 18,
                            color: '#fff'
                        }}>
                            {tieneHijos ? '👥' : '👤'}
                        </Text>
                    </View>

                    {/* Información del VEO */}
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: esSeleccionado ? '700' : '600',
                            color: esSeleccionado ? '#2e7d32' : '#333',
                            marginBottom: 4
                        }}>
                            {veo.label}
                        </Text>

                        {tieneHijos && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 2
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: '#2196f3',
                                    fontWeight: '600'
                                }}>
                                    🏢 {veo.children.length} subordinado{veo.children.length !== 1 ? 's' : ''}
                                </Text>
                            </View>
                        )}

                        {veo.email && (
                            <Text style={{
                                fontSize: 12,
                                color: '#666',
                                fontStyle: 'italic'
                            }}>
                                📧 {veo.email}
                            </Text>
                        )}
                    </View>

                    {/* Indicadores de estado */}
                    <View style={{ alignItems: 'center' }}>
                        {esSeleccionado && (
                            <View style={{
                                backgroundColor: '#4caf50',
                                borderRadius: 12,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                marginBottom: 4
                            }}>
                                <Text style={{
                                    fontSize: 10,
                                    color: '#fff',
                                    fontWeight: '700'
                                }}>
                                    ✓ SELECCIONADO
                                </Text>
                            </View>
                        )}

                        {tieneHijos && (
                            <View style={{
                                backgroundColor: '#e3f2fd',
                                borderRadius: 10,
                                paddingHorizontal: 6,
                                paddingVertical: 3
                            }}>
                                <Text style={{
                                    fontSize: 9,
                                    color: '#1976d2',
                                    fontWeight: '700'
                                }}>
                                    JEFE
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Renderizar hijos recursivamente */}
                {tieneHijos && veo.children.map((hijo: Veo, childIndex: number) => {
                    return renderVeoItem(hijo, childIndex, nivel + 1);
                })}
            </View>
        );
    }, [idVeo, handleSelectVeo]);

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={closeModal}
        >
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
                            Seleccionar VEO Comercial
                        </Text>
                        <TouchableOpacity
                            onPress={closeModal}
                            style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: 15,
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#e9ecef'
                            }}
                        >
                            <FontAwesome name="times" size={16} color="#6c757d" />
                        </TouchableOpacity>
                    </View>

                    {/* Barra de búsqueda */}
                    <View style={{ padding: 20, paddingBottom: 10 }}>
                        <TextInput
                            placeholder="Buscar VEO..."
                            value={terminoBuscador}
                            onChangeText={onUpdateTermino}
                            style={{
                                backgroundColor: '#f8f9fa',
                                borderWidth: 1,
                                borderColor: '#e9ecef',
                                borderRadius: 8,
                                paddingHorizontal: 15,
                                paddingVertical: 12,
                                fontSize: 16,
                                color: '#333'
                            }}
                        />
                    </View>

                    {/* Lista de VEOs en formato árbol */}
                    <ScrollView style={{ maxHeight: 400 }}>
                        {veos.length === 0 ? (
                            <View style={{
                                padding: 40,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FontAwesome
                                    name="users"
                                    size={48}
                                    color="#e9ecef"
                                    style={{ marginBottom: 16 }}
                                />
                                <Text style={{
                                    fontSize: 16,
                                    color: '#666',
                                    textAlign: 'center'
                                }}>
                                    No hay VEOs disponibles
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#999',
                                    textAlign: 'center',
                                    marginTop: 8
                                }}>
                                    Contacta al administrador para asignar VEOs
                                </Text>
                            </View>
                        ) : (
                            renderVeoTree()
                        )}
                    </ScrollView>

                    {/* Footer */}
                    <View style={{
                        padding: 20,
                        borderTopWidth: 1,
                        borderTopColor: '#e9ecef'
                    }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#6c757d',
                                borderRadius: 8,
                                padding: 15
                            }}
                            onPress={closeModal}
                        >
                            <Text style={{
                                color: '#fff',
                                textAlign: 'center',
                                fontSize: 16,
                                fontWeight: '600'
                            }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default ModalVeos;
