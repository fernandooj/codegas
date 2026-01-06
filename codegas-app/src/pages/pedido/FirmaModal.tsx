import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import SignatureCanvas from 'react-native-signature-canvas';

const { width, height } = Dimensions.get('window');

interface FirmaModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (firmaConductor: string | null, firmaUsuario: string | null) => void;
    pedidoId: string;
}

const FirmaModal: React.FC<FirmaModalProps> = ({
    visible,
    onClose,
    onSave,
    pedidoId
}) => {
    const [currentFirma, setCurrentFirma] = useState<'conductor' | 'usuario'>('conductor');
    const [firmaConductor, setFirmaConductor] = useState<string | null>(null);
    const [firmaUsuario, setFirmaUsuario] = useState<string | null>(null);
    const signatureRef = useRef<any>(null);

    // Reset cuando se cierre el modal
    useEffect(() => {
        if (!visible) {
            setFirmaConductor(null);
            setFirmaUsuario(null);
            setCurrentFirma('conductor');
        }
    }, [visible]);

    const handleSignature = (signature: string) => {
        try {
            console.log('✍️ Firma capturada para:', currentFirma);

            if (currentFirma === 'conductor') {
                setFirmaConductor(signature);
            } else {
                setFirmaUsuario(signature);
            }
        } catch (error) {
            console.error('❌ Error al capturar firma:', error);
            const errorText = formatFullError(error);
            Alert.alert(
                'Error al capturar firma',
                errorText,
                [
                    {
                        text: 'Copiar',
                        onPress: () => {
                            copyToClipboard(errorText);
                        }
                    },
                    { text: 'OK' }
                ],
                { cancelable: true }
            );
        }
    };

    const handleClear = () => {
        signatureRef.current?.clearSignature();
        if (currentFirma === 'conductor') {
            setFirmaConductor(null);
        } else {
            setFirmaUsuario(null);
        }
    };

    const handleCapture = () => {
        try {
            signatureRef.current?.readSignature();
        } catch (error) {
            console.error('❌ Error al leer firma:', error);
            const errorText = formatFullError(error);
            Alert.alert(
                'Error al leer firma',
                errorText,
                [
                    {
                        text: 'Copiar',
                        onPress: () => {
                            copyToClipboard(errorText);
                        }
                    },
                    { text: 'OK' }
                ],
                { cancelable: true }
            );
        }
    };

    const handleSave = () => {
        // Validar que ambas firmas sean obligatorias
        if (!firmaConductor || !firmaUsuario) {
            const faltantes = [];
            if (!firmaConductor) faltantes.push('Conductor');
            if (!firmaUsuario) faltantes.push('Usuario/Cliente');

            Alert.alert(
                'Firmas requeridas',
                `Debe capturar ambas firmas para continuar.\n\nFirmas faltantes:\n• ${faltantes.join('\n• ')}`,
                [{ text: 'OK' }]
            );
            return;
        }

        // Confirmar antes de guardar
        Alert.alert(
            'Confirmar Firmas',
            `Ambas firmas han sido capturadas:\n• Conductor: ✓\n• Usuario/Cliente: ✓\n\n¿Desea guardar y continuar?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Guardar',
                    onPress: () => {
                        onSave(firmaConductor, firmaUsuario);
                        // Limpiar firmas después de guardar
                        setFirmaConductor(null);
                        setFirmaUsuario(null);
                        setCurrentFirma('conductor');
                    }
                }
            ]
        );
    };

    const handleCancel = () => {
        setFirmaConductor(null);
        setFirmaUsuario(null);
        setCurrentFirma('conductor');
        onClose();
    };

    const formatFullError = (err: unknown): string => {
        try {
            if (err instanceof Error) {
                return `${err.message}\n\n${err.stack ?? ''}`.trim();
            }
            return JSON.stringify(err, null, 2);
        } catch (_e) {
            return String(err);
        }
    };

    const copyToClipboard = (text: string) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const Clipboard = require('@react-native-clipboard/clipboard');
            if (Clipboard?.setString) {
                Clipboard.setString(text);
            }
        } catch (_e) {
            // No-op if library is not available
        }
    };

    // NO renderizar nada si no está visible - esto desmonta completamente el WebView
    if (!visible) {
        return null;
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={handleCancel}
            presentationStyle="overFullScreen"
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                justifyContent: 'center',
                alignItems: 'center',
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
                }}>
                    {/* Header */}
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
                                backgroundColor: '#007bff',
                                borderRadius: 10,
                                padding: 8,
                                marginRight: 12
                            }}>
                                <FontAwesome name="pencil" style={{ fontSize: 20, color: '#fff' }} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                                    Firmas Digitales
                                </Text>
                                <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
                                    Pedido #{pedidoId}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleCancel}
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

                    {/* Tabs de navegación */}
                    <View style={{
                        flexDirection: 'row',
                        padding: 16,
                        gap: 12
                    }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: currentFirma === 'conductor' ? '#007bff' : '#f8f9fa',
                                borderRadius: 10,
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 2,
                                borderColor: currentFirma === 'conductor' ? '#007bff' : '#e9ecef',
                            }}
                            onPress={() => {
                                setCurrentFirma('conductor');
                                signatureRef.current?.clearSignature();
                            }}
                        >
                            <FontAwesome
                                name="user"
                                style={{
                                    fontSize: 16,
                                    color: currentFirma === 'conductor' ? '#fff' : '#666',
                                    marginRight: 8
                                }}
                            />
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: currentFirma === 'conductor' ? '#fff' : '#333'
                            }}>
                                Conductor
                            </Text>
                            {firmaConductor ? (
                                <FontAwesome
                                    name="check-circle"
                                    style={{
                                        fontSize: 16,
                                        color: currentFirma === 'conductor' ? '#fff' : '#28a745',
                                        marginLeft: 8
                                    }}
                                />
                            ) : (
                                <FontAwesome
                                    name="exclamation-circle"
                                    style={{
                                        fontSize: 16,
                                        color: currentFirma === 'conductor' ? '#fff' : '#dc3545',
                                        marginLeft: 8
                                    }}
                                />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: currentFirma === 'usuario' ? '#28a745' : '#f8f9fa',
                                borderRadius: 10,
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 2,
                                borderColor: currentFirma === 'usuario' ? '#28a745' : '#e9ecef',
                            }}
                            onPress={() => {
                                setCurrentFirma('usuario');
                                signatureRef.current?.clearSignature();
                            }}
                        >
                            <FontAwesome
                                name="user-circle"
                                style={{
                                    fontSize: 16,
                                    color: currentFirma === 'usuario' ? '#fff' : '#666',
                                    marginRight: 8
                                }}
                            />
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: currentFirma === 'usuario' ? '#fff' : '#333'
                            }}>
                                Usuario
                            </Text>
                            {firmaUsuario ? (
                                <FontAwesome
                                    name="check-circle"
                                    style={{
                                        fontSize: 16,
                                        color: currentFirma === 'usuario' ? '#fff' : '#28a745',
                                        marginLeft: 8
                                    }}
                                />
                            ) : (
                                <FontAwesome
                                    name="exclamation-circle"
                                    style={{
                                        fontSize: 16,
                                        color: currentFirma === 'usuario' ? '#fff' : '#dc3545',
                                        marginLeft: 8
                                    }}
                                />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Área de firma */}
                    <View style={{ padding: 16 }}>
                        <View style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: 12,
                            padding: 12,
                            marginBottom: 16
                        }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                textAlign: 'center'
                            }}>
                                ✍️ Firma del {currentFirma === 'conductor' ? 'Conductor' : 'Usuario/Cliente'}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: '#666',
                                textAlign: 'center',
                                marginTop: 4
                            }}>
                                Firme con su dedo en el área inferior
                            </Text>
                            <View style={{
                                marginTop: 8,
                                paddingTop: 8,
                                borderTopWidth: 1,
                                borderTopColor: '#dee2e6'
                            }}>
                                <Text style={{
                                    fontSize: 11,
                                    color: '#dc3545',
                                    textAlign: 'center',
                                    fontWeight: '600'
                                }}>
                                    ⚠️ Ambas firmas son obligatorias
                                </Text>
                                {/* <Text style={{
                                    fontSize: 10,
                                    color: '#666',
                                    textAlign: 'center',
                                    marginTop: 4
                                }}>
                                    • Conductor: {firmaConductor ? '✓ Capturada' : '✗ Pendiente'}
                                </Text>
                                <Text style={{
                                    fontSize: 10,
                                    color: '#666',
                                    textAlign: 'center'
                                }}>
                                    • Usuario/Cliente: {firmaUsuario ? '✓ Capturada' : '✗ Pendiente'}
                                </Text> */}
                            </View>
                        </View>

                        <View style={{
                            height: height * 0.35,
                            borderWidth: 2,
                            borderColor: currentFirma === 'conductor' ? '#007bff' : '#28a745',
                            borderRadius: 12,
                            overflow: 'hidden',
                            backgroundColor: '#fff'
                        }}>
                            <SignatureCanvas
                                key={`signature-${currentFirma}`}
                                ref={signatureRef}
                                onOK={handleSignature}
                                descriptionText="Firme aquí"
                                clearText="Limpiar"
                                confirmText="Guardar"
                                webStyle={`
                                    .m-signature-pad {
                                        box-shadow: none;
                                        border: none;
                                        margin: 0;
                                    }
                                    .m-signature-pad--body {
                                        border: none;
                                    }
                                    .m-signature-pad--footer {
                                        display: none;
                                    }
                                    body, html {
                                        width: 100%;
                                        height: 100%;
                                        margin: 0;
                                        padding: 0;
                                    }
                                `}
                            />
                        </View>
                    </View>

                    {/* Botones de acción */}
                    <View style={{
                        padding: 20,
                        borderTopWidth: 1,
                        borderTopColor: '#e9ecef',
                        gap: 12
                    }}>
                        {/* Limpiar y Capturar en la misma fila */}
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: '#ffc107',
                                    borderRadius: 12,
                                    paddingVertical: 14,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                                onPress={handleClear}
                            >
                                <FontAwesome name="eraser" style={{ fontSize: 16, color: '#fff', marginRight: 8 }} />
                                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                                    Limpiar Firma Actual
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: '#28a745',
                                    borderRadius: 12,
                                    paddingVertical: 14,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                                onPress={handleCapture}
                            >
                                <FontAwesome name="check" style={{ fontSize: 16, color: '#fff', marginRight: 8 }} />
                                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                                    Capturar Firma
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: '#6c757d',
                                    borderRadius: 12,
                                    paddingVertical: 16,
                                    alignItems: 'center',
                                }}
                                onPress={handleCancel}
                            >
                                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: (firmaConductor && firmaUsuario) ? '#007bff' : '#ccc',
                                    borderRadius: 12,
                                    paddingVertical: 16,
                                    alignItems: 'center',
                                    opacity: (firmaConductor && firmaUsuario) ? 1 : 0.6,
                                }}
                                onPress={handleSave}
                                disabled={!firmaConductor || !firmaUsuario}
                            >
                                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                                    Guardar y Continuar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FirmaModal;

