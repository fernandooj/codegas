import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';

interface NovedadModalProps {
    visible: boolean;
    onClose: () => void;
    novedad: string;
    onNovedadChange: (text: string) => void;
    onSave: () => void;
}

const NovedadModal: React.FC<NovedadModalProps> = ({
    visible,
    onClose,
    novedad,
    onNovedadChange,
    onSave
}) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
            }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 24,
                    width: '100%',
                    maxWidth: 400,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.25,
                    shadowRadius: 20,
                    elevation: 10,
                }}>
                    {/* Header */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20,
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="exclamation-circle" style={{ fontSize: 20, color: '#dc3545', marginRight: 10 }} />
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '700',
                                color: '#333',
                            }}>
                                Motivo de Inactividad
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                padding: 8,
                                borderRadius: 20,
                                backgroundColor: '#f8f9fa',
                            }}
                            activeOpacity={0.7}
                        >
                            <FontAwesome name="times" style={{ fontSize: 16, color: '#6c757d' }} />
                        </TouchableOpacity>
                    </View>

                    {/* Descripción */}
                    <Text style={{
                        fontSize: 14,
                        color: '#666',
                        marginBottom: 15,
                        lineHeight: 20,
                    }}>
                        Por favor, describe el motivo por el cual este pedido será marcado como inactivo:
                    </Text>

                    {/* Input de novedad mejorado */}
                    <View style={{
                        borderWidth: 2,
                        borderColor: novedad.length >= 5 ? '#28a745' : '#dee2e6',
                        borderRadius: 8,
                        marginBottom: 20,
                    }}>
                        <TextInput
                            placeholder="Describe el motivo de la inactividad..."
                            placeholderTextColor="#aaa"
                            autoCapitalize='sentences'
                            onChangeText={onNovedadChange}
                            value={novedad}
                            multiline={true}
                            numberOfLines={4}
                            style={{
                                padding: 15,
                                fontSize: 16,
                                color: '#333',
                                textAlignVertical: 'top',
                                minHeight: 100,
                            }}
                        />
                    </View>

                    {/* Contador de caracteres */}
                    <Text style={{
                        fontSize: 12,
                        color: novedad.length >= 5 ? '#28a745' : '#dc3545',
                        textAlign: 'right',
                        marginBottom: 20,
                    }}>
                        {novedad.length}/5 caracteres mínimos
                    </Text>

                    {/* Botones de acción */}
                    <View style={{
                        flexDirection: 'row',
                        gap: 12,
                    }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: '#6c757d',
                                paddingVertical: 15,
                                borderRadius: 8,
                                alignItems: 'center',
                            }}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: novedad.length >= 5 ? '#dc3545' : '#6c757d',
                                paddingVertical: 15,
                                borderRadius: 8,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                opacity: novedad.length >= 5 ? 1 : 0.6,
                            }}
                            onPress={() => novedad.length < 5 ? Alert.alert("Error", "Inserta alguna novedad") : onSave()}
                            activeOpacity={0.8}
                            disabled={novedad.length < 5}
                        >
                            <FontAwesome name="save" style={{ fontSize: 14, color: 'white', marginRight: 8 }} />
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                                Guardar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default NovedadModal;
