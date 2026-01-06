import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { style } from './style';

interface CrearGrupoFrecuenciaModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>;
}

interface GrupoFormData {
    nombre: string;
    tipo_frecuencia: 'semanal' | 'mensual';
    dia_semana?: number;
    intervalo_semanas?: number;
    dia_mes?: number;
    dia_semana_mensual?: number;
}

const CrearGrupoFrecuenciaModal: React.FC<CrearGrupoFrecuenciaModalProps> = ({
    visible,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState<GrupoFormData>({
        nombre: '',
        tipo_frecuencia: 'semanal',
        dia_semana: undefined,
        intervalo_semanas: 1,
        dia_mes: undefined,
        dia_semana_mensual: undefined
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field: keyof GrupoFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.nombre || formData.nombre.trim() === '') {
            Alert.alert('Error', 'El nombre del grupo es requerido');
            return false;
        }

        if (formData.tipo_frecuencia === 'semanal') {
            if (!formData.dia_semana || formData.dia_semana < 1 || formData.dia_semana > 7) {
                Alert.alert('Error', 'Debes seleccionar un día de la semana (Lunes a Domingo)');
                return false;
            }
            if (!formData.intervalo_semanas || formData.intervalo_semanas < 1 || formData.intervalo_semanas > 3) {
                Alert.alert('Error', 'El intervalo de semanas debe ser entre 1 y 3');
                return false;
            }
        } else if (formData.tipo_frecuencia === 'mensual') {
            if (!formData.dia_mes || formData.dia_mes < 1 || formData.dia_mes > 31) {
                Alert.alert('Error', 'El día del mes debe ser entre 1 y 31');
                return false;
            }
            if (!formData.dia_semana_mensual || formData.dia_semana_mensual < 1 || formData.dia_semana_mensual > 7) {
                Alert.alert('Error', 'Debes seleccionar un día de la semana para frecuencia mensual');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const dataToSend = {
                nombre: formData.nombre.trim(),
                tipo_frecuencia: formData.tipo_frecuencia,
                dia_semana: formData.tipo_frecuencia === 'semanal' ? formData.dia_semana : null,
                intervalo_semanas: formData.tipo_frecuencia === 'semanal' ? formData.intervalo_semanas : null,
                dia_mes: formData.tipo_frecuencia === 'mensual' ? formData.dia_mes : null,
                dia_semana_mensual: formData.tipo_frecuencia === 'mensual' ? formData.dia_semana_mensual : null
            };

            const response = await axios.post('fre/grupos', dataToSend);

            if (response.data.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Grupo Creado',
                    text2: 'El grupo de frecuencia se ha creado correctamente'
                });

                // Resetear formulario
                setFormData({
                    nombre: '',
                    tipo_frecuencia: 'semanal',
                    dia_semana: undefined,
                    intervalo_semanas: 1,
                    dia_mes: undefined,
                    dia_semana_mensual: undefined
                });

                await onSuccess();
                onClose();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error al crear',
                    text2: response.data.message || 'Hubo un problema al crear el grupo'
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
        return diasSemana[dayNumber - 1] || '';
    };

    // Función para convertir nombre del día a número
    const getDayNumber = (dayName: string): number => {
        const index = diasSemana.indexOf(dayName);
        return index + 1; // Devuelve 1-7 (Lunes-Domingo)
    };

    const handleClose = () => {
        // Resetear formulario al cerrar
        setFormData({
            nombre: '',
            tipo_frecuencia: 'semanal',
            dia_semana: undefined,
            intervalo_semanas: 1,
            dia_mes: undefined,
            dia_semana_mensual: undefined
        });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View style={style.modalContainer}>
                {/* Header */}
                <View style={style.modalHeader}>
                    <Text style={style.modalTitle}>Crear Grupo de Frecuencia</Text>
                    <TouchableOpacity onPress={handleClose} style={style.closeButton}>
                        <FontAwesome name="times" style={style.closeIcon} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={style.modalContent} showsVerticalScrollIndicator={false}>
                    {/* Nombre del grupo */}
                    <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>Nombre del Grupo *</Text>
                        <TextInput
                            style={style.textInput}
                            value={formData.nombre}
                            onChangeText={(value) => handleInputChange('nombre', value)}
                            placeholder="Ej: Ruta Norte Semanal"
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    {/* Tipo de frecuencia */}
                    <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>Tipo de Frecuencia *</Text>
                        <View style={style.radioContainer}>
                            <TouchableOpacity
                                style={[
                                    style.radioButton,
                                    formData.tipo_frecuencia === 'semanal' && style.radioButtonSelected
                                ]}
                                onPress={() => handleInputChange('tipo_frecuencia', 'semanal')}
                            >
                                <Text style={[
                                    style.radioText,
                                    formData.tipo_frecuencia === 'semanal' && style.radioTextSelected
                                ]}>
                                    Semanal
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    style.radioButton,
                                    formData.tipo_frecuencia === 'mensual' && style.radioButtonSelected
                                ]}
                                onPress={() => handleInputChange('tipo_frecuencia', 'mensual')}
                            >
                                <Text style={[
                                    style.radioText,
                                    formData.tipo_frecuencia === 'mensual' && style.radioTextSelected
                                ]}>
                                    Mensual
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Campos para frecuencia semanal */}
                    {formData.tipo_frecuencia === 'semanal' && (
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
                                                formData.dia_semana === (index + 1) && style.dayButtonSelected
                                            ]}
                                            onPress={() => handleInputChange('dia_semana', index + 1)}
                                        >
                                            <Text style={[
                                                style.dayText,
                                                formData.dia_semana === (index + 1) && style.dayTextSelected
                                            ]}>
                                                {dia.charAt(0)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <Text style={style.daySelectedText}>
                                    Día seleccionado: {formData.dia_semana ? getDayName(formData.dia_semana) : 'Ninguno'}
                                </Text>
                            </View>

                            <View style={style.fieldContainer}>
                                <Text style={style.fieldLabel}>Intervalo de Semanas *</Text>
                                <View style={style.radioContainer}>
                                    <TouchableOpacity
                                        style={[
                                            style.radioButton,
                                            formData.intervalo_semanas === 1 && style.radioButtonSelected
                                        ]}
                                        onPress={() => handleInputChange('intervalo_semanas', 1)}
                                    >
                                        <Text style={[
                                            style.radioText,
                                            formData.intervalo_semanas === 1 && style.radioTextSelected
                                        ]}>
                                            Semanal
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            style.radioButton,
                                            formData.intervalo_semanas === 2 && style.radioButtonSelected
                                        ]}
                                        onPress={() => handleInputChange('intervalo_semanas', 2)}
                                    >
                                        <Text style={[
                                            style.radioText,
                                            formData.intervalo_semanas === 2 && style.radioTextSelected
                                        ]}>
                                            Cada 2 Semanas
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            style.radioButton,
                                            formData.intervalo_semanas === 3 && style.radioButtonSelected
                                        ]}
                                        onPress={() => handleInputChange('intervalo_semanas', 3)}
                                    >
                                        <Text style={[
                                            style.radioText,
                                            formData.intervalo_semanas === 3 && style.radioTextSelected
                                        ]}>
                                            Cada 3 Semanas
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}

                    {/* Campos para frecuencia mensual */}
                    {formData.tipo_frecuencia === 'mensual' && (
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
                                                formData.dia_mes === dia && style.dayButtonSelected
                                            ]}
                                            onPress={() => {
                                                if (formData.dia_mes === dia) {
                                                    handleInputChange('dia_mes', undefined);
                                                } else {
                                                    handleInputChange('dia_mes', dia);
                                                }
                                            }}
                                        >
                                            <Text style={[
                                                style.dayText,
                                                formData.dia_mes === dia && style.dayTextSelected
                                            ]}>
                                                {dia}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <Text style={style.daySelectedText}>
                                    Día seleccionado: {formData.dia_mes || 'Ninguno'}
                                </Text>
                            </View>

                            <View style={style.fieldContainer}>
                                <Text style={style.fieldLabel}>Día de la Semana (Mensual) *</Text>
                                <Text style={style.fieldSubLabel}>Selecciona el día de la semana para frecuencia mensual</Text>
                                <View style={style.daysContainer}>
                                    {diasSemana.map((dia, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                style.dayButton,
                                                formData.dia_semana_mensual === (index + 1) && style.dayButtonSelected
                                            ]}
                                            onPress={() => handleInputChange('dia_semana_mensual', index + 1)}
                                        >
                                            <Text style={[
                                                style.dayText,
                                                formData.dia_semana_mensual === (index + 1) && style.dayTextSelected
                                            ]}>
                                                {dia.charAt(0)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <Text style={style.daySelectedText}>
                                    Día seleccionado: {formData.dia_semana_mensual ? getDayName(formData.dia_semana_mensual) : 'Ninguno'}
                                </Text>
                            </View>
                        </>
                    )}

                    {/* Botones */}
                    <View style={style.modalButtons}>
                        <TouchableOpacity
                            style={[style.modalButton, style.cancelButton]}
                            onPress={handleClose}
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
                                    <FontAwesome name="plus" style={style.saveButtonIcon} />
                                    <Text style={style.saveButtonText}>Crear Grupo</Text>
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

export default CrearGrupoFrecuenciaModal;
