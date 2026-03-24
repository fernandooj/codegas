import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator, TextInput } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { safetyChecklistQuestions } from '../../utils/constants';
import type { ChecklistItem } from '../../utils/constants.types';

/** Payload guardado en pedidos.tanques (mismo cuerpo que envía PUT /tanques) */
export type SavedTanqueChecklistPayload = {
    tanque_id: number;
    checklist: { pregunta: string; respuesta: string }[];
    observacion: string | null;
};
import { style } from './style';
import { updateTanquesHTTP } from '../../redux/actions/pedidoActions';
import { useSyncQueue } from '../../hooks/useSyncQueue';
import { SyncOperationType } from '../../services/syncQueueService';
import { shareSafetyChecklistPdf, type SafetyChecklistPdfMeta } from './safetyChecklistPdf';

interface SafetyChecklistModalProps {
    visible: boolean;
    onClose: () => void;
    pedidoId: string;
    tanqueId: number; // ID del tanque seleccionado
    initialChecklist?: ChecklistItem[];
    initialObservacion?: string | null;
    /** Datos del pedido/tanque para el encabezado del PDF (formato calidad). */
    checklistPdfMeta?: SafetyChecklistPdfMeta;
    onSave?: (checklist: ChecklistItem[], observacion: string, savedTanquesPatch?: SavedTanqueChecklistPayload) => void;
}

const SafetyChecklistModal: React.FC<SafetyChecklistModalProps> = ({
    visible,
    onClose,
    pedidoId,
    tanqueId,
    initialChecklist = [],
    initialObservacion = null,
    checklistPdfMeta,
    onSave
}) => {
    const { addToQueue, isOnline } = useSyncQueue();
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [observacion, setObservacion] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [pdfBusy, setPdfBusy] = useState(false);
    const [activeTab, setActiveTab] = useState<'lista' | 'observaciones'>('lista');

    // Refs para rastrear cambios y forzar reinicialización
    const lastPedidoIdRef = useRef<string>('');
    const lastInitialChecklistRef = useRef<any>(null);

    // Función para normalizar el checklist
    const normalizeChecklist = (rawChecklist: any): ChecklistItem[] => {
        console.log('🔍 [SafetyChecklistModal] normalizeChecklist - rawChecklist recibido:', {
            rawChecklist,
            type: typeof rawChecklist,
            isArray: Array.isArray(rawChecklist),
            isString: typeof rawChecklist === 'string',
            isNull: rawChecklist === null,
            isUndefined: rawChecklist === undefined
        });

        let parsedChecklist: ChecklistItem[] = [];

        // Si es null o undefined, retornar array vacío
        if (rawChecklist === null || rawChecklist === undefined) {
            console.log('⚠️ [SafetyChecklistModal] Checklist es null o undefined, inicializando vacío');
            parsedChecklist = [];
        }
        // Si viene como string JSON, parsearlo
        else if (typeof rawChecklist === 'string') {
            try {
                // Intentar parsear como JSON
                const parsed = JSON.parse(rawChecklist);
                console.log('✅ [SafetyChecklistModal] Checklist parseado desde string:', parsed);
                parsedChecklist = Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                console.error('❌ Error parseando checklist como JSON:', error);
                parsedChecklist = [];
            }
        }
        // Si ya es un array, usarlo directamente
        else if (Array.isArray(rawChecklist)) {
            console.log('✅ [SafetyChecklistModal] Checklist ya es un array:', rawChecklist);
            parsedChecklist = rawChecklist;
        }
        // Si es un objeto (puede ser JSONB parseado), intentar convertirlo
        else if (typeof rawChecklist === 'object') {
            console.log('⚠️ [SafetyChecklistModal] Checklist es un objeto, intentando convertir:', rawChecklist);
            // Si tiene una propiedad que es un array, usarla
            if (rawChecklist.data && Array.isArray(rawChecklist.data)) {
                parsedChecklist = rawChecklist.data;
            } else {
                // Intentar convertir el objeto a array
                parsedChecklist = Object.values(rawChecklist).filter((item: any) =>
                    item && typeof item === 'object' && typeof item.id === 'number'
                ) as ChecklistItem[];
            }
        }

        console.log('📋 [SafetyChecklistModal] Checklist parseado:', parsedChecklist);

        // Crear un mapa del checklist parseado para acceso rápido
        const checklistMap = new Map<number, boolean>();
        parsedChecklist.forEach((item: any) => {
            if (item && typeof item === 'object') {
                // Manejar diferentes formatos posibles
                const id = item.id !== undefined ? Number(item.id) : null;
                const status = item.status !== undefined ? Boolean(item.status) : false;

                if (id !== null && !isNaN(id)) {
                    checklistMap.set(id, status);
                    console.log(`  ✓ Item ${id}: status=${status}`);
                } else {
                    console.warn(`  ⚠️ Item inválido ignorado:`, item);
                }
            }
        });

        console.log('📊 [SafetyChecklistModal] Mapa de checklist creado:', Array.from(checklistMap.entries()));

        // Normalizar: crear un checklist completo con todas las preguntas
        // Si una pregunta está en el checklist inicial, usar su status, si no, usar false
        const normalizedChecklist = safetyChecklistQuestions.map(q => {
            const status = checklistMap.has(q.id) ? checklistMap.get(q.id)! : false;
            return {
                id: q.id,
                status: status
            };
        });

        console.log('✅ [SafetyChecklistModal] Checklist normalizado:', {
            totalQuestions: safetyChecklistQuestions.length,
            itemsWithTrue: normalizedChecklist.filter(item => item.status === true).length,
            normalizedChecklist
        });

        return normalizedChecklist;
    };

    // Inicializar checklist cuando se abre el modal
    useEffect(() => {
        if (visible) {
            // Siempre reinicializar cuando el modal se abre para asegurar que se use el initialChecklist más reciente
            console.log('🔄 [SafetyChecklistModal] Modal abierto, reinicializando estado...');
            console.log('📋 initialChecklist recibido:', initialChecklist);
            console.log('🆔 PedidoId:', pedidoId);

            // Actualizar refs
            lastPedidoIdRef.current = pedidoId;
            lastInitialChecklistRef.current = initialChecklist;

            // Normalizar el checklist inicial
            const normalizedChecklist = normalizeChecklist(initialChecklist);
            setChecklist(normalizedChecklist);

            // Cargar observación inicial (si existe)
            setObservacion(initialObservacion || '');
        } else {
            // Cuando el modal se cierra, no hacer nada aquí
            // El estado se mantendrá hasta que se vuelva a abrir
            // El ref se actualizará cuando se vuelva a abrir el modal
            console.log('🧹 [SafetyChecklistModal] Modal cerrado');
        }
    }, [visible, pedidoId, initialChecklist, initialObservacion]);

    // Toggle status de una pregunta
    const toggleStatus = (questionId: number) => {
        setChecklist(prev => {
            const existing = prev.find(item => item.id === questionId);

            if (existing) {
                // Si existe, toggle el status
                return prev.map(item =>
                    item.id === questionId
                        ? { ...item, status: !item.status }
                        : item
                );
            } else {
                // Si no existe, agregarlo con status true
                return [...prev, { id: questionId, status: true }];
            }
        });
    };

    // Obtener status de una pregunta
    const getStatus = (questionId: number): boolean => {
        const item = checklist.find(i => i.id === questionId);
        return item ? item.status : false;
    };

    // Guardar checklist y observaciones en el campo tanques del pedido
    const handleSave = async () => {
        try {
            setSaving(true);

            const tid = Number(tanqueId);
            if (!pedidoId) {
                Alert.alert('Error', 'No se identificó el pedido');
                setSaving(false);
                return;
            }
            if (!Number.isFinite(tid) || tid <= 0) {
                Alert.alert('Error', 'No se identificó el tanque. Vuelva a elegirlo en la lista de tanques.');
                setSaving(false);
                return;
            }

            // Validar que haya al menos una respuesta
            if (checklist.length === 0) {
                Alert.alert('Error', 'Por favor completa al menos una pregunta');
                setSaving(false);
                return;
            }

            // Convertir checklist al formato esperado: [{"pregunta": "texto", "respuesta": "Sí/No"}]
            const checklistFormatted = checklist.map(item => {
                const question = safetyChecklistQuestions.find(q => q.id === item.id);
                return {
                    pregunta: question?.question || `Pregunta ${item.id}`,
                    respuesta: item.status ? 'Sí' : 'No'
                };
            });

            const tanqueData: SavedTanqueChecklistPayload = {
                tanque_id: tid,
                checklist: checklistFormatted,
                observacion: observacion.trim() ? observacion.trim() : null
            };

            console.log('💾 Guardando checklist para pedido:', pedidoId, 'tanque:', tid);
            console.log('📋 Checklist a guardar:', checklistFormatted);
            console.log('📝 Observación:', tanqueData.observacion);
            console.log('🌐 Estado de conexión:', isOnline ? 'ONLINE' : 'OFFLINE');

            if (isOnline) {
                // Si hay internet, guardar directamente
                const response = await updateTanquesHTTP(pedidoId, tanqueData);
                console.log('✅ Respuesta de guardar:', response);

                if (response.status) {
                    // Actualizar el ref del checklist guardado
                    lastInitialChecklistRef.current = checklist;

                    Alert.alert(
                        'Éxito',
                        'Lista de chequeo y observaciones guardadas correctamente',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    onSave?.(checklist, observacion || '', tanqueData);
                                    onClose();
                                }
                            }
                        ]
                    );
                } else {
                    Alert.alert('Error', response.message || 'No se pudo guardar la lista de chequeo');
                }
            } else {
                // Si NO hay internet, guardar en cola de sincronización
                await addToQueue(
                    SyncOperationType.UPDATE_PEDIDO,
                    {
                        pedidoId: pedidoId,
                        updateTanques: tanqueData
                    }
                );

                // Actualizar el ref del checklist guardado
                lastInitialChecklistRef.current = checklist;

                onSave?.(checklist, observacion || '', tanqueData);

                Alert.alert(
                    '📴 Sin Conexión',
                    'La lista de chequeo y observaciones se guardaron localmente y se enviarán automáticamente cuando haya internet',
                    [
                        {
                            text: 'Entendido',
                            onPress: () => {
                                onClose();
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('❌ Error guardando checklist:', error);
            Alert.alert('Error', 'Error al guardar la lista de chequeo');
        } finally {
            setSaving(false);
        }
    };

    const buildChecklistForExport = () =>
        checklist.map((item) => {
            const question = safetyChecklistQuestions.find((q) => q.id === item.id);
            return {
                pregunta: question?.question || `Pregunta ${item.id}`,
                respuesta: item.status ? 'Sí' : 'No'
            };
        });

    const handleDownloadPdf = async () => {
        try {
            setPdfBusy(true);
            const meta: SafetyChecklistPdfMeta = {
                ...checklistPdfMeta,
                pedidoId: checklistPdfMeta?.pedidoId || pedidoId
            };
            await shareSafetyChecklistPdf(buildChecklistForExport(), observacion, meta);
        } catch (e) {
            console.error('Error generando PDF checklist:', e);
            Alert.alert('Error', 'No se pudo generar el PDF. Intente de nuevo.');
        } finally {
            setPdfBusy(false);
        }
    };

    // Verificar si todos están marcados
    const allChecked = checklist.length === safetyChecklistQuestions.length &&
        checklist.every(item => item.status === true);

    // Contar respuestas
    const countYes = checklist.filter(item => item.status === true).length;
    const countNo = checklist.filter(item => item.status === false).length;

    // Debug
    console.log('🔍 [SafetyChecklistModal] Preguntas disponibles:', safetyChecklistQuestions.length);
    console.log('🔍 [SafetyChecklistModal] Checklist actual:', checklist);
    console.log('🔍 [SafetyChecklistModal] Preguntas:', safetyChecklistQuestions);

    // Debug: Log cuando el modal debería mostrarse
    useEffect(() => {
        console.log('🔍 [SafetyChecklistModal] visible prop:', visible);
        console.log('🔍 [SafetyChecklistModal] pedidoId:', pedidoId);
        console.log('🔍 [SafetyChecklistModal] tanqueId:', tanqueId);
    }, [visible, pedidoId, tanqueId]);

    return (
        <>
            <Modal
                visible={visible}
                transparent={true}
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={style.checklistModalOverlay}>
                    <View style={[style.checklistModalContainer, { display: 'flex' }]}>
                        {/* Header */}
                        <View style={style.checklistModalHeader}>
                            <View style={style.checklistModalHeaderLeft}>
                                <FontAwesome name="shield" style={style.checklistModalIcon} />
                                <Text style={style.checklistModalTitle}>
                                    Lista de Chequeo de Seguridad
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={style.checklistModalCloseButton}>
                                <FontAwesome name="times" style={style.checklistModalCloseIcon} />
                            </TouchableOpacity>
                        </View>

                        {/* Stats Bar */}
                        <View style={style.checklistStatsBar}>
                            <View style={style.checklistStat}>
                                <FontAwesome name="check-circle" style={style.checklistStatIconYes} />
                                <Text style={style.checklistStatText}>
                                    <Text style={style.checklistStatNumber}>{countYes}</Text> Sí
                                </Text>
                            </View>
                            <View style={style.checklistStat}>
                                <FontAwesome name="times-circle" style={style.checklistStatIconNo} />
                                <Text style={style.checklistStatText}>
                                    <Text style={style.checklistStatNumber}>{countNo}</Text> No
                                </Text>
                            </View>
                            <View style={style.checklistStat}>
                                <FontAwesome name="list" style={style.checklistStatIconTotal} />
                                <Text style={style.checklistStatText}>
                                    <Text style={style.checklistStatNumber}>{safetyChecklistQuestions.length}</Text> Total
                                </Text>
                            </View>
                        </View>

                        {/* Progress Bar */}
                        <View style={style.checklistProgressContainer}>
                            <View style={style.checklistProgressBar}>
                                <View
                                    style={[
                                        style.checklistProgressFill,
                                        {
                                            width: `${(countYes / safetyChecklistQuestions.length) * 100}%`,
                                            backgroundColor: allChecked ? '#28a745' : '#007bff'
                                        }
                                    ]}
                                />
                            </View>
                            <Text style={style.checklistProgressText}>
                                {Math.round((countYes / safetyChecklistQuestions.length) * 100)}%
                            </Text>
                        </View>

                        {/* Tabs Navigation */}
                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: '#f8f9fa',
                            borderBottomWidth: 1,
                            borderBottomColor: '#dee2e6',
                            paddingHorizontal: 16,
                            paddingTop: 8
                        }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    alignItems: 'center',
                                    borderBottomWidth: 2,
                                    borderBottomColor: activeTab === 'lista' ? '#002587' : 'transparent',
                                    marginRight: 8
                                }}
                                onPress={() => setActiveTab('lista')}
                                activeOpacity={0.7}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesome
                                        name="list"
                                        style={{
                                            fontSize: 16,
                                            color: activeTab === 'lista' ? '#002587' : '#6c757d',
                                            marginRight: 6
                                        }}
                                    />
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: activeTab === 'lista' ? '700' : '500',
                                        color: activeTab === 'lista' ? '#002587' : '#6c757d'
                                    }}>
                                        Lista
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    alignItems: 'center',
                                    borderBottomWidth: 2,
                                    borderBottomColor: activeTab === 'observaciones' ? '#002587' : 'transparent',
                                    marginLeft: 8
                                }}
                                onPress={() => setActiveTab('observaciones')}
                                activeOpacity={0.7}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesome
                                        name="sticky-note"
                                        style={{
                                            fontSize: 16,
                                            color: activeTab === 'observaciones' ? '#002587' : '#6c757d',
                                            marginRight: 6
                                        }}
                                    />
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: activeTab === 'observaciones' ? '700' : '500',
                                        color: activeTab === 'observaciones' ? '#002587' : '#6c757d'
                                    }}>
                                        Observaciones
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Tab Content */}
                        {activeTab === 'lista' ? (
                            <ScrollView
                                style={style.checklistQuestionsContainer}
                                contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
                                showsVerticalScrollIndicator={true}
                                nestedScrollEnabled={true}
                            >
                                {!safetyChecklistQuestions || safetyChecklistQuestions.length === 0 ? (
                                    <View style={{ padding: 40, alignItems: 'center' }}>
                                        <Text style={{ color: '#dc3545', fontSize: 16, fontWeight: 'bold' }}>
                                            ⚠️ Error: No se cargaron las preguntas
                                        </Text>
                                        <Text style={{ marginTop: 8, color: '#666' }}>
                                            Total: {safetyChecklistQuestions?.length || 0}
                                        </Text>
                                    </View>
                                ) : (
                                    safetyChecklistQuestions.map((question) => {
                                        const isChecked = getStatus(question.id);

                                        return (
                                            <View
                                                key={question.id}
                                                style={[
                                                    style.checklistQuestionCard,
                                                    isChecked ? style.checklistQuestionCardChecked : style.checklistQuestionCardUnchecked
                                                ]}
                                            >
                                                {/* Question Number & Text */}
                                                <View style={style.checklistQuestionHeader}>
                                                    <View style={style.checklistQuestionNumberBadge}>
                                                        <Text style={style.checklistQuestionNumber}>{question.id}</Text>
                                                    </View>
                                                    <Text style={style.checklistQuestionText}>
                                                        {question.question}
                                                    </Text>
                                                </View>

                                                {/* Action Buttons */}
                                                <View style={style.checklistQuestionActions}>
                                                    <TouchableOpacity
                                                        style={[
                                                            style.checklistButton,
                                                            isChecked
                                                                ? style.checklistButtonYesActive
                                                                : style.checklistButtonYesInactive
                                                        ]}
                                                        onPress={() => toggleStatus(question.id)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <FontAwesome
                                                            name="check"
                                                            style={[
                                                                style.checklistButtonIcon,
                                                                isChecked
                                                                    ? style.checklistButtonIconActive
                                                                    : style.checklistButtonIconInactive
                                                            ]}
                                                        />
                                                        <Text
                                                            style={[
                                                                style.checklistButtonText,
                                                                isChecked
                                                                    ? style.checklistButtonTextActive
                                                                    : style.checklistButtonTextInactive
                                                            ]}
                                                        >
                                                            Sí
                                                        </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={[
                                                            style.checklistButton,
                                                            !isChecked
                                                                ? style.checklistButtonNoActive
                                                                : style.checklistButtonNoInactive
                                                        ]}
                                                        onPress={() => {
                                                            const item = checklist.find(i => i.id === question.id);
                                                            if (item && item.status) {
                                                                toggleStatus(question.id);
                                                            }
                                                        }}
                                                        activeOpacity={0.7}
                                                    >
                                                        <FontAwesome
                                                            name="times"
                                                            style={[
                                                                style.checklistButtonIcon,
                                                                !isChecked
                                                                    ? style.checklistButtonIconActive
                                                                    : style.checklistButtonIconInactive
                                                            ]}
                                                        />
                                                        <Text
                                                            style={[
                                                                style.checklistButtonText,
                                                                !isChecked
                                                                    ? style.checklistButtonTextActive
                                                                    : style.checklistButtonTextInactive
                                                            ]}
                                                        >
                                                            No
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    })
                                )}
                            </ScrollView>
                        ) : (
                            <ScrollView
                                style={{ flex: 1 }}
                                contentContainerStyle={{ padding: 20, flexGrow: 1 }}
                                showsVerticalScrollIndicator={true}
                            >
                                <View style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 12,
                                    padding: 16,
                                    borderWidth: 1,
                                    borderColor: '#dee2e6',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 2,
                                    elevation: 1
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 16
                                    }}>
                                        <View style={{
                                            backgroundColor: '#e3f2fd',
                                            borderRadius: 8,
                                            padding: 8,
                                            marginRight: 12
                                        }}>
                                            <FontAwesome
                                                name="sticky-note"
                                                style={{
                                                    fontSize: 20,
                                                    color: '#002587'
                                                }}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: '700',
                                                color: '#212529',
                                                marginBottom: 4
                                            }}>
                                                Observaciones del Checklist
                                            </Text>
                                            <Text style={{
                                                fontSize: 12,
                                                color: '#6c757d'
                                            }}>
                                                Ingrese cualquier observación adicional sobre el checklist de seguridad
                                            </Text>
                                        </View>
                                    </View>
                                    <TextInput
                                        style={{
                                            backgroundColor: '#f8f9fa',
                                            borderWidth: 1.5,
                                            borderColor: observacion ? '#002587' : '#dee2e6',
                                            borderRadius: 10,
                                            padding: 16,
                                            fontSize: 15,
                                            color: '#212529',
                                            minHeight: 200,
                                            textAlignVertical: 'top',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 2,
                                            elevation: 1
                                        }}
                                        placeholder="Ingrese observaciones sobre el checklist..."
                                        placeholderTextColor="#adb5bd"
                                        value={observacion}
                                        onChangeText={setObservacion}
                                        multiline
                                        numberOfLines={10}
                                    />
                                </View>
                            </ScrollView>
                        )}

                        {/* Footer Actions */}
                        <View style={style.checklistModalFooter}>
                            <TouchableOpacity
                                style={style.checklistCancelButton}
                                onPress={onClose}
                                disabled={saving || pdfBusy}
                            >
                                <FontAwesome name="ban" style={style.checklistCancelIcon} />
                                <Text style={style.checklistCancelText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    style.checklistPdfButton,
                                    (saving || pdfBusy) && style.checklistPdfButtonDisabled
                                ]}
                                onPress={handleDownloadPdf}
                                disabled={saving || pdfBusy}
                            >
                                {pdfBusy ? (
                                    <ActivityIndicator size="small" color="#002587" />
                                ) : (
                                    <>
                                        <FontAwesome name="file-pdf-o" style={style.checklistPdfIcon} />
                                        <Text style={style.checklistPdfText}>PDF</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    style.checklistSaveButton,
                                    saving && style.checklistSaveButtonDisabled
                                ]}
                                onPress={handleSave}
                                disabled={saving || pdfBusy}
                            >
                                {saving ? (
                                    <>
                                        <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                                        <Text style={style.checklistSaveText}>Guardando...</Text>
                                    </>
                                ) : (
                                    <>
                                        <FontAwesome name="save" style={style.checklistSaveIcon} />
                                        <Text style={style.checklistSaveText}>
                                            Guardar Lista
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default SafetyChecklistModal;

