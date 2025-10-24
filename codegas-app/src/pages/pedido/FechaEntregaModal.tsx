import React from 'react';
import { Dimensions, Modal, Animated, Alert } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { style } from './style';
import { CalendarDay } from './types';

const size = Dimensions.get('window');

interface FechaEntregaModalProps {
    visible: boolean;
    onClose: () => void;
    fechaEntrega?: string;
    onDateSelect: (date: string) => void;
    onSave: () => void;
}

const FechaEntregaModal: React.FC<FechaEntregaModalProps> = ({
    visible,
    onClose,
    fechaEntrega,
    onDateSelect,
    onSave
}) => {
    const diaActual = moment().format('YYYY-MM-DD');

    const handleDateSelect = (day: CalendarDay) => {
        onDateSelect(day.dateString);
        // Cerrar modal primero
        onClose();
        // Luego guardar con la fecha seleccionada y mostrar alert
        setTimeout(() => {
            // Pasar la fecha directamente a onSave si es posible
            if (onSave.length > 0) {
                //onSave(day.dateString);
                onSave();
            } else {
                onSave();
            }
            Alert.alert(
                'Fecha guardada',
                `Fecha de entrega actualizada: ${moment(day.dateString).format('DD/MM/YYYY')}`,
                [{ text: 'OK' }]
            );
        }, 300);
    };

    if (!visible) return null;

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.6)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    padding: 20,
                    width: '95%',
                    maxWidth: 400,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                }}>
                    {/* Header */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20
                    }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: '#333'
                        }}>
                            Fecha de Entrega
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: 20,
                                width: 36,
                                height: 36,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#e9ecef'
                            }}
                        >
                            <FontAwesome name="times" size={16} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Descripción */}
                    <Text style={{
                        fontSize: 14,
                        color: '#666',
                        marginBottom: 20,
                        textAlign: 'center'
                    }}>
                        Selecciona la fecha de entrega del pedido
                    </Text>

                    {/* Calendario */}
                    <Calendar
                        style={{
                            borderRadius: 12,
                            elevation: 2,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4
                        }}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: '#007bff',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#007bff',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e1e8',
                            dotColor: '#007bff',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#007bff',
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: '#333',
                            indicatorColor: '#007bff',
                            textDayFontWeight: '500',
                            textMonthFontWeight: '700',
                            textDayHeaderFontWeight: '600',
                            textDayFontSize: 16,
                            textMonthFontSize: 18,
                            textDayHeaderFontSize: 14
                        }}
                        current={fechaEntrega || diaActual}
                        minDate={diaActual}
                        firstDay={1}
                        onDayPress={handleDateSelect}
                        markedDates={{
                            [fechaEntrega || '']: {
                                selected: true,
                                selectedColor: '#007bff',
                                selectedTextColor: '#ffffff'
                            }
                        }}
                        hideExtraDays={true}
                        enableSwipeMonths={true}
                    />

                    {/* Información adicional */}
                    <View style={{
                        backgroundColor: '#f8f9fa',
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 15,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <FontAwesome name="info-circle" size={14} color="#007bff" style={{ marginRight: 8 }} />
                        <Text style={{
                            fontSize: 12,
                            color: '#666',
                            flex: 1
                        }}>
                            La fecha se guardará automáticamente al seleccionarla
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FechaEntregaModal;
