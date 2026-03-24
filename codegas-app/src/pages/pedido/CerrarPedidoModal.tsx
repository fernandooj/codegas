import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, Alert, Keyboard, Dimensions, Image, ActivityIndicator } from 'react-native';
import { syncQueueService, SyncOperationType } from '../../services/syncQueueService';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import TomarFoto from '../components/tomarFoto';
import FirmaModal from './FirmaModal';
import { motivoNoCierre } from '../../utils/pedido_info';
import { CerrarPedidoModalProps, CerrarPedidoData } from './types';
import { guardarFirmas, sendFacturaEmail } from '../../redux/actions/pedidoActions';

const { width, height } = Dimensions.get('window');

const CerrarPedidoModal: React.FC<CerrarPedidoModalProps> = ({
    visible,
    onClose,
    pedidoId, // Agregar pedidoId
    entregado,
    modoEdicion = false,
    imagenCerrar,
    kilos: kilosProps,
    factura: facturaProps,
    valor_total: valorTotalProps,
    remision: remisionProps,
    forma_pago: formaPagoProps,
    valor_unitario,
    firma_conductor,
    firma_usuario,
    puntoId,
    usuarioId,
    email,
    onCerrarPedido,
    onGuardarNovedad
}) => {

    const normalizarFormaPago = (value?: string) => {
        const raw = (value || '').toString().trim().toLowerCase();
        if (raw === 'contado') return 'Contado';
        if (raw === 'credito' || raw === 'crédito') return 'Credito';
        return '';
    };

    // Inicializar campos cuando el modal se abre
    useEffect(() => {
        if (visible) {
            const kilosInicial = kilosProps ? String(kilosProps) : '';
            const facturaInicial = facturaProps ? String(facturaProps) : '';
            const valorTotalInicial = valorTotalProps ? String(valorTotalProps) : '';
            const valorTotalNumerico = valorTotalInicial.replace(/[^0-9]/g, '');
            const remisionInicial = remisionProps ? String(remisionProps) : '';

            setKilos(kilosInicial);
            setFactura(facturaInicial);
            setValorTotalRaw(valorTotalNumerico);
            setValorTotal(valorTotalNumerico ? formatCurrency(valorTotalNumerico) : '');
            setRemision(remisionInicial);
            setFormaPago(normalizarFormaPago(formaPagoProps));
            setNovedad('');
            setImagen(imagenCerrar || undefined);
            // Resetear el flag de confirmación cuando se abre el modal
            confirmacionAlertShownRef.current = false;
            // Resetear el estado de loading
            setIsClosing(false);
        }
    }, [visible, kilosProps, facturaProps, valorTotalProps, remisionProps, formaPagoProps, imagenCerrar]);

    // Estados locales para el formulario
    const [kilos, setKilos] = useState(kilosProps || '');
    const [factura, setFactura] = useState(facturaProps || '');
    const [valorTotal, setValorTotal] = useState(valorTotalProps || '');
    const [valorTotalRaw, setValorTotalRaw] = useState(valorTotalProps || '');
    const [remision, setRemision] = useState(remisionProps || '');
    const [formaPago, setFormaPago] = useState(formaPagoProps || '');
    const [novedad, setNovedad] = useState('');
    const [imagen, setImagen] = useState<string | undefined>(imagenCerrar);
    const [showMotivoModal, setShowMotivoModal] = useState(false);
    const [motivoSeleccionado, setMotivoSeleccionado] = useState<string>('');
    const [imagenExpandida, setImagenExpandida] = useState(false);

    // Estados para las firmas
    const [showFirmasModal, setShowFirmasModal] = useState(false);
    const [firmaConductor, setFirmaConductor] = useState<string | null>(null);
    const [firmaUsuario, setFirmaUsuario] = useState<string | null>(null);
    const [dataCierrePendiente, setDataCierrePendiente] = useState<any>(null);
    const [firmasGuardadas, setFirmasGuardadas] = useState<{
        firmaConductor: string | null;
        firmaUsuario: string | null;
    } | null>(null);

    // Ref para evitar que el Alert de confirmación se muestre dos veces
    const confirmacionAlertShownRef = useRef(false);
    
    // Estado para controlar el preloader durante el cierre
    const [isClosing, setIsClosing] = useState(false);
    const esModoEdicion = !!modoEdicion;

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

        const guardarEdicionSinFirmas = async () => {
            setIsClosing(true);
            try {
                let imagenParaEditar = imagen;
                if (imagenParaEditar && !imagenParaEditar.startsWith('data:')) {
                    const imagenBase64 = await convertImageToBase64(imagenParaEditar);
                    if (imagenBase64) {
                        imagenParaEditar = imagenBase64;
                    }
                }

                await onCerrarPedido({
                    kilos,
                    factura,
                    valor_total: valorTotalRaw,
                    remision,
                    forma_pago: formaPago,
                    novedad,
                    imagen: imagenParaEditar
                }, pedidoId, true);
                setIsClosing(false);
            } catch (error: any) {
                setIsClosing(false);
                const errorText = formatFullError(error);
                Alert.alert(
                    'Error al editar cierre',
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
                            onPress: () => {
                                if (esModoEdicion) {
                                    guardarEdicionSinFirmas();
                                    return;
                                }
                                prepararParaFirmas();
                            }
                        }
                    ]
                );
                return;
            }
        }

        // Si es edición de pedido ya cerrado, guardar directamente SIN firmas
        if (esModoEdicion) {
            await guardarEdicionSinFirmas();
            return;
        }

        // Si no hay diferencia significativa, abrir modal de firmas
        prepararParaFirmas();
    };

    const prepararParaFirmas = async () => {
        // Convertir imagen a base64 antes de enviar
        let imagenBase64: string | null = null;
        if (imagen) {
            imagenBase64 = await convertImageToBase64(imagen);
        }

        // Guardar datos del cierre para enviar después de las firmas
        setDataCierrePendiente({
            kilos,
            factura,
            valor_total: valorTotalRaw,
            remision,
            forma_pago: formaPago,
            novedad,
            imagen: imagenBase64 || undefined,
            email: email || undefined // Incluir email para enviar factura después
        });

        // Abrir modal de firmas
        setShowFirmasModal(true);
    };

    const handleFirmasGuardadas = async (firmaConductorData: string | null, firmaUsuarioData: string | null) => {
        console.log('✍️ Firmas recibidas - Conductor:', !!firmaConductorData, 'Usuario:', !!firmaUsuarioData);

        // Protección contra llamadas duplicadas
        if (confirmacionAlertShownRef.current) {
            console.log('⚠️ [CerrarPedidoModal] Ya se está procesando el cierre, ignorando llamada duplicada');
            return;
        }

        setShowFirmasModal(false);

        // Guardar las firmas temporalmente
        const firmasData = {
            firmaConductor: firmaConductorData,
            firmaUsuario: firmaUsuarioData
        };
        setFirmasGuardadas(firmasData);

        // Marcar que se está procesando
        confirmacionAlertShownRef.current = true;
        
        // Activar preloader
        setIsClosing(true);

        // Cerrar el pedido directamente sin mostrar otro Alert de confirmación
        // La confirmación ya se hizo en el modal de firmas
        // Pasar las firmas directamente para evitar problemas de timing con setState
        setTimeout(() => {
            if (dataCierrePendiente) {
                cerrarPedidoConFirmasYLlenado(dataCierrePendiente, firmasData);
            } else {
                Alert.alert('Error', 'No hay datos pendientes para cerrar');
                confirmacionAlertShownRef.current = false;
                setIsClosing(false);
            }
        }, 300);
    };


    const cerrarPedidoConFirmasYLlenado = async (datosCierre: any, firmasPasadas?: { firmaConductor: string | null; firmaUsuario: string | null } | null) => {
        // Usar las firmas pasadas como parámetro o las del estado como fallback
        // Definir fuera del try para que esté disponible en el catch
        const firmasAUsar = firmasPasadas || firmasGuardadas;
        
        try {
            
            console.log('🔍 [CerrarPedidoModal] Iniciando cierre de pedido:', {
                pedidoId,
                email,
                tieneFirmas: !!(firmasAUsar && (firmasAUsar.firmaConductor || firmasAUsar.firmaUsuario)),
                firmasPasadas: !!firmasPasadas,
                firmasGuardadas: !!firmasGuardadas
            });

            // 1. Primero cerrar el pedido con los datos completos
            // Pasar skipConfirmation=true porque ya se confirmó en el modal de firmas
            await onCerrarPedido(datosCierre, pedidoId, true);

            // 2. Luego guardar las firmas
            if (firmasAUsar && (firmasAUsar.firmaConductor || firmasAUsar.firmaUsuario)) {
                console.log('💾 Guardando firmas en el backend...');
                const response = await guardarFirmas(
                    pedidoId || '',
                    firmasAUsar.firmaConductor,
                    firmasAUsar.firmaUsuario
                );

                if (response.status) {
                    console.log('✅ Firmas guardadas correctamente');
                } else {
                    console.warn('⚠️ Pedido cerrado pero error guardando firmas');
                }
            }

            // 3. Enviar email con factura PDF después de cerrar el pedido
            if (email && pedidoId) {
                try {
                    console.log('📧 [CerrarPedidoModal] Enviando email con factura a:', email, 'para pedido:', pedidoId);
                    await sendFacturaEmail(pedidoId, email);
                    console.log('✅ [CerrarPedidoModal] Email con factura enviado exitosamente');
                } catch (emailError: any) {
                    // Silenciar el error para evitar que se muestre el Toast duplicado
                    // No bloquear el flujo si falla el email, solo loguear el error
                    console.error('❌ [CerrarPedidoModal] Error enviando email con factura (silenciado):', emailError);
                }
            }

            // Desactivar preloader antes de mostrar el Alert
            setIsClosing(false);

            // 4. Mostrar mensaje de éxito
            const mensajeExito = firmasGuardadas && (firmasGuardadas.firmaConductor || firmasGuardadas.firmaUsuario)
                ? 'El pedido se ha cerrado correctamente. Las firmas se han guardado y se envió el correo con el PDF de remisión y resumen de contrato.'
                : 'El pedido se ha cerrado correctamente. Se envió el correo con el PDF de remisión y resumen de contrato.';

            Alert.alert(
                '✅ Pedido Cerrado',
                mensajeExito,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Limpiar estados
                            setDataCierrePendiente(null);
                            setFirmaConductor(null);
                            setFirmaUsuario(null);
                            setFirmasGuardadas(null);
                            confirmacionAlertShownRef.current = false;
                            onClose();
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('❌ Error en el proceso de cierre:', error);
            // Desactivar preloader en caso de error
            setIsClosing(false);

            // Si es un error de red, guardamos en cola offline directamente sin mostrar error
            const isNetworkError =
                (error?.isAxiosError && error?.message === 'Network Error') ||
                /Network Error|Failed to fetch|timeout/i.test(String(error?.message ?? error));

            if (isNetworkError && dataCierrePendiente) {
                // Guardar offline directamente sin mostrar el error
                console.log('📴 [CerrarPedidoModal] Error de red detectado, guardando offline automáticamente...');
                try {
                    // Incluir solo la imagen de cerrar pedido en imageUris
                    // Las firmas se guardan como base64 en data.firmas y las subirá guardarFirmas
                    const imageUris: string[] = [];

                    // Solo la imagen de cerrar pedido (necesita subirse antes de cerrar el pedido)
                    if (imagen) {
                        if (imagen.startsWith('data:')) {
                            imageUris.push(imagen);
                        } else {
                            // Si ya es una URI local, también incluirla
                            imageUris.push(imagen);
                        }
                    }

                    // Las firmas se mantienen como base64 en data.firmas
                    // El backend guardarFirmas las subirá a S3 automáticamente
                    console.log(`💾 [CerrarPedidoModal] Guardando offline: ${imageUris.length} imagen(es) de cerrar pedido + firmas base64`);

                    const pedidoDataCompleto = {
                        ...dataCierrePendiente,
                        // Incluir idUsuario si está disponible
                        idUsuario: usuarioId ? parseInt(usuarioId.toString()) : 1,
                        // Incluir email si está disponible para enviar factura después
                        email: email || dataCierrePendiente?.email || null
                    };

                    console.log(`💾 [CerrarPedidoModal] Guardando offline con datos completos:`, {
                        pedidoId,
                        dataCierrePendiente: dataCierrePendiente
                    });

                    // Usar las firmas pasadas como parámetro o las del estado como fallback
                    // En el catch, firmasAUsar puede no estar definido, así que usamos firmasGuardadas
                    const firmasParaCola = firmasAUsar || firmasGuardadas;
                    
                    console.log('💾 [CerrarPedidoModal] Agregando a cola offline:', {
                        pedidoId: pedidoId,
                        pedidoIdType: typeof pedidoId,
                        pedidoIdString: pedidoId?.toString(),
                        tienePedidoData: !!pedidoDataCompleto,
                        tieneFirmas: !!(firmasParaCola && (firmasParaCola.firmaConductor || firmasParaCola.firmaUsuario)),
                        tieneConductor: !!(firmasParaCola?.firmaConductor),
                        tieneUsuario: !!(firmasParaCola?.firmaUsuario),
                        imageUrisCount: imageUris.length
                    });
                    
                    console.log('💾 [CerrarPedidoModal] Agregando firmas a cola:', {
                        tieneFirmasParaCola: !!firmasParaCola,
                        tieneConductor: !!(firmasParaCola?.firmaConductor),
                        tieneUsuario: !!(firmasParaCola?.firmaUsuario)
                    });
                    
                    await syncQueueService.addToQueue(
                        SyncOperationType.CERRAR_PEDIDO,
                        {
                            pedidoId: pedidoId?.toString(), // Asegurar que sea string
                            pedidoData: pedidoDataCompleto,
                            firmas: firmasParaCola ? {
                                conductor: firmasParaCola.firmaConductor,
                                usuario: firmasParaCola.firmaUsuario
                            } : undefined,
                        },
                        imageUris.length > 0 ? imageUris : undefined
                    );
                    
                    console.log('✅ [CerrarPedidoModal] Item agregado a la cola exitosamente');

                    // Desactivar preloader antes de mostrar el Alert
                    setIsClosing(false);
                    
                    // Cerrar el modal de firmas si aún está abierto (aunque debería estar cerrado)
                    setShowFirmasModal(false);
                    
                    // Mostrar mensaje de "Pedido cerrado" como antes funcionaba
                    Alert.alert(
                        '✅ Pedido Cerrado',
                        'El pedido se ha guardado offline y se sincronizará automáticamente al recuperar internet.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    // Limpiar estados
                                    setDataCierrePendiente(null);
                                    setFirmaConductor(null);
                                    setFirmaUsuario(null);
                                    setFirmasGuardadas(null);
                                    confirmacionAlertShownRef.current = false;
                                    // Cerrar ambos modales: el de cerrar pedido y el de firmas
                                    onClose();
                                }
                            }
                        ],
                        { cancelable: true }
                    );
                    return;
                } catch (queueErr: any) {
                    console.error('❌ Error agregando a cola offline:', queueErr);
                    const queueErrorText = formatFullError(queueErr);

                    // Desactivar preloader en caso de error
                    setIsClosing(false);

                    // Limpiar estados
                    setDataCierrePendiente(null);
                    setFirmaConductor(null);
                    setFirmaUsuario(null);
                    setFirmasGuardadas(null);
                    confirmacionAlertShownRef.current = false;

                    Alert.alert(
                        'Error al guardar offline',
                        `No se pudo agregar a la cola de sincronización:\n\n${queueErrorText}`,
                        [
                            {
                                text: 'Copiar',
                                onPress: () => {
                                    copyToClipboard(`Error al guardar offline:\n${queueErrorText}`);
                                }
                            },
                            { text: 'OK' }
                        ],
                        { cancelable: true }
                    );
                    return;
                }
            }

            // Solo mostrar error si NO es un error de red (otros errores del servidor, validaciones, etc.)
            const errorText = formatFullError(error);

            // Limpiar estados en caso de error
            setDataCierrePendiente(null);
            setFirmaConductor(null);
            setFirmaUsuario(null);
            setFirmasGuardadas(null);

            Alert.alert(
                'Error al cerrar el pedido',
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

    const handleGuardarNovedad = () => {
        if (novedad.length < 4) {
            Alert.alert('Error', 'Inserte alguna novedad (mínimo 4 caracteres)');
            return;
        }
        // Abrir modal de selección de motivo antes de guardar
        setShowMotivoModal(true);
    };

    const handleConfirmarMotivo = () => {
        if (!motivoSeleccionado) {
            Alert.alert('Error', 'Por favor seleccione un motivo para la novedad');
            return;
        }

        // Encontrar el motivo completo seleccionado
        const selectedMotivo = motivoNoCierre.find(m => m.key === motivoSeleccionado);
        if (!selectedMotivo) {
            Alert.alert('Error', 'Motivo seleccionado no válido');
            return;
        }

        // Cerrar modal y llamar a la función con el motivo seleccionado
        setShowMotivoModal(false);
        onGuardarNovedad(novedad, pedidoId, selectedMotivo.key);
        // Limpiar selección
        setMotivoSeleccionado('');
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

    // No renderizar nada si no está visible
    if (!visible) {
        return null;
    }

    return (
        <Modal
            key={`cerrar-pedido-modal-${pedidoId || 'default'}`}
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
                {/* Overlay de preloader durante el cierre */}
                {isClosing && (
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 100000,
                        elevation: 30,
                    }}>
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            padding: 30,
                            alignItems: 'center',
                            minWidth: 200,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.3,
                            shadowRadius: 10,
                            elevation: 25,
                        }}>
                            <ActivityIndicator size="large" color="#007bff" />
                            <Text style={{
                                marginTop: 20,
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#333',
                                textAlign: 'center',
                            }}>
                                Cerrando pedido...
                            </Text>
                            <Text style={{
                                marginTop: 8,
                                fontSize: 14,
                                color: '#666',
                                textAlign: 'center',
                            }}>
                                Por favor espere
                            </Text>
                        </View>
                    </View>
                )}
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
                                    {entregado ? 'Editar Cierre' : 'Cerrar Pedido'}
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#666',
                                    marginTop: 2
                                }}>
                                    {entregado ? 'Modifique y guarde la información del cierre' : 'Complete la información para finalizar'}
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
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        <View style={{ padding: 20 }}>
                            {false ? (
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
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => setImagenExpandida(true)}
                                                style={{
                                                    borderRadius: 12,
                                                    overflow: 'hidden',
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 4 },
                                                    shadowOpacity: 0.1,
                                                    shadowRadius: 8,
                                                    elevation: 4
                                                }}
                                            >
                                                <Image
                                                    source={{ uri: imagenCerrar }}
                                                    style={{
                                                        width: width * 0.7,
                                                        height: width * 0.7 * 0.75, // Aspect ratio 4:3
                                                        borderRadius: 12
                                                    }}
                                                    resizeMode="cover"
                                                />
                                            </TouchableOpacity>
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
                                            <Text style={{
                                                color: '#666',
                                                fontSize: 12,
                                                marginTop: 8,
                                                textAlign: 'center',
                                                fontStyle: 'italic'
                                            }}>
                                                Toca la imagen para expandir
                                            </Text>
                                        </View>
                                    )}

                                    {/* Modal para imagen expandida */}
                                    <Modal
                                        visible={imagenExpandida}
                                        transparent={true}
                                        animationType="fade"
                                        onRequestClose={() => setImagenExpandida(false)}
                                    >
                                        <View style={{
                                            flex: 1,
                                            backgroundColor: 'rgba(0, 0, 0, 0.95)',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() => setImagenExpandida(false)}
                                                style={{
                                                    position: 'absolute',
                                                    top: 40,
                                                    right: 20,
                                                    zIndex: 10,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                    borderRadius: 20,
                                                    width: 40,
                                                    height: 40,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <FontAwesome name="times" style={{ fontSize: 24, color: '#fff' }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() => setImagenExpandida(false)}
                                                style={{
                                                    width: width,
                                                    height: height,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Image
                                                    source={{ uri: imagenCerrar }}
                                                    style={{
                                                        width: width * 0.95,
                                                        height: height * 0.8,
                                                    }}
                                                    resizeMode="contain"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </Modal>

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
                                // Formulario para cerrar/editar pedido
                                <View>
                                    {entregado && (
                                        <View style={{
                                            backgroundColor: '#fff3cd',
                                            borderRadius: 10,
                                            paddingHorizontal: 12,
                                            paddingVertical: 10,
                                            borderWidth: 1,
                                            borderColor: '#ffe69c',
                                            marginBottom: 14
                                        }}>
                                            <Text style={{ color: '#7a5a00', fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
                                                Modo edición: puedes actualizar los datos del cierre.
                                            </Text>
                                        </View>
                                    )}

                                    {/* Sección de foto */}
                                    <TomarFoto
                                        source={imagen ? [{ uri: imagen }] : []}
                                        titulo=''
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
                                                fontSize: 12,
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
                                                <FontAwesome name="balance-scale" style={{ fontSize: 12, color: '#666', marginRight: 8 }} />
                                                <TextInput
                                                    placeholder="Ej: 120.5"
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
                                                        fontSize: 14,
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
                                                <FontAwesome name="file-text-o" style={{ fontSize: 12, color: '#666', marginRight: 10 }} />
                                                <TextInput
                                                    placeholder="Ej: 001234"
                                                    placeholderTextColor="#999"
                                                    value={factura}
                                                    onChangeText={setFactura}
                                                    style={{
                                                        flex: 1,
                                                        fontSize: 14,
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
                                                        fontSize: 14,
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
                                                    placeholder="Ej: FV-135000"
                                                    placeholderTextColor="#999"
                                                    value={remision}
                                                    onChangeText={setRemision}
                                                    keyboardType="numeric"
                                                    style={{
                                                        flex: 1,
                                                        fontSize: 14,
                                                        color: '#333',
                                                        paddingVertical: 12
                                                    }}
                                                />
                                            </View>
                                        </View>

                                        {/* Forma de pago */}
                                        <View>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: 8
                                            }}>
                                                Forma de Pago *
                                            </Text>
                                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                                <TouchableOpacity
                                                    style={{
                                                        flex: 1,
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
                                                                fontSize: 14,
                                                                color: formaPago === 'Contado' ? '#2196f3' : '#666',
                                                                marginRight: 12
                                                            }}
                                                        />
                                                        <Text style={{
                                                            fontSize: 16,
                                                            fontWeight: '600',
                                                            color: formaPago === 'Contado' ? '#2196f3' : '#333'
                                                        }}>
                                                            Contado
                                                        </Text>
                                                    </View>
                                                    {formaPago === 'Contado' && (
                                                        <FontAwesome
                                                            name="check-circle"
                                                            style={{ fontSize: 14, color: '#2196f3' }}
                                                        />
                                                    )}
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={{
                                                        flex: 1,
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
                                                            Crédito
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
                                                {entregado ? 'Guardar Cambios' : 'Cerrar Pedido'}
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

            {/* Modal de selección de motivo */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showMotivoModal}
                onRequestClose={() => setShowMotivoModal(false)}
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
                        width: width * 0.9,
                        maxHeight: height * 0.8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 25,
                        zIndex: 99999,
                    }}>
                        {/* Header del modal de motivo */}
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
                                    backgroundColor: '#ffc107',
                                    borderRadius: 10,
                                    padding: 8,
                                    marginRight: 12
                                }}>
                                    <FontAwesome
                                        name="exclamation-triangle"
                                        style={{ fontSize: 20, color: '#fff' }}
                                    />
                                </View>
                                <View>
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}>
                                        Motivo de la Novedad
                                    </Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#666',
                                        marginTop: 2
                                    }}>
                                        Seleccione el motivo por el cual no se puede entregar
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => setShowMotivoModal(false)}
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

                        {/* Contenido del modal de motivo */}
                        <ScrollView
                            style={{ maxHeight: height * 0.6 }}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                        >
                            <View style={{ padding: 20 }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: 16,
                                    textAlign: 'center'
                                }}>
                                    📋 Seleccione una opción:
                                </Text>

                                <View style={{ gap: 12 }}>
                                    {motivoNoCierre.map((motivo, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={{
                                                backgroundColor: motivoSeleccionado === motivo.key ? '#e3f2fd' : '#f8f9fa',
                                                borderRadius: 12,
                                                paddingHorizontal: 16,
                                                borderWidth: 2,
                                                borderColor: motivoSeleccionado === motivo.key ? '#2196f3' : '#e9ecef',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                height: 50
                                            }}
                                            onPress={() => setMotivoSeleccionado(motivo.key)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={{
                                                flex: 1,
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: motivoSeleccionado === motivo.key ? '#2196f3' : '#333',
                                                textAlignVertical: 'center',
                                                includeFontPadding: false
                                            }}>
                                                {motivo.key} {motivo.label.replace(motivo.key, '').trim()}
                                            </Text>
                                            {motivoSeleccionado === motivo.key && (
                                                <FontAwesome
                                                    name="check-circle"
                                                    style={{ fontSize: 18, color: '#2196f3', marginLeft: 8 }}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        {/* Botones del modal de motivo */}
                        <View style={{
                            padding: 20,
                            borderTopWidth: 1,
                            borderTopColor: '#e9ecef',
                            gap: 12
                        }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: !motivoSeleccionado ? '#ccc' : '#007bff',
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
                                onPress={handleConfirmarMotivo}
                                disabled={!motivoSeleccionado}
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
                                    Confirmar y Guardar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#6c757d',
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
                                onPress={() => setShowMotivoModal(false)}
                                activeOpacity={0.8}
                            >
                                <FontAwesome name="times" style={{
                                    fontSize: 18,
                                    color: '#fff',
                                    marginRight: 10
                                }} />
                                <Text style={{
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: '600'
                                }}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de Firmas Digitales */}
            <FirmaModal
                visible={showFirmasModal}
                onClose={() => {
                    setShowFirmasModal(false);
                    setDataCierrePendiente(null);
                }}
                onSave={handleFirmasGuardadas}
                pedidoId={pedidoId || ''}
            />

        </Modal>
    );
};

export default CerrarPedidoModal;
