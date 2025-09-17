import React from 'react';
import { Dimensions } from 'react-native';
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

    if (!visible) return null;

    return (
        <View style={style.contenedorModal2}>
            <View style={[style.subContenedorModal, { height: size.height - 180 }]}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onClose}
                    style={style.btnModalClose}
                >
                    <FontAwesome name={'times-circle'} style={style.iconCerrar} />
                </TouchableOpacity>
                <Text style={style.tituloModal}>Fecha entrega</Text>
                <Calendar
                    style={style.calendar}
                    current={fechaEntrega ? fechaEntrega : diaActual}
                    minDate={diaActual}
                    firstDay={1}
                    onDayPress={(day: CalendarDay) => {
                        console.log('selected day', day);
                        onDateSelect(day.dateString);
                    }}
                    markedDates={{ [fechaEntrega || '']: { selected: true, marked: true } }}
                />
            </View>
            <TouchableOpacity
                style={style.btnGuardar}
                onPress={fechaEntrega ? onSave : undefined}
            >
                <Text style={style.textGuardar}>Guardar fecha</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FechaEntregaModal;
