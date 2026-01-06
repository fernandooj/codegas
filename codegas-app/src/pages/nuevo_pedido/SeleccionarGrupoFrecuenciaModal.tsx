import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { GrupoFrecuencia } from '../frecuencia/types';

interface SeleccionarGrupoFrecuenciaModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (grupo: GrupoFrecuencia) => void;
    grupoSeleccionado: GrupoFrecuencia | null;
}

const SeleccionarGrupoFrecuenciaModal: React.FC<SeleccionarGrupoFrecuenciaModalProps> = ({
    visible,
    onClose,
    onSelect,
    grupoSeleccionado
}) => {
    const [grupos, setGrupos] = useState<GrupoFrecuencia[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            loadGrupos();
        }
    }, [visible]);

    const loadGrupos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('fre/grupos');
            if (response.data.status) {
                setGrupos(response.data.grupos || []);
            }
        } catch (error) {
            console.error('Error cargando grupos:', error);
            Toast.show({
                type: 'error',
                text1: 'Error al cargar grupos',
                text2: 'Intenta nuevamente'
            });
        } finally {
            setLoading(false);
        }
    };

    const diasSemanaNames = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const getIntervaloText = (intervalo: number): string => {
        if (intervalo === 1) return 'Semanal';
        if (intervalo === 2) return 'Cada 2 semanas';
        if (intervalo === 3) return 'Cada 3 semanas';
        return `Cada ${intervalo} semanas`;
    };

    const handleSelectGrupo = (grupo: GrupoFrecuencia) => {
        onSelect(grupo);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: '#fff'
            }}>
                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: '#dee2e6',
                    backgroundColor: '#002587'
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: '#fff'
                    }}>
                        Seleccionar Grupo
                    </Text>
                    <TouchableOpacity onPress={onClose} style={{
                        padding: 8
                    }}>
                        <FontAwesome name="times" style={{
                            fontSize: 20,
                            color: '#fff'
                        }} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {loading ? (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator size="large" color="#002587" />
                        <Text style={{
                            marginTop: 16,
                            fontSize: 16,
                            color: '#666'
                        }}>
                            Cargando grupos...
                        </Text>
                    </View>
                ) : grupos.length === 0 ? (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 40
                    }}>
                        <FontAwesome name="users" style={{
                            fontSize: 64,
                            color: '#ccc',
                            marginBottom: 16
                        }} />
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: '#666',
                            marginBottom: 8,
                            textAlign: 'center'
                        }}>
                            No hay grupos disponibles
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: '#999',
                            textAlign: 'center'
                        }}>
                            Crea un grupo de frecuencia primero
                        </Text>
                    </View>
                ) : (
                    <ScrollView style={{
                        flex: 1,
                        padding: 16
                    }}>
                        {grupos.map((grupo) => {
                            const isSelected = grupoSeleccionado?._id === grupo._id;
                            return (
                                <TouchableOpacity
                                    key={grupo._id}
                                    style={{
                                        backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                                        borderRadius: 12,
                                        padding: 16,
                                        marginBottom: 12,
                                        borderWidth: 2,
                                        borderColor: isSelected ? '#002587' : '#dee2e6',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 3
                                    }}
                                    onPress={() => handleSelectGrupo(grupo)}
                                    activeOpacity={0.7}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: 8
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: '700',
                                            color: '#212529',
                                            flex: 1
                                        }}>
                                            {grupo.nombre}
                                        </Text>
                                        {isSelected && (
                                            <View style={{
                                                backgroundColor: '#002587',
                                                borderRadius: 12,
                                                paddingHorizontal: 8,
                                                paddingVertical: 4,
                                                marginLeft: 8
                                            }}>
                                                <FontAwesome name="check" style={{
                                                    fontSize: 14,
                                                    color: '#fff'
                                                }} />
                                            </View>
                                        )}
                                    </View>

                                    <View style={{
                                        backgroundColor: '#002587',
                                        alignSelf: 'flex-start',
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 6,
                                        marginBottom: 8
                                    }}>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: 12,
                                            fontWeight: '600'
                                        }}>
                                            {grupo.tipo_frecuencia.toUpperCase()}
                                        </Text>
                                    </View>

                                    {grupo.tipo_frecuencia === 'semanal' && grupo.dia_semana && (
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 4
                                        }}>
                                            <FontAwesome name="calendar" style={{
                                                fontSize: 14,
                                                color: '#666',
                                                marginRight: 8
                                            }} />
                                            <Text style={{
                                                fontSize: 14,
                                                color: '#495057'
                                            }}>
                                                {diasSemanaNames[grupo.dia_semana]} - {getIntervaloText(grupo.intervalo_semanas || 1)}
                                            </Text>
                                        </View>
                                    )}

                                    {grupo.tipo_frecuencia === 'mensual' && grupo.dia_mes && grupo.dia_semana_mensual && (
                                        <>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 4
                                            }}>
                                                <FontAwesome name="calendar" style={{
                                                    fontSize: 14,
                                                    color: '#666',
                                                    marginRight: 8
                                                }} />
                                                <Text style={{
                                                    fontSize: 14,
                                                    color: '#495057'
                                                }}>
                                                    Día del mes: {grupo.dia_mes}
                                                </Text>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 4
                                            }}>
                                                <FontAwesome name="calendar-check-o" style={{
                                                    fontSize: 14,
                                                    color: '#666',
                                                    marginRight: 8
                                                }} />
                                                <Text style={{
                                                    fontSize: 14,
                                                    color: '#495057'
                                                }}>
                                                    Día de la semana: {diasSemanaNames[grupo.dia_semana_mensual]}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                )}
            </View>
        </Modal>
    );
};

export default SeleccionarGrupoFrecuenciaModal;
