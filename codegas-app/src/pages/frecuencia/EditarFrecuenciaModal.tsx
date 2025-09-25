import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { style } from './style';
import { PedidoFrecuencia, FrecuenciaEditData, EditarFrecuenciaModalProps } from './EditarFrecuenciaModal.types';

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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (frecuencia && visible) {
            // Convertir número de día a nombre del día si es necesario
            let dia1Value = frecuencia.dia1 || '';
            let dia2Value = frecuencia.dia2 || '';

            // Si dia1 es un número, convertir a nombre del día
            if (typeof dia1Value === 'number' || (typeof dia1Value === 'string' && !isNaN(Number(dia1Value)))) {
                dia1Value = getDayName(Number(dia1Value));
            }

            // Si dia2 es un número, convertir a nombre del día
            if (typeof dia2Value === 'number' || (typeof dia2Value === 'string' && !isNaN(Number(dia2Value)))) {
                dia2Value = getDayName(Number(dia2Value));
            }

            setFormData({
                forma: frecuencia.forma || 'cantidad',
                cantidadKl: frecuencia.cantidadKl || 0,
                cantidadPrecio: frecuencia.cantidadPrecio || 0,
                frecuencia: frecuencia.frecuencia || 'semanal',
                dia1: dia1Value,
                dia2: dia2Value
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
        if (!formData.forma || !formData.frecuencia) {
            Alert.alert('Error', 'Forma y frecuencia son campos requeridos');
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

        if (formData.frecuencia === 'semanal' && !formData.dia1) {
            Alert.alert('Error', 'Día 1 es requerido para frecuencia semanal');
            return false;
        }

        if (formData.frecuencia === 'quincenal' && (!formData.dia1 || !formData.dia2)) {
            Alert.alert('Error', 'Día 1 y día 2 son requeridos para frecuencia quincenal');
            return false;
        }

        if (formData.frecuencia === 'mensual' && !formData.dia1) {
            Alert.alert('Error', 'Día del mes es requerido para frecuencia mensual');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm() || !frecuencia) return;

        try {
            setLoading(true);

            // Preparar datos para envío, convirtiendo nombres de días a números
            const dataToSend = {
                ...formData,
                dia1: formData.dia1 ? getDayNumber(formData.dia1 as string) : null,
                dia2: formData.dia2 ? getDayNumber(formData.dia2 as string) : null
            };

            const response = await axios.put(`fre/frecuencia/${frecuencia.pedido_id}`, dataToSend);

            if (response.data.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Frecuencia Actualizada',
                    text2: 'La frecuencia se ha actualizado correctamente'
                });

                // Crear objeto con los datos actualizados para actualizar el listado local
                const updatedFrecuencia: PedidoFrecuencia = {
                    ...frecuencia,
                    forma: formData.forma,
                    cantidadKl: formData.cantidadKl,
                    cantidadPrecio: formData.cantidadPrecio,
                    frecuencia: formData.frecuencia,
                    dia1: formData.dia1,
                    dia2: formData.dia2
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

    // Función para convertir nombre del día a número
    const getDayNumber = (dayName: string): number => {
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const index = dayNames.indexOf(dayName);
        return index + 1; // Devuelve 1-7
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

                    {/* Frecuencia */}
                    <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>Frecuencia *</Text>
                        <View style={style.radioContainer}>
                            <TouchableOpacity
                                style={[
                                    style.radioButton,
                                    formData.frecuencia === 'semanal' && style.radioButtonSelected
                                ]}
                                onPress={() => handleInputChange('frecuencia', 'semanal')}
                            >
                                <Text style={[
                                    style.radioText,
                                    formData.frecuencia === 'semanal' && style.radioTextSelected
                                ]}>
                                    Semanal
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    style.radioButton,
                                    formData.frecuencia === 'quincenal' && style.radioButtonSelected
                                ]}
                                onPress={() => handleInputChange('frecuencia', 'quincenal')}
                            >
                                <Text style={[
                                    style.radioText,
                                    formData.frecuencia === 'quincenal' && style.radioTextSelected
                                ]}>
                                    Quincenal
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    style.radioButton,
                                    formData.frecuencia === 'mensual' && style.radioButtonSelected
                                ]}
                                onPress={() => handleInputChange('frecuencia', 'mensual')}
                            >
                                <Text style={[
                                    style.radioText,
                                    formData.frecuencia === 'mensual' && style.radioTextSelected
                                ]}>
                                    Mensual
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Días de la semana */}
                    {formData.frecuencia === 'semanal' && (
                        <View style={style.fieldContainer}>
                            <Text style={style.fieldLabel}>Día de la Semana *</Text>
                            <View style={style.daysContainer}>
                                {diasSemana.map((dia, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            style.dayButton,
                                            formData.dia1 === dia && style.dayButtonSelected
                                        ]}
                                        onPress={() => handleInputChange('dia1', dia)}
                                    >
                                        <Text style={[
                                            style.dayText,
                                            formData.dia1 === dia && style.dayTextSelected
                                        ]}>
                                            {dia.charAt(0)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={style.daySelectedText}>
                                Día seleccionado: {formData.dia1 || 'Ninguno'}
                            </Text>
                        </View>
                    )}

                    {formData.frecuencia === 'quincenal' && (
                        <View style={style.fieldContainer}>
                            <Text style={style.fieldLabel}>Días Quincenales *</Text>
                            <Text style={style.fieldSubLabel}>Selecciona los días para cada quincena del mes</Text>

                            <View style={style.quincenaContainer}>
                                <Text style={style.quincenaLabel}>Primera Quincena (1-15):</Text>
                                <View style={style.daysContainer}>
                                    {diasSemana.map((dia, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                style.dayButton,
                                                formData.dia1 === dia && style.dayButtonSelected
                                            ]}
                                            onPress={() => {
                                                if (formData.dia1 === dia) {
                                                    handleInputChange('dia1', '');
                                                } else {
                                                    handleInputChange('dia1', dia);
                                                }
                                            }}
                                        >
                                            <Text style={[
                                                style.dayText,
                                                formData.dia1 === dia && style.dayTextSelected
                                            ]}>
                                                {dia.charAt(0)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <Text style={style.daySelectedText}>
                                    Primera quincena: {formData.dia1 || 'Ninguno'}
                                </Text>
                            </View>

                            <View style={style.quincenaContainer}>
                                <Text style={style.quincenaLabel}>Segunda Quincena (16-31):</Text>
                                <View style={style.daysContainer}>
                                    {diasSemana.map((dia, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                style.dayButton,
                                                formData.dia2 === dia && style.dayButtonSelected
                                            ]}
                                            onPress={() => {
                                                if (formData.dia2 === dia) {
                                                    handleInputChange('dia2', '');
                                                } else {
                                                    handleInputChange('dia2', dia);
                                                }
                                            }}
                                        >
                                            <Text style={[
                                                style.dayText,
                                                formData.dia2 === dia && style.dayTextSelected
                                            ]}>
                                                {dia.charAt(0)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <Text style={style.daySelectedText}>
                                    Segunda quincena: {formData.dia2 || 'Ninguno'}
                                </Text>
                            </View>
                        </View>
                    )}

                    {formData.frecuencia === 'mensual' && (
                        <View style={style.fieldContainer}>
                            <Text style={style.fieldLabel}>Día del Mes *</Text>
                            <Text style={style.fieldSubLabel}>Selecciona el día del mes para la frecuencia mensual</Text>

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
