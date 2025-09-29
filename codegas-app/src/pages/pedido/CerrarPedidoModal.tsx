import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    Alert,
    Keyboard,
    Dimensions,
    Image,
    PermissionsAndroid,
    Platform
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { style } from './style';
import TomarFoto from '../components/tomarFoto';

interface CerrarPedidoModalProps {
    visible: boolean;
    onClose: () => void;
    pedidoId?: string; // Agregar pedidoId como prop
    entregado: boolean;
    imagenCerrar?: string;
    kilos?: string;
    factura?: string;
    valor_total?: string;
    remision?: string;
    forma_pago?: string;
    valor_unitario?: string;
    onCerrarPedido: (data: CerrarPedidoData, pedidoId?: string) => void;
    onGuardarNovedad: (novedad: string, pedidoId?: string) => void;
}

interface CerrarPedidoData {
    kilos: string;
    factura: string;
    valor_total: string;
    remision: string;
    forma_pago: string;
    novedad: string;
    imagen?: string;
}

const { width, height } = Dimensions.get('window');

const CerrarPedidoModal: React.FC<CerrarPedidoModalProps> = ({
    visible,
    onClose,
    pedidoId, // Agregar pedidoId
    entregado,
    imagenCerrar,
    kilos: kilosProps,
    factura: facturaProps,
    valor_total: valorTotalProps,
    remision: remisionProps,
    forma_pago: formaPagoProps,
    valor_unitario,
    onCerrarPedido,
    onGuardarNovedad
}) => {
    // Debug para ver qué pedidoId recibe el modal

    // Monitorear cambios en pedidoId
    useEffect(() => {
    }, [pedidoId]);

    // Limpiar campos cuando el modal se abre
    useEffect(() => {
        if (visible) {
            setKilos('');
            setFactura('');
            setValorTotal('');
            setValorTotalRaw('');
            setRemision('');
            setFormaPago('');
            setNovedad('');
            setImagen(undefined);
        }
    }, [visible]);

    // Estados locales para el formulario
    const [kilos, setKilos] = useState(kilosProps || '');
    const [factura, setFactura] = useState(facturaProps || '');
    const [valorTotal, setValorTotal] = useState(valorTotalProps || '');
    const [valorTotalRaw, setValorTotalRaw] = useState(valorTotalProps || '');
    const [remision, setRemision] = useState(remisionProps || '');
    const [formaPago, setFormaPago] = useState(formaPagoProps || '');
    const [novedad, setNovedad] = useState('');
    const [imagen, setImagen] = useState<string | undefined>(imagenCerrar);

    const convertImageToBase64 = async (imageUri: string): Promise<string | null> => {
        try {
            // Usar fetch para convertir la imagen local a base64
            const response = await fetch(imageUri);
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            return null;
        }
    };
    const handleCerrarPedido = async () => {

        if (!kilos || !factura || !valorTotalRaw || !remision || !formaPago || formaPago === '' || !imagen) {
            Alert.alert('Error', 'Por favor llene todos los campos obligatorios');
            return;
        }

        if (parseInt(valorTotalRaw) < 100) {
            Alert.alert('Error', 'El valor total debe ser mayor a 100');
            return;
        }

        if (!imagen) {
            Alert.alert('Error', 'Por favor agregue la foto de la factura');
            return;
        }

        // Validación de cálculo: kilos × valor unitario vs valor total factura
        if (valor_unitario && kilos) {
            const kilosNumericos = parseFloat(kilos.replace(',', '.')) || 0;
            const valorUnitarioNumerico = parseFloat(valor_unitario) || 0;
            const valorTotalFacturaNumerico = parseFloat(valorTotalRaw) || 0;

            const calculoEsperado = kilosNumericos * valorUnitarioNumerico;
            const diferencia = Math.abs(calculoEsperado - valorTotalFacturaNumerico);

            // Si la diferencia es mayor a 100 pesos, mostrar alerta de validación
            if (diferencia > 100) {
                Alert.alert(
                    '⚠️ Validación de Valores',
                    `¡Oye! Este valor es diferente:\n\n` +
                    `• Cálculo esperado: ${kilosNumericos} kg × $${valorUnitarioNumerico.toLocaleString()} = $${calculoEsperado.toLocaleString()}\n` +
                    `• Valor factura: $${valorTotalFacturaNumerico.toLocaleString()}\n` +
                    `• Diferencia: $${diferencia.toLocaleString()}\n\n` +
                    `¿Seguro que quieres cerrar el pedido?`,
                    [
                        {
                            text: 'No, revisar',
                            style: 'cancel'
                        },
                        {
                            text: 'Sí, cerrar',
                            style: 'destructive',
                            onPress: () => procederConCierre()
                        }
                    ]
                );
                return;
            }
        }

        // Si no hay diferencia significativa, proceder directamente
        procederConCierre();
    };

    const procederConCierre = async () => {
        // Convertir imagen a base64 antes de enviar
        let imagenBase64: string | null = null;
        if (imagen) {
            imagenBase64 = await convertImageToBase64(imagen);
        }

        // Llamar a la función de cierre
        onCerrarPedido({
            kilos,
            factura,
            valor_total: valorTotalRaw, // Enviar solo números al backend
            remision,
            forma_pago: formaPago,
            novedad,
            imagen: imagenBase64 || undefined // Enviar imagen en base64
        }, pedidoId); // Pasar el pedidoId como segundo parámetro

        // NO limpiar campos aquí - se limpiarán solo cuando el modal se cierre exitosamente
    };

    const handleGuardarNovedad = () => {
        if (novedad.length < 4) {
            Alert.alert('Error', 'Inserte alguna novedad (mínimo 4 caracteres)');
            return;
        }
        onGuardarNovedad(novedad, pedidoId);
    };

    const formatCurrency = (value: string) => {
        if (!value) return '';
        const numericValue = value.replace(/[^0-9]/g, '');
        if (!numericValue) return '';
        const number = parseInt(numericValue);
        return '$ ' + number.toLocaleString('es-CO');
    };

    const handleValorTotalChange = (text: string) => {
        // Remover todos los caracteres no numéricos
        const numericValue = text.replace(/[^0-9]/g, '');

        // Actualizar el valor raw (solo números)
        setValorTotalRaw(numericValue);

        // Formatear y mostrar
        if (numericValue) {
            setValorTotal(formatCurrency(numericValue));
        } else {
            setValorTotal('');
        }
    };

    // Función para manejar cuando se selecciona una imagen
    const handleImageSelected = (imagenData: any) => {

        // Manejar si es un array o un string base64
        if (Array.isArray(imagenData) && imagenData.length > 0 && imagenData[0] && imagenData[0].uri) {
            setImagen(imagenData[0].uri);
        } else if (typeof imagenData === 'string' && imagenData.startsWith('data:')) {
            // Si es base64, necesitamos convertirlo a URI local
            setImagen(imagenData);
        } else if (imagenData && imagenData.uri) {
            setImagen(imagenData.uri);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            presentationStyle="overFullScreen"
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 99999,
                elevation: 20,
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    width: width * 0.95,
                    maxHeight: height * 0.9,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 25,
                    zIndex: 99999,
                }}>
                    {/* Header del modal */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e9ecef',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: '#f8f9fa'
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                backgroundColor: entregado ? '#28a745' : '#007bff',
                                borderRadius: 10,
                                padding: 8,
                                marginRight: 12
                            }}>
                                <FontAwesome
                                    name={entregado ? 'check-circle' : 'edit'}
                                    style={{ fontSize: 20, color: '#fff' }}
                                />
                            </View>
                            <View>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: '#333'
                                }}>
                                    {entregado ? 'Pedido Cerrado' : 'Cerrar Pedido'}
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#666',
                                    marginTop: 2
                                }}>
                                    {entregado ? 'Información del pedido finalizado' : 'Complete la información para finalizar'}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: 20,
                                width: 36,
                                height: 36,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <FontAwesome name="times" style={{ fontSize: 16, color: '#666' }} />
                        </TouchableOpacity>
                    </View>

                    {/* Contenido del modal */}
                    <ScrollView
                        style={{ maxHeight: height * 0.7 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ padding: 20 }}>
                            {entregado ? (
                                // Vista de pedido ya cerrado - Diseño completamente renovado
                                <View>
                                    {/* Header con icono de éxito */}
                                    <View style={{
                                        alignItems: 'center',
                                        marginBottom: 24
                                    }}>
                                        <View style={{
                                            backgroundColor: '#d4edda',
                                            borderRadius: 50,
                                            width: 80,
                                            height: 80,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 16,
                                            shadowColor: '#28a745',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 8,
                                            elevation: 6
                                        }}>
                                            <FontAwesome name="check-circle" style={{ fontSize: 40, color: '#28a745' }} />
                                        </View>
                                        <Text style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            color: '#28a745',
                                            marginBottom: 8
                                        }}>
                                            Pedido Finalizado
                                        </Text>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#666',
                                            textAlign: 'center',
                                            lineHeight: 20
                                        }}>
                                            Este pedido ha sido completado y entregado exitosamente
                                        </Text>
                                    </View>

                                    {/* Imagen de la factura si existe */}
                                    {imagenCerrar && (
                                        <View style={{
                                            marginBottom: 24,
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: 12,
                                                textAlign: 'center'
                                            }}>
                                                📷 Foto de la Factura
                                            </Text>
                                            <View style={{
                                                borderRadius: 12,
                                                overflow: 'hidden',
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 4 },
                                                shadowOpacity: 0.1,
                                                shadowRadius: 8,
                                                elevation: 4
                                            }}>
                                                <Image
                                                    source={{ uri: imagenCerrar }}
                                                    style={{
                                                        width: width * 0.7,
                                                        height: width * 0.7 * 0.75, // Aspect ratio 4:3
                                                        borderRadius: 12
                                                    }}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                            <View style={{
                                                backgroundColor: '#e8f5e8',
                                                borderRadius: 8,
                                                padding: 8,
                                                marginTop: 12,
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}>
                                                <FontAwesome name="camera" style={{ fontSize: 14, color: '#28a745', marginRight: 8 }} />
                                                <Text style={{ color: '#28a745', fontSize: 12, fontWeight: '500' }}>
                                                    Imagen registrada correctamente
                                                </Text>
                                            </View>
                                        </View>
                                    )}

                                    {/* Información del pedido en cards */}
                                    <View style={{ gap: 16 }}>
                                        {/* Card principal con total */}
                                        <View style={{
                                            backgroundColor: '#fff',
                                            borderRadius: 16,
                                            padding: 20,
                                            borderLeftWidth: 4,
                                            borderLeftColor: '#28a745',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 4,
                                            elevation: 3
                                        }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: 16
                                            }}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                                                    Total Facturado
                                                </Text>
                                                <Text style={{ fontSize: 24, color: '#28a745', fontWeight: 'bold' }}>
                                                    {formatCurrency(valorTotalProps || '0')}
                                                </Text>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                paddingTop: 12,
                                                borderTopWidth: 1,
                                                borderTopColor: '#e9ecef'
                                            }}>
                                                <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>Forma de pago:</Text>
                                                <View style={{
                                                    backgroundColor: formaPagoProps === 'Contado' ? '#e3f2fd' : '#e8f5e8',
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 4,
                                                    borderRadius: 20
                                                }}>
                                                    <Text style={{
                                                        fontSize: 12,
                                                        color: formaPagoProps === 'Contado' ? '#2196f3' : '#4caf50',
                                                        fontWeight: '600'
                                                    }}>
                                                        {formaPagoProps === 'Contado' ? '💵 Contado' : '💳 Crédito'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Card de detalles */}
                                        <View style={{
                                            backgroundColor: '#fff',
                                            borderRadius: 16,
                                            padding: 20,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 4,
                                            elevation: 3
                                        }}>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: 16,
                                                textAlign: 'center'
                                            }}>
                                                📋 Detalles del Pedido
                                            </Text>

                                            <View style={{ gap: 12 }}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingVertical: 8,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: '#f8f9fa'
                                                }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <FontAwesome name="balance-scale" style={{ fontSize: 16, color: '#666', marginRight: 8 }} />
                                                        <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>Kilos:</Text>
                                                    </View>
                                                    <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>{kilosProps}</Text>
                                                </View>

                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingVertical: 8,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: '#f8f9fa'
                                                }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <FontAwesome name="file-text-o" style={{ fontSize: 16, color: '#666', marginRight: 8 }} />
                                                        <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>Factura:</Text>
                                                    </View>
                                                    <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>{facturaProps}</Text>
                                                </View>

                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingVertical: 8
                                                }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <FontAwesome name="truck" style={{ fontSize: 16, color: '#666', marginRight: 8 }} />
                                                        <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>Remisión:</Text>
                                                    </View>
                                                    <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>{remisionProps}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Card de información adicional si existe valor unitario */}
                                        {valor_unitario && (
                                            <View style={{
                                                backgroundColor: '#fff3cd',
                                                borderRadius: 16,
                                                padding: 16,
                                                borderLeftWidth: 4,
                                                borderLeftColor: '#ffc107'
                                            }}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <FontAwesome name="calculator" style={{ fontSize: 16, color: '#856404', marginRight: 8 }} />
                                                        <Text style={{ fontSize: 14, color: '#856404', fontWeight: '500' }}>Valor Unitario:</Text>
                                                    </View>
                                                    <Text style={{ fontSize: 14, color: '#856404', fontWeight: '600' }}>
                                                        {formatCurrency(valor_unitario || '0')}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ) : (
                                // Formulario para cerrar pedido
                                <View>
                                    {/* Sección de foto */}
                                    <TomarFoto
                                        source={imagen ? [{ uri: imagen }] : []}
                                        titulo="Foto de Factura"
                                        descripcion="Tome una foto clara de la factura para completar el pedido"
                                        multiple={false}
                                        limiteImagenes={1}
                                        imagenes={handleImageSelected}
                                    />

                                    {/* Formulario de datos */}
                                    <View style={{ gap: 16 }}>
                                        {/* Kilos */}
                                        <View>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: 8
                                            }}>
                                                Kilos Entregados *
                                            </Text>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: 10,
                                                paddingHorizontal: 12,
                                                borderWidth: 1,
                                                borderColor: '#e9ecef'
                                            }}>
                                                <FontAwesome name="balance-scale" style={{ fontSize: 16, color: '#666', marginRight: 10 }} />
                                                <TextInput
                                                    placeholder="Ej: 120,5 o 120.5"
                                                    placeholderTextColor="#999"
                                                    value={kilos}
                                                    onChangeText={(text) => {
                                                        // Permite números, puntos y comas
                                                        const numericValue = text.replace(/[^0-9.,]/g, '');

                                                        // Evita múltiples puntos decimales y múltiples comas
                                                        const dotCount = (numericValue.match(/\./g) || []).length;
                                                        const commaCount = (numericValue.match(/,/g) || []).length;

                                                        if (dotCount > 1 || commaCount > 1) {
                                                            return;
                                                        }

                                                        // Si hay tanto punto como coma, solo permitir el último
                                                        if (dotCount > 0 && commaCount > 0) {
                                                            const lastDot = numericValue.lastIndexOf('.');
                                                            const lastComma = numericValue.lastIndexOf(',');

                                                            if (lastDot > lastComma) {
                                                                // Punto es más reciente, eliminar comas
                                                                setKilos(numericValue.replace(/,/g, ''));
                                                            } else {
                                                                // Coma es más reciente, eliminar puntos
                                                                setKilos(numericValue.replace(/\./g, ''));
                                                            }
                                                            return;
                                                        }

                                                        setKilos(numericValue);
                                                    }}
                                                    keyboardType="numeric"
                                                    style={{
                                                        flex: 1,
                                                        fontSize: 16,
                                                        color: '#333',
                                                        paddingVertical: 12
                                                    }}
                                                />
                                                <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>kg</Text>
                                            </View>
                                        </View>

                                        {/* Consecutivo */}
                                        <View>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: 8
                                            }}>
                                                Consecutivo *
                                            </Text>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: 10,
                                                paddingHorizontal: 12,
                                                borderWidth: 1,
                                                borderColor: '#e9ecef'
                                            }}>
                                                <FontAwesome name="file-text-o" style={{ fontSize: 16, color: '#666', marginRight: 10 }} />
                                                <TextInput
                                                    placeholder="Ej: FAC-001234"
                                                    placeholderTextColor="#999"
                                                    value={factura}
                                                    onChangeText={setFactura}
                                                    style={{
                                                        flex: 1,
                                                        fontSize: 16,
                                                        color: '#333',
                                                        paddingVertical: 12
                                                    }}
                                                />
                                            </View>
                                        </View>

                                        {/* Valor total */}
                                        <View>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: 8
                                            }}>
                                                Valor Total Factura *
                                            </Text>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: 10,
                                                paddingHorizontal: 12,
                                                borderWidth: 1,
                                                borderColor: '#e9ecef'
                                            }}>
                                                <FontAwesome name="dollar" style={{ fontSize: 16, color: '#28a745', marginRight: 10 }} />
                                                <TextInput
                                                    placeholder="Ej: $ 150,000"
                                                    placeholderTextColor="#999"
                                                    value={valorTotal}
                                                    onChangeText={handleValorTotalChange}
                                                    keyboardType="numeric"
                                                    style={{
                                                        flex: 1,
                                                        fontSize: 16,
                                                        color: '#333',
                                                        paddingVertical: 12
                                                    }}
                                                />
                                            </View>

                                        </View>

                                        {/* Remisión */}
                                        <View>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: 8
                                            }}>
                                                Número de Remisión *
                                            </Text>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: 10,
                                                paddingHorizontal: 12,
                                                borderWidth: 1,
                                                borderColor: '#e9ecef'
                                            }}>
                                                <FontAwesome name="truck" style={{ fontSize: 16, color: '#666', marginRight: 10 }} />
                                                <TextInput
                                                    placeholder="Ej: REM-001234"
                                                    placeholderTextColor="#999"
                                                    value={remision}
                                                    onChangeText={setRemision}
                                                    keyboardType="numeric"
                                                    style={{
                                                        flex: 1,
                                                        fontSize: 16,
                                                        color: '#333',
                                                        paddingVertical: 12
                                                    }}
                                                />
                                            </View>
                                        </View>

                                        {/* Forma de pago */}
                                        <View>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: 8
                                            }}>
                                                Forma de Pago *
                                            </Text>

                                            <View style={{ gap: 12 }}>
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: formaPago === 'Contado' ? '#e3f2fd' : '#f8f9fa',
                                                        borderRadius: 10,
                                                        paddingHorizontal: 16,
                                                        paddingVertical: 14,
                                                        borderWidth: 2,
                                                        borderColor: formaPago === 'Contado' ? '#2196f3' : '#e9ecef',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    }}
                                                    onPress={() => setFormaPago('Contado')}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <FontAwesome
                                                            name="money"
                                                            style={{
                                                                fontSize: 18,
                                                                color: formaPago === 'Contado' ? '#2196f3' : '#666',
                                                                marginRight: 12
                                                            }}
                                                        />
                                                        <Text style={{
                                                            fontSize: 16,
                                                            fontWeight: '600',
                                                            color: formaPago === 'Contado' ? '#2196f3' : '#333'
                                                        }}>
                                                            Pago de Contado
                                                        </Text>
                                                    </View>
                                                    {formaPago === 'Contado' && (
                                                        <FontAwesome
                                                            name="check-circle"
                                                            style={{ fontSize: 20, color: '#2196f3' }}
                                                        />
                                                    )}
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: formaPago === 'Credito' ? '#e8f5e8' : '#f8f9fa',
                                                        borderRadius: 10,
                                                        paddingHorizontal: 16,
                                                        paddingVertical: 14,
                                                        borderWidth: 2,
                                                        borderColor: formaPago === 'Credito' ? '#4caf50' : '#e9ecef',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    }}
                                                    onPress={() => setFormaPago('Credito')}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <FontAwesome
                                                            name="credit-card"
                                                            style={{
                                                                fontSize: 18,
                                                                color: formaPago === 'Credito' ? '#4caf50' : '#666',
                                                                marginRight: 12
                                                            }}
                                                        />
                                                        <Text style={{
                                                            fontSize: 16,
                                                            fontWeight: '600',
                                                            color: formaPago === 'Credito' ? '#4caf50' : '#333'
                                                        }}>
                                                            Pago a Crédito
                                                        </Text>
                                                    </View>
                                                    {formaPago === 'Credito' && (
                                                        <FontAwesome
                                                            name="check-circle"
                                                            style={{ fontSize: 20, color: '#4caf50' }}
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* Novedades */}
                                        <View>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: 8
                                            }}>
                                                Novedades *
                                            </Text>
                                            <View style={{
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                borderColor: '#e9ecef',
                                                paddingHorizontal: 12,
                                                paddingVertical: 8
                                            }}>
                                                <TextInput
                                                    placeholder="Escriba las novedades del pedido..."
                                                    placeholderTextColor="#999"
                                                    value={novedad}
                                                    onChangeText={setNovedad}
                                                    multiline={true}
                                                    numberOfLines={4}
                                                    style={{
                                                        fontSize: 16,
                                                        color: '#333',
                                                        textAlignVertical: 'top',
                                                        minHeight: 80
                                                    }}
                                                    onSubmitEditing={Keyboard.dismiss}
                                                />
                                            </View>
                                            <Text style={{
                                                fontSize: 12,
                                                color: '#666',
                                                marginTop: 4
                                            }}>
                                                {novedad.length}/200 caracteres
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Botones de acción */}
                                    <View style={{ gap: 12, marginTop: 20 }}>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: !kilos || !factura || !valorTotalRaw || !remision || !formaPago || formaPago === '' || !imagen
                                                    ? '#ccc' : '#007bff',
                                                borderRadius: 12,
                                                paddingVertical: 16,
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.1,
                                                shadowRadius: 4,
                                                elevation: 3,
                                            }}
                                            onPress={handleCerrarPedido}
                                            disabled={!kilos || !factura || !valorTotalRaw || !remision || !formaPago || formaPago === '' || !imagen}
                                            activeOpacity={0.8}
                                        >
                                            <FontAwesome name="check-circle" style={{
                                                fontSize: 18,
                                                color: '#fff',
                                                marginRight: 10
                                            }} />
                                            <Text style={{
                                                color: '#fff',
                                                fontSize: 16,
                                                fontWeight: '600'
                                            }}>
                                                Cerrar Pedido
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: novedad.length < 4 ? '#ccc' : '#ffc107',
                                                borderRadius: 12,
                                                paddingVertical: 16,
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.1,
                                                shadowRadius: 4,
                                                elevation: 3,
                                            }}
                                            onPress={handleGuardarNovedad}
                                            disabled={novedad.length < 4}
                                            activeOpacity={0.8}
                                        >
                                            <FontAwesome name="save" style={{
                                                fontSize: 18,
                                                color: '#fff',
                                                marginRight: 10
                                            }} />
                                            <Text style={{
                                                color: '#fff',
                                                fontSize: 16,
                                                fontWeight: '600'
                                            }}>
                                                Guardar Novedad, sin Cerrar
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default CerrarPedidoModal;
