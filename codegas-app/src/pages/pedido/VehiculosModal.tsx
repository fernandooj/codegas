import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { style } from './style';
import { Vehiculo, CalendarDay } from './types';

interface VehiculosModalProps {
    visible: boolean;
    onClose: () => void;
    vehiculos: Vehiculo[];
    showCalendar: boolean;
    onToggleCalendar: (show: boolean) => void;
    fechaEntrega?: string;
    onDateSelect: (date: string) => void;
    onSaveDate: () => void;
    idVehiculo?: string;
    placa?: string;
    onVehicleSelect: (vehiculo: Vehiculo) => void;
    onAssignVehicle: (vehiculo?: Vehiculo) => void;
}

const VehiculosModal: React.FC<VehiculosModalProps> = ({
    visible,
    onClose,
    vehiculos,
    showCalendar,
    onToggleCalendar,
    fechaEntrega,
    onDateSelect,
    onSaveDate,
    idVehiculo,
    placa,
    onVehicleSelect,
    onAssignVehicle
}) => {
    const diaActual = moment().format('YYYY-MM-DD');
    // Estado local para la fecha seleccionada en el calendario
    const [fechaSeleccionadaLocal, setFechaSeleccionadaLocal] = useState<string | null>(null);

    // Resetear fecha local cuando el modal se abre
    useEffect(() => {
        if (visible) {
            setFechaSeleccionadaLocal(null);
        }
    }, [visible]);

    if (!visible) return null;


    // Preparar fechas para el calendario
    const fechaActual = moment().format('YYYY-MM-DD');
    const fechaDelBackend = fechaEntrega ? moment(fechaEntrega).format('YYYY-MM-DD') : null;
    const fechaParaMostrar = fechaSeleccionadaLocal || fechaDelBackend;


    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1000,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        }}>
            <View style={{
                backgroundColor: 'white',
                borderRadius: 16,
                width: '100%',
                maxHeight: '90%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
                elevation: 10,
            }}>
                {/* Header con botón cerrar */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e9ecef',
                }}>
                    <View>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: '#333',
                        }}>
                            Asignación de Vehículo
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: '#666',
                            marginTop: 2
                        }}>
                            {!showCalendar ?
                                (idVehiculo ? 'Paso 2: Selecciona fecha de entrega' : 'Paso 1: Selecciona un vehículo') :
                                'Paso 2: Selecciona fecha de entrega'
                            }
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        activeOpacity={0.7}
                    >
                        <FontAwesome name="times" style={{ fontSize: 18, color: '#666' }} />
                    </TouchableOpacity>
                </View>

                {/* Botones de navegación mejorados */}
                <View style={{
                    flexDirection: 'row',
                    margin: 20,
                    marginBottom: 0,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 8,
                    padding: 4,
                }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 6,
                            backgroundColor: !showCalendar ? '#007bff' : 'transparent',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                        onPress={() => onToggleCalendar(false)}
                        activeOpacity={0.8}
                    >
                        <FontAwesome
                            name="truck"
                            style={{
                                fontSize: 14,
                                color: !showCalendar ? 'white' : '#6c757d',
                                marginRight: 6
                            }}
                        />
                        <Text style={{
                            color: !showCalendar ? 'white' : '#6c757d',
                            fontSize: 14,
                            fontWeight: '600'
                        }}>
                            Vehículos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 6,
                            backgroundColor: showCalendar ? '#007bff' : 'transparent',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                        onPress={() => onToggleCalendar(true)}
                        activeOpacity={0.8}
                    >
                        <FontAwesome
                            name="calendar"
                            style={{
                                fontSize: 14,
                                color: showCalendar ? 'white' : '#6c757d',
                                marginRight: 6
                            }}
                        />
                        <Text style={{
                            color: showCalendar ? 'white' : '#6c757d',
                            fontSize: 14,
                            fontWeight: '600'
                        }}>
                            Fecha
                        </Text>
                    </TouchableOpacity>
                </View>

                {showCalendar ? (
                    <View style={{ padding: 20 }}>
                        <Calendar
                            style={style.calendar}
                            current={fechaParaMostrar || fechaActual}
                            minDate={fechaActual}
                            firstDay={1}
                            markingType="single"
                            markedDates={fechaParaMostrar ? {
                                [fechaParaMostrar]: {
                                    selected: true,
                                    selectedColor: '#007bff',
                                    selectedTextColor: 'white'
                                }
                            } : {}}
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#b6c1cd',
                                selectedDayBackgroundColor: '#007bff',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#007bff',
                                dayTextColor: '#2d4150',
                                textDisabledColor: '#d9e1e8',
                                dotColor: '#00adf5',
                                selectedDotColor: '#ffffff',
                                arrowColor: '#007bff',
                                disabledArrowColor: '#d9e1e8',
                                monthTextColor: '#007bff',
                                indicatorColor: '#007bff',
                                textDayFontFamily: 'System',
                                textMonthFontFamily: 'System',
                                textDayHeaderFontFamily: 'System',
                                textDayFontWeight: '400',
                                textMonthFontWeight: '700',
                                textDayHeaderFontWeight: '400',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 13
                            }}
                            onDayPress={(day: CalendarDay) => {
                                setFechaSeleccionadaLocal(day.dateString);
                                onDateSelect(day.dateString);
                                // Después de seleccionar fecha, asignar vehículo y cerrar modal
                                setTimeout(() => {
                                    // Pasar la fecha directamente a onSaveDate si es posible
                                    if (onSaveDate.length > 0) {
                                        onSaveDate(day.dateString);
                                    } else {
                                        onSaveDate();
                                    }

                                    // Asignar vehículo con la fecha seleccionada
                                    const vehiculoSeleccionado = vehiculos.find(v => v._id === idVehiculo);
                                    if (vehiculoSeleccionado) {
                                        setTimeout(() => {
                                            onAssignVehicle(vehiculoSeleccionado);
                                        }, 500);
                                    }

                                    Alert.alert(
                                        'Vehículo y fecha asignados',
                                        `Vehículo: ${placa}\nFecha: ${moment(day.dateString).format('DD/MM/YYYY')}`,
                                        [{ text: 'OK' }]
                                    );
                                }, 300);
                            }}
                        />

                        {/* Información sobre guardado automático */}
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
                                El vehículo y fecha se asignarán automáticamente al seleccionar la fecha
                            </Text>
                        </View>
                    </View>
                ) : (
                    <ScrollView
                        style={{
                            paddingHorizontal: 20,
                            paddingTop: 20,
                        }}
                        showsVerticalScrollIndicator={true}
                    >
                        {!vehiculos || vehiculos.length === 0 ? (
                            <View style={{
                                padding: 40,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FontAwesome name="truck" style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                                <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
                                    No hay vehículos disponibles
                                </Text>
                                <Text style={{ fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8 }}>
                                    Contacta con el administrador
                                </Text>
                            </View>
                        ) : (
                            (vehiculos && Array.isArray(vehiculos) ? vehiculos : []).map((e: Vehiculo) => {
                                // Comparar por idVehiculo O por placa si idVehiculo es undefined
                                const isSelectedById = idVehiculo && String(idVehiculo) === String(e._id);
                                const isSelectedByPlaca = !idVehiculo && placa && e.placa === placa;
                                const isSelected = isSelectedById || isSelectedByPlaca;


                                return (
                                    <TouchableOpacity
                                        key={e._id}
                                        style={{
                                            backgroundColor: isSelected ? '#d4edda' : '#f8f9fa',
                                            borderColor: isSelected ? '#28a745' : '#dee2e6',
                                            borderWidth: 2,
                                            borderRadius: 12,
                                            padding: 16,
                                            marginBottom: 12,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 2,
                                        }}
                                        onPress={() => {
                                            // Seleccionar el vehículo
                                            onVehicleSelect(e);
                                            // Cambiar automáticamente al tab de fecha
                                            setTimeout(() => {
                                                onToggleCalendar(true);
                                            }, 100);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        {/* Avatar del conductor */}
                                        <View style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            backgroundColor: '#007bff',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 12,
                                            overflow: 'hidden',
                                        }}>
                                            {e.conductor && e.conductor.avatar ? (
                                                <Image
                                                    source={{ uri: e.conductor.avatar }}
                                                    style={{ width: 50, height: 50, borderRadius: 25 }}
                                                />
                                            ) : (
                                                <FontAwesome name="user" style={{ fontSize: 20, color: 'white' }} />
                                            )}
                                        </View>

                                        {/* Información del vehículo */}
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                                <FontAwesome name="truck" style={{ fontSize: 14, color: '#007bff', marginRight: 6 }} />
                                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                                                    {e.placa}
                                                </Text>
                                                {isSelected && (
                                                    <View style={{
                                                        marginLeft: 8,
                                                        backgroundColor: '#28a745',
                                                        borderRadius: 10,
                                                        paddingHorizontal: 6,
                                                        paddingVertical: 2
                                                    }}>
                                                        <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                                                            ✓ ASIGNADO
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <FontAwesome name="user" style={{ fontSize: 12, color: '#6c757d', marginRight: 6 }} />
                                                <Text style={{ fontSize: 14, color: '#6c757d' }}>
                                                    {e.conductor ? e.conductor.nombre : "Sin conductor"}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Indicador de selección */}
                                        {idVehiculo == e._id && (
                                            <View style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: 12,
                                                backgroundColor: '#28a745',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                                <FontAwesome name="check" style={{ fontSize: 12, color: 'white' }} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })
                        )}

                        {/* Botón para continuar a fecha cuando se haya seleccionado vehículo */}
                        {idVehiculo && !showCalendar && (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#007bff',
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 8,
                                    marginTop: 15,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}
                                onPress={() => onToggleCalendar(true)}
                                activeOpacity={0.8}
                            >
                                <FontAwesome name="calendar" style={{ fontSize: 16, color: '#fff', marginRight: 8 }} />
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                                    Continuar a selección de fecha
                                </Text>
                                <FontAwesome name="arrow-right" style={{ fontSize: 14, color: '#fff', marginLeft: 8 }} />
                            </TouchableOpacity>
                        )}

                        {/* Mensaje informativo */}
                        <View
                            style={{
                                backgroundColor: idVehiculo ? '#e3f2fd' : '#e8f5e8',
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderRadius: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 15,
                                borderLeftWidth: 4,
                                borderLeftColor: idVehiculo ? '#2196f3' : '#28a745',
                            }}
                        >
                            <FontAwesome
                                name={idVehiculo ? "check-circle" : "info-circle"}
                                style={{ fontSize: 16, color: idVehiculo ? '#2196f3' : '#28a745', marginRight: 10 }}
                            />
                            <Text style={{ color: idVehiculo ? '#2196f3' : '#28a745', fontSize: 14, fontWeight: '500', textAlign: 'center', flex: 1 }}>
                                {idVehiculo ?
                                    `Vehículo ${placa} seleccionado. Ahora selecciona la fecha.` :
                                    'Selecciona un vehículo para continuar'
                                }
                            </Text>
                        </View>

                        {/* Espacio extra para que el último elemento sea visible */}
                        <View style={{ height: 20 }} />
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default VehiculosModal;
