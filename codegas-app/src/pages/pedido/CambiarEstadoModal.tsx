import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { EstadoPedido, AccesoUsuario } from './types';

interface CambiarEstadoModalProps {
    visible: boolean;
    estado?: EstadoPedido;
    entregado?: boolean;
    acceso?: AccesoUsuario;
    getEstadoColor: (estado: EstadoPedido) => string;
    getEstadoBackgroundColor: (estado: EstadoPedido) => string;
    onEstadoChange: (nuevoEstado: EstadoPedido) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

const CambiarEstadoModal: React.FC<CambiarEstadoModalProps> = ({
    visible,
    estado,
    entregado,
    acceso,
    getEstadoColor,
    getEstadoBackgroundColor,
    onEstadoChange,
    onConfirm,
    onCancel
}) => {
    if (!visible) {
        return null;
    }

    // Retorna solo el contenido JSX, NO un Modal completo
    return (
        <View style={{
            backgroundColor: '#f8f9fa',
            borderRadius: 12,
            padding: 20,
            marginTop: 20,
            borderLeftWidth: 4,
            borderLeftColor: '#007bff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }}>
            {/* Header con botón atrás */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
            }}>
                <TouchableOpacity
                    onPress={onCancel}
                    style={{
                        padding: 8,
                        borderRadius: 20,
                        backgroundColor: '#f1f3f4',
                    }}
                    activeOpacity={0.7}
                >
                    <FontAwesome name="arrow-left" style={{ fontSize: 16, color: '#333' }} />
                </TouchableOpacity>

                <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#333',
                    flex: 1,
                    textAlign: 'center',
                    marginHorizontal: 16,
                }}>
                    Gestión de Estado
                </Text>

                <View style={{ width: 32 }} />
            </View>

            {/* Opciones de estado */}
            <View style={{ gap: 12 }}>
                {/* Estado Activo */}
                <TouchableOpacity
                    style={{
                        backgroundColor: estado === "activo" ? getEstadoBackgroundColor("activo") : '#f8f9fa',
                        borderColor: estado === "activo" ? getEstadoColor("activo") : '#dee2e6',
                        borderWidth: 2,
                        borderRadius: 12,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                    onPress={() => onEstadoChange("activo")}
                    activeOpacity={0.8}
                >
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: getEstadoColor("activo"),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                    }}>
                        <FontAwesome name="check-circle" style={{ fontSize: 20, color: 'white' }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 }}>
                            Activo
                        </Text>
                        <Text style={{ fontSize: 12, color: '#666' }}>
                            El pedido está activo y en proceso
                        </Text>
                    </View>
                    {estado === "activo" && (
                        <FontAwesome name="check" style={{ fontSize: 18, color: getEstadoColor("activo") }} />
                    )}
                </TouchableOpacity>

                {/* Estado Inactivo */}
                <TouchableOpacity
                    style={{
                        backgroundColor: estado === "innactivo" ? getEstadoBackgroundColor("innactivo") : '#f8f9fa',
                        borderColor: estado === "innactivo" ? getEstadoColor("innactivo") : '#dee2e6',
                        borderWidth: 2,
                        borderRadius: 12,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        opacity: (entregado == true && estado == "activo" && (acceso !== "admin")) ? 0.5 : 1,
                    }}
                    onPress={() => (entregado == true && estado == "activo" && (acceso !== "admin")) ? null : onEstadoChange("innactivo")}
                    activeOpacity={0.8}
                    disabled={entregado == true && estado == "activo" && (acceso !== "admin")}
                >
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: getEstadoColor("innactivo"),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                    }}>
                        <FontAwesome name="times-circle" style={{ fontSize: 20, color: 'white' }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 }}>
                            Inactivo
                        </Text>
                        <Text style={{ fontSize: 12, color: '#666' }}>
                            El pedido está pausado o cancelado
                        </Text>
                    </View>
                    {estado === "innactivo" && (
                        <FontAwesome name="check" style={{ fontSize: 18, color: getEstadoColor("innactivo") }} />
                    )}
                </TouchableOpacity>

                {/* Estado Espera */}
                <TouchableOpacity
                    style={{
                        backgroundColor: estado === "espera" ? getEstadoBackgroundColor("espera") : '#f8f9fa',
                        borderColor: estado === "espera" ? getEstadoColor("espera") : '#dee2e6',
                        borderWidth: 2,
                        borderRadius: 12,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        opacity: (entregado == true && estado == "activo" && (acceso !== "admin")) ? 0.5 : 1,
                    }}
                    onPress={() => (entregado == true && estado == "activo" && (acceso !== "admin")) ? null : onEstadoChange("espera")}
                    activeOpacity={0.8}
                    disabled={entregado == true && estado == "activo" && (acceso !== "admin")}
                >
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: getEstadoColor("espera"),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                    }}>
                        <FontAwesome name="pause-circle" style={{ fontSize: 20, color: 'white' }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 }}>
                            En Espera
                        </Text>
                        <Text style={{ fontSize: 12, color: '#666' }}>
                            El pedido está en lista de espera
                        </Text>
                    </View>
                    {estado === "espera" && (
                        <FontAwesome name="check" style={{ fontSize: 18, color: getEstadoColor("espera") }} />
                    )}
                </TouchableOpacity>
            </View>

            {/* Botón de confirmar */}
            <TouchableOpacity
                style={{
                    backgroundColor: '#007bff',
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                }}
                onPress={onConfirm}
                activeOpacity={0.8}
            >
                <FontAwesome name="save" style={{ fontSize: 14, color: 'white', marginRight: 6 }} />
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                    Cambiar Estado
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default CambiarEstadoModal;