import React, { useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { style } from './style';

interface Zona {
    _id: string;
    nombre: string;
}

interface ModalZonasProps {
    visible: boolean;
    zonas: Zona[];
    idZona: string;
    terminoBuscador: string;
    onClose: () => void;
    onSelectZona: (id: string, nombre: string) => void;
    onUpdateTermino: (termino: string) => void;
}

const ModalZonas: React.FC<ModalZonasProps> = ({
    visible,
    zonas,
    idZona,
    terminoBuscador,
    onClose,
    onSelectZona,
    onUpdateTermino
}) => {
    const handleSelectZona = useCallback((id: string, nombre: string) => {
        onSelectZona(id, nombre);
        onClose();
    }, [onSelectZona, onClose]);

    if (!visible) return null;

    return (
        <View style={style.modalZonaOverlay}>
            <View style={style.modalZonaContainer}>
                {/* Header del Modal */}
                <View style={style.modalZonaHeader}>
                    <Text style={style.modalZonaTitle}>
                        Seleccionar Zona
                    </Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={style.modalZonaCloseButton}
                    >
                        <FontAwesome name="times" size={16} style={style.modalZonaCloseIcon} />
                    </TouchableOpacity>
                </View>

                {/* Barra de búsqueda */}
                <View style={style.zonaSearchContainer}>
                    <TextInput
                        placeholder="Buscar zona..."
                        value={terminoBuscador}
                        onChangeText={onUpdateTermino}
                        style={style.zonaSearchInput}
                    />
                </View>

                {/* Lista de zonas */}
                <ScrollView style={style.zonaListContainer}>
                    {zonas
                        .filter(zona =>
                            terminoBuscador === '' ||
                            zona.nombre.toLowerCase().includes(terminoBuscador.toLowerCase())
                        )
                        .map((zona, key) => (
                            <TouchableOpacity
                                key={key}
                                onPress={() => handleSelectZona(zona._id, zona.nombre)}
                                style={[
                                    style.zonaItem,
                                    idZona === zona._id && style.zonaItemSelected
                                ]}
                            >
                                <Text style={style.zonaItemText}>
                                    {zona.nombre}
                                </Text>
                                {idZona === zona._id && (
                                    <FontAwesome
                                        name="check"
                                        size={18}
                                        style={style.zonaItemCheck}
                                    />
                                )}
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>

                {/* Footer */}
                <View style={style.modalFooter}>
                    <TouchableOpacity
                        style={style.modalCancelButton}
                        onPress={onClose}
                    >
                        <Text style={style.modalButtonText}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ModalZonas;
