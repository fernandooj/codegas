import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';

interface ModalOrdenamientoProps {
    visible: boolean;
    onClose: () => void;
    ordenPor: string;
    tipoOrden: string;
    onOrdenPorChange: (ordenPor: string) => void;
    onTipoOrdenChange: (tipoOrden: string) => void;
    onApply: () => void;
}

const ModalOrdenamiento: React.FC<ModalOrdenamientoProps> = ({
    visible,
    onClose,
    ordenPor,
    tipoOrden,
    onOrdenPorChange,
    onTipoOrdenChange,
    onApply
}) => {
    const opcionesOrdenamiento = [
        { key: 'fecha_creacion', label: 'Fecha creación', icon: 'calendar' },
        { key: 'razon_social', label: 'Razón social', icon: 'building' },
        { key: 'nombre_cliente', label: 'Nombre cliente', icon: 'user' },
        { key: 'fecha_solicitud', label: 'Fecha solicitud', icon: 'clock-o' },
        { key: 'precio', label: 'Precio', icon: 'dollar' },
        { key: 'cantidad', label: 'Cantidad', icon: 'cubes' },
        { key: 'vehiculo', label: 'Vehículo', icon: 'truck' }
    ];

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    width: '90%',
                    maxWidth: 400,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                }}>
                    {/* Header */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e9ecef',
                        paddingBottom: 15
                    }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: '#333'
                        }}>
                            Ordenar por
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 15,
                                backgroundColor: '#f8f9fa'
                            }}
                        >
                            <FontAwesome name="close" style={{ fontSize: 16, color: '#666' }} />
                        </TouchableOpacity>
                    </View>

                    {/* Opciones de ordenamiento */}
                    <View style={{ marginBottom: 20 }}>
                        {opcionesOrdenamiento.map((opcion) => (
                            <TouchableOpacity
                                key={opcion.key}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 12,
                                    paddingHorizontal: 16,
                                    marginBottom: 8,
                                    borderRadius: 8,
                                    backgroundColor: ordenPor === opcion.key ? '#e3f2fd' : '#f8f9fa',
                                    borderWidth: ordenPor === opcion.key ? 2 : 1,
                                    borderColor: ordenPor === opcion.key ? '#2196f3' : '#e9ecef'
                                }}
                                onPress={() => onOrdenPorChange(opcion.key)}
                            >
                                <FontAwesome
                                    name={opcion.icon}
                                    style={{
                                        fontSize: 16,
                                        color: ordenPor === opcion.key ? '#2196f3' : '#666',
                                        marginRight: 12,
                                        width: 20
                                    }}
                                />
                                <Text style={{
                                    fontSize: 16,
                                    color: ordenPor === opcion.key ? '#2196f3' : '#333',
                                    fontWeight: ordenPor === opcion.key ? '600' : '400',
                                    flex: 1
                                }}>
                                    {opcion.label}
                                </Text>
                                {ordenPor === opcion.key && (
                                    <FontAwesome
                                        name="check"
                                        style={{ fontSize: 16, color: '#2196f3' }}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Selector de tipo de orden */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: 10
                        }}>
                            Tipo de orden:
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: 10,
                                    paddingHorizontal: 16,
                                    borderRadius: 8,
                                    backgroundColor: tipoOrden === 'DESC' ? '#e3f2fd' : '#f8f9fa',
                                    borderWidth: tipoOrden === 'DESC' ? 2 : 1,
                                    borderColor: tipoOrden === 'DESC' ? '#2196f3' : '#e9ecef'
                                }}
                                onPress={() => onTipoOrdenChange('DESC')}
                            >
                                <FontAwesome
                                    name="sort-amount-desc" as any
                                    style={{
                                        fontSize: 14,
                                        color: tipoOrden === 'DESC' ? '#2196f3' : '#666',
                                        marginRight: 8
                                    }}
                                />
                                <Text style={{
                                    fontSize: 14,
                                    color: tipoOrden === 'DESC' ? '#2196f3' : '#333',
                                    fontWeight: tipoOrden === 'DESC' ? '600' : '400'
                                }}>
                                    Descendente
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: 10,
                                    paddingHorizontal: 16,
                                    borderRadius: 8,
                                    backgroundColor: tipoOrden === 'ASC' ? '#e3f2fd' : '#f8f9fa',
                                    borderWidth: tipoOrden === 'ASC' ? 2 : 1,
                                    borderColor: tipoOrden === 'ASC' ? '#2196f3' : '#e9ecef'
                                }}
                                onPress={() => onTipoOrdenChange('ASC')}
                            >
                                <FontAwesome
                                    name="sort-amount-asc" as any
                                    style={{
                                        fontSize: 14,
                                        color: tipoOrden === 'ASC' ? '#2196f3' : '#666',
                                        marginRight: 8
                                    }}
                                />
                                <Text style={{
                                    fontSize: 14,
                                    color: tipoOrden === 'ASC' ? '#2196f3' : '#333',
                                    fontWeight: tipoOrden === 'ASC' ? '600' : '400'
                                }}>
                                    Ascendente
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Botones de acción */}
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 8,
                                backgroundColor: '#6c757d',
                                alignItems: 'center'
                            }}
                            onPress={onClose}
                        >
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 8,
                                backgroundColor: '#28a745',
                                alignItems: 'center'
                            }}
                            onPress={onApply}
                        >
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                                Aplicar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalOrdenamiento;
