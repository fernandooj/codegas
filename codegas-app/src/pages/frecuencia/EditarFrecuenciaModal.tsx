import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { style } from './style';
import { PedidoFrecuencia, FrecuenciaEditData, EditarFrecuenciaModalProps } from './EditarFrecuenciaModal.types';

type TipoUiFrecuencia = 'por_semana' | 'mensual';

/** Quincenal antiguo por calendario (1–15 y 16–31): al editar se migra a mensual (un solo día del mes). */
function isLegacyQuincenalCalendario(d1?: string | number, d2?: string | number): boolean {
    const a = parseInt(String(d1 ?? ''), 10);
    const b = parseInt(String(d2 ?? ''), 10);
    return Number.isFinite(a) && Number.isFinite(b) && a >= 1 && a <= 15 && b >= 16 && b <= 31;
}

const EditarFrecuenciaModal: React.FC<EditarFrecuenciaModalProps> = ({
    visible,
    onClose,
    frecuencia,
    onSuccess
}) => {
    const [formData, setFormData] = useState<FrecuenciaEditData>({
        forma: 'cantidad',
        cantidadKl: 0,
        cantidadPrecio: 0,
        frecuencia: 'semanal',
        dia1: '',
        dia2: ''
    });
    const [tipoUiFrecuencia, setTipoUiFrecuencia] = useState<TipoUiFrecuencia>('por_semana');
    const [intervaloSemanas, setIntervaloSemanas] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (frecuencia && visible) {
            const freq = frecuencia.frecuencia || 'semanal';

            if (freq === 'mensual') {
                setTipoUiFrecuencia('mensual');
                setIntervaloSemanas(1);
                const d2 = Number(frecuencia.dia2);
                setFormData({
                    forma: frecuencia.forma || 'cantidad',
                    cantidadKl: frecuencia.cantidadKl || 0,
                    cantidadPrecio: frecuencia.cantidadPrecio || 0,
                    frecuencia: 'mensual',
                    dia1: frecuencia.dia1 !== '' && frecuencia.dia1 !== undefined ? String(frecuencia.dia1) : '',
                    dia2: !Number.isNaN(d2) && d2 >= 1 && d2 <= 7 ? d2 : ''
                });
                return;
            }

            if (freq === 'quincenal' && isLegacyQuincenalCalendario(frecuencia.dia1, frecuencia.dia2)) {
                setTipoUiFrecuencia('mensual');
                setIntervaloSemanas(1);
                setFormData({
                    forma: frecuencia.forma || 'cantidad',
                    cantidadKl: frecuencia.cantidadKl || 0,
                    cantidadPrecio: frecuencia.cantidadPrecio || 0,
                    frecuencia: 'mensual',
                    dia1: String(frecuencia.dia1 ?? ''),
                    dia2: ''
                });
                return;
            }

            // Igual que grupos (semanal): día L–D + intervalo 1 / 2 / 3 semanas → semanal / quincenal / tressemanas en BD
            setTipoUiFrecuencia('por_semana');
            let intv: 1 | 2 | 3 = 1;
            if (freq === 'semanal') intv = 1;
            else if (freq === 'quincenal') intv = 2;
            else if (freq === 'tressemanas') intv = 3;
            setIntervaloSemanas(intv);

            const n1 = Number(frecuencia.dia1);
            const diaSemana =
                !Number.isNaN(n1) && n1 >= 1 && n1 <= 7 ? n1 : '';

            setFormData({
                forma: frecuencia.forma || 'cantidad',
                cantidadKl: frecuencia.cantidadKl || 0,
                cantidadPrecio: frecuencia.cantidadPrecio || 0,
                frecuencia: freq === 'tressemanas' ? 'tressemanas' : freq === 'quincenal' ? 'quincenal' : 'semanal',
                dia1: diaSemana,
                dia2: ''
            });
        }
    }, [frecuencia, visible]);

    const handleInputChange = (field: keyof FrecuenciaEditData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.forma) {
            Alert.alert('Error', 'La forma del pedido es requerida');
            return false;
        }

        if (formData.forma === 'cantidad' && (!formData.cantidadKl || formData.cantidadKl <= 0)) {
            Alert.alert('Error', 'Cantidad en KL debe ser mayor a 0');
            return false;
        }

        if (formData.forma === 'monto' && (!formData.cantidadPrecio || formData.cantidadPrecio <= 0)) {
            Alert.alert('Error', 'Cantidad en precio debe ser mayor a 0');
            return false;
        }

        // Para "lleno" no se requiere cantidad ni monto
        if (formData.forma === 'lleno') {
            // No hay validaciones adicionales para lleno
        }

        if (tipoUiFrecuencia === 'por_semana') {
            const ds = Number(formData.dia1);
            if (formData.dia1 === '' || formData.dia1 === undefined || Number.isNaN(ds) || ds < 1 || ds > 7) {
                Alert.alert('Error', 'Debes seleccionar un día de la semana (Lunes a Domingo)');
                return false;
            }
        }

        if (tipoUiFrecuencia === 'mensual') {
            const dm = parseInt(String(formData.dia1), 10);
            if (!formData.dia1 || Number.isNaN(dm) || dm < 1 || dm > 31) {
                Alert.alert('Error', 'Elige un día del mes entre 1 y 31');
                return false;
            }
            const ds = Number(formData.dia2);
            if (formData.dia2 === '' || formData.dia2 === undefined || Number.isNaN(ds) || ds < 1 || ds > 7) {
                Alert.alert('Error', 'Debes seleccionar el día de la semana para frecuencia mensual (como en grupos)');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm() || !frecuencia) return;

        try {
            setLoading(true);

            let frecuenciaSend: PedidoFrecuencia['frecuencia'] = 'semanal';
            let dia1Send: number | null = null;
            let dia2Send: number | null = null;

            if (tipoUiFrecuencia === 'por_semana') {
                const wd = Number(formData.dia1);
                if (intervaloSemanas === 1) {
                    frecuenciaSend = 'semanal';
                    dia1Send = wd >= 1 && wd <= 7 ? wd : null;
                    dia2Send = null;
                } else if (intervaloSemanas === 2) {
                    frecuenciaSend = 'quincenal';
                    dia1Send = wd >= 1 && wd <= 7 ? wd : null;
                    dia2Send = dia1Send;
                } else {
                    frecuenciaSend = 'tressemanas';
                    dia1Send = wd >= 1 && wd <= 7 ? wd : null;
                    dia2Send = null;
                }
            } else {
                frecuenciaSend = 'mensual';
                const d = parseInt(String(formData.dia1), 10);
                const wd = Number(formData.dia2);
                dia1Send = Number.isFinite(d) && d >= 1 && d <= 31 ? d : null;
                dia2Send = Number.isFinite(wd) && wd >= 1 && wd <= 7 ? wd : null;
            }

            const dataToSend = {
                ...formData,
                frecuencia: frecuenciaSend,
                dia1: dia1Send,
                dia2: dia2Send
            };

            const response = await axios.put(`fre/frecuencia/${frecuencia.pedido_id}`, dataToSend);

            if (response.data.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Frecuencia Actualizada',
                    text2: 'La frecuencia se ha actualizado correctamente'
                });

                const row = response.data.data;
                const updatedFrecuencia: PedidoFrecuencia = {
                    ...frecuencia,
                    forma: (row?.forma as PedidoFrecuencia['forma']) || formData.forma,
                    cantidadKl: row?.cantidadkl ?? formData.cantidadKl,
                    cantidadPrecio: row?.cantidadprecio ?? formData.cantidadPrecio,
                    frecuencia: (row?.frecuencia as PedidoFrecuencia['frecuencia']) || frecuenciaSend,
                    dia1: row?.dia1 ?? dia1Send ?? undefined,
                    dia2: row?.dia2 ?? dia2Send ?? undefined
                };

                onSuccess(updatedFrecuencia);
                onClose();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error al actualizar',
                    text2: response.data.message || 'Hubo un problema al actualizar la frecuencia'
                });
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error de conexión',
                text2: error.response?.data?.message || 'Verifica tu conexión a internet'
            });
        } finally {
            setLoading(false);
        }
    };

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    // Función para convertir número de día a nombre del día
    const getDayName = (dayNumber: number): string => {
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        return dayNames[dayNumber - 1] || '';
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={style.modalContainer}>
                {/* Header */}
                <View style={style.modalHeader}>
                    <Text style={style.modalTitle}>Editar Frecuencia</Text>
                    <TouchableOpacity onPress={onClose} style={style.closeButton}>
                        <FontAwesome name="times" style={style.closeIcon} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={style.modalContent} showsVerticalScrollIndicator={false}>
                    {/* Información del cliente */}
                    {frecuencia && (
                        <View style={style.clientInfoContainer}>
                            <Text style={style.clientInfoTitle}>Cliente</Text>
                            <Text style={style.clientInfoName}>{frecuencia.nombre}</Text>
                            {frecuencia.razon_social && (
                                <Text style={style.clientInfoRazon}>{frecuencia.razon_social}</Text>
                            )}
                            <Text style={style.clientInfoCodigo}>Código: {frecuencia.codt}</Text>

                            {(frecuencia.punto_nombre ||
                                frecuencia.punto_direccion ||
                                frecuencia.zona_nombre) && (
                                <View style={style.clientInfoPuntoBlock}>
                                    <Text style={style.clientInfoPuntoTitle}>Punto de entrega</Text>
                                    {!!frecuencia.punto_nombre && (
                                        <Text style={style.clientInfoMetaLine}>
                                            <Text style={style.clientInfoMetaLabel}>Nombre: </Text>
                                            {frecuencia.punto_nombre}
                                        </Text>
                                    )}
                                    {!!frecuencia.punto_direccion && (
                                        <Text style={style.clientInfoMetaLine}>
                                            <Text style={style.clientInfoMetaLabel}>Dirección: </Text>
                                            {frecuencia.punto_direccion}
                                        </Text>
                                    )}
                                    {!!frecuencia.zona_nombre && (
                                        <Text style={style.clientInfoMetaLine}>
                                            <Text style={style.clientInfoMetaLabel}>Zona: </Text>
                                            {frecuencia.zona_nombre}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Forma de pedido */}
                    <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>Forma del Pedido *</Text>
                        <View style={style.radioContainer}>
                            <TouchableOpacity
                                style={[
                                    style.radioButton,
                                    formData.forma === 'cantidad' && style.radioButtonSelected
                                ]}
                                onPress={() => handleInputChange('forma', 'cantidad')}
                            >
                                <Text style={[
                                    style.radioText,
                                    formData.forma === 'cantidad' && style.radioTextSelected
                                ]}>
                                    Por Cantidad (KL)
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    style.radioButton,
                                    formData.forma === 'monto' && style.radioButtonSelected
                                ]}
                                onPress={() => handleInputChange('forma', 'monto')}
                            >
                                <Text style={[
                                    style.radioText,
                                    formData.forma === 'monto' && style.radioTextSelected
                                ]}>
                                    Por Monto ($)
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    style.radioButton,
                                    formData.forma === 'lleno' && style.radioButtonSelected
                                ]}
                                onPress={() => handleInputChange('forma', 'lleno')}
                            >
                                <Text style={[
                                    style.radioText,
                                    formData.forma === 'lleno' && style.radioTextSelected
                                ]}>
                                    Lleno
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Cantidad - Solo mostrar si no es "lleno" */}
                    {formData.forma !== 'lleno' && (
                        <View style={style.fieldContainer}>
                            <Text style={style.fieldLabel}>
                                {formData.forma === 'cantidad' ? 'Cantidad (KL) *' : 'Monto ($) *'}
                            </Text>
                            <TextInput
                                style={style.textInput}
                                value={formData.forma === 'cantidad'
                                    ? formData.cantidadKl?.toString() || ''
                                    : formData.cantidadPrecio?.toString() || ''
                                }
                                onChangeText={(value) => {
                                    const numValue = parseFloat(value) || 0;
                                    if (formData.forma === 'cantidad') {
                                        handleInputChange('cantidadKl', numValue);
                                    } else {
                                        handleInputChange('cantidadPrecio', numValue);
                                    }
                                }}
                                keyboardType="numeric"
                                placeholder={formData.forma === 'cantidad' ? 'Ej: 100' : 'Ej: 50000'}
                                placeholderTextColor="#aaa"
                            />
                        </View>
                    )}

                    {/* Frecuencia (misma estructura que Tipo de Frecuencia en grupos: Semanal | Mensual) */}
                    <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>Tipo de Frecuencia *</Text>
                        <Text style={style.fieldSubLabel}>
                            Semanal: día de la semana e intervalo (cada 1, 2 o 3 semanas). Mensual: día del mes y día de la
                            semana, igual que en grupos.
                        </Text>
                        <View style={style.radioContainer}>
                            <TouchableOpacity
                                style={[
                                    style.radioButton,
                                    tipoUiFrecuencia === 'por_semana' && style.radioButtonSelected
                                ]}
                                onPress={() => setTipoUiFrecuencia('por_semana')}
                            >
                                <Text style={[
                                    style.radioText,
                                    tipoUiFrecuencia === 'por_semana' && style.radioTextSelected
                                ]}>
                                    Semanal
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    style.radioButton,
                                    tipoUiFrecuencia === 'mensual' && style.radioButtonSelected
                                ]}
                                onPress={() => setTipoUiFrecuencia('mensual')}
                            >
                                <Text style={[
                                    style.radioText,
                                    tipoUiFrecuencia === 'mensual' && style.radioTextSelected
                                ]}>
                                    Mensual
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Patrón por semana (misma UX que Editar Grupo: día L–D + intervalo) */}
                    {tipoUiFrecuencia === 'por_semana' && (
                        <>
                            <View style={style.fieldContainer}>
                                <Text style={style.fieldLabel}>Día de la Semana *</Text>
                                <Text style={style.fieldSubLabel}>Selecciona el día de la semana (Lunes a Domingo)</Text>
                                <View style={style.daysContainer}>
                                    {diasSemana.map((dia, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                style.dayButton,
                                                formData.dia1 === index + 1 && style.dayButtonSelected
                                            ]}
                                            onPress={() => handleInputChange('dia1', index + 1)}
                                        >
                                            <Text style={[
                                                style.dayText,
                                                formData.dia1 === index + 1 && style.dayTextSelected
                                            ]}>
                                                {dia.charAt(0)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <Text style={style.daySelectedText}>
                                    Día seleccionado:{' '}
                                    {typeof formData.dia1 === 'number' && formData.dia1 >= 1 && formData.dia1 <= 7
                                        ? getDayName(formData.dia1)
                                        : 'Ninguno'}
                                </Text>
                            </View>

                            <View style={style.fieldContainer}>
                                <Text style={style.fieldLabel}>Intervalo de Semanas *</Text>
                                <View style={style.radioContainer}>
                                    <TouchableOpacity
                                        style={[
                                            style.radioButton,
                                            intervaloSemanas === 1 && style.radioButtonSelected
                                        ]}
                                        onPress={() => setIntervaloSemanas(1)}
                                    >
                                        <Text style={[
                                            style.radioText,
                                            intervaloSemanas === 1 && style.radioTextSelected
                                        ]}>
                                            Semanal
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            style.radioButton,
                                            intervaloSemanas === 2 && style.radioButtonSelected
                                        ]}
                                        onPress={() => setIntervaloSemanas(2)}
                                    >
                                        <Text style={[
                                            style.radioText,
                                            intervaloSemanas === 2 && style.radioTextSelected
                                        ]}>
                                            Cada 2 Semanas
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            style.radioButton,
                                            intervaloSemanas === 3 && style.radioButtonSelected
                                        ]}
                                        onPress={() => setIntervaloSemanas(3)}
                                    >
                                        <Text style={[
                                            style.radioText,
                                            intervaloSemanas === 3 && style.radioTextSelected
                                        ]}>
                                            Cada 3 Semanas
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}

                    {tipoUiFrecuencia === 'mensual' && (
                        <>
                            <View style={style.fieldContainer}>
                                <Text style={style.fieldLabel}>Día del Mes *</Text>
                                <Text style={style.fieldSubLabel}>Selecciona el día del mes (1-31)</Text>
                                <View style={style.daysContainer}>
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => (
                                        <TouchableOpacity
                                            key={dia}
                                            style={[
                                                style.dayButton,
                                                formData.dia1 === dia.toString() && style.dayButtonSelected
                                            ]}
                                            onPress={() => {
                                                if (formData.dia1 === dia.toString()) {
                                                    handleInputChange('dia1', '');
                                                } else {
                                                    handleInputChange('dia1', dia.toString());
                                                }
                                            }}
                                        >
                                            <Text style={[
                                                style.dayText,
                                                formData.dia1 === dia.toString() && style.dayTextSelected
                                            ]}>
                                                {dia}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <Text style={style.daySelectedText}>
                                    Día seleccionado: {formData.dia1 || 'Ninguno'}
                                </Text>
                            </View>

                            <View style={style.fieldContainer}>
                                <Text style={style.fieldLabel}>Día de la Semana (Mensual) *</Text>
                                <Text style={style.fieldSubLabel}>
                                    Selecciona el día de la semana para frecuencia mensual
                                </Text>
                                <View style={style.daysContainer}>
                                    {diasSemana.map((dia, index) => (
                                        <TouchableOpacity
                                            key={`mensual-${index}`}
                                            style={[
                                                style.dayButton,
                                                formData.dia2 === index + 1 && style.dayButtonSelected
                                            ]}
                                            onPress={() => handleInputChange('dia2', index + 1)}
                                        >
                                            <Text style={[
                                                style.dayText,
                                                formData.dia2 === index + 1 && style.dayTextSelected
                                            ]}>
                                                {dia.charAt(0)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <Text style={style.daySelectedText}>
                                    Día seleccionado:{' '}
                                    {typeof formData.dia2 === 'number' && formData.dia2 >= 1 && formData.dia2 <= 7
                                        ? getDayName(formData.dia2)
                                        : 'Ninguno'}
                                </Text>
                            </View>
                        </>
                    )}

                    {/* Botones */}
                    <View style={style.modalButtons}>
                        <TouchableOpacity
                            style={[style.modalButton, style.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={style.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[style.modalButton, style.saveButton]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <>
                                    <FontAwesome name="save" style={style.saveButtonIcon} />
                                    <Text style={style.saveButtonText}>Guardar</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <Toast />
            </View>
        </Modal>
    );
};

export default EditarFrecuenciaModal;
