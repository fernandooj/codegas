import React, { useCallback, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    TextInput,
    Platform,
    Modal,
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

    // Filtrar zonas basado en el término de búsqueda
    const zonasFiltradas = useMemo(() => {
        return zonas.filter(zona =>
            terminoBuscador === '' ||
            zona.nombre.toLowerCase().includes(terminoBuscador.toLowerCase())
        );
    }, [zonas, terminoBuscador]);

    // Renderizar cada item de la zona
    const renderZonaItem = useCallback(({ item: zona, index }: { item: Zona, index: number }) => (
        <TouchableOpacity
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
    ), [idZona, handleSelectZona]);

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
                pointerEvents="box-none"
            >
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
                    {Platform.OS === 'android' ? (
                        <ScrollView
                            style={[style.zonaListContainer, { height: 250 }]}
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={false}
                            scrollEnabled={true}
                            bounces={false}
                            scrollEventThrottle={16}
                            onStartShouldSetResponder={() => true}
                            onMoveShouldSetResponder={() => true}
                            onScrollBeginDrag={(e) => e.stopPropagation()}
                            onScroll={(e) => e.stopPropagation()}
                        >
                            {zonasFiltradas.map((zona, index) => (
                                <TouchableOpacity
                                    key={zona._id}
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
                            ))}
                        </ScrollView>
                    ) : (
                        <FlatList
                            data={zonasFiltradas}
                            renderItem={renderZonaItem}
                            keyExtractor={(item) => item._id}
                            style={[style.zonaListContainer, { height: 250 }]}
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={false}
                            removeClippedSubviews={false}
                            maxToRenderPerBatch={10}
                            windowSize={10}
                            scrollEventThrottle={16}
                            onStartShouldSetResponder={() => true}
                            onMoveShouldSetResponder={() => true}
                            onScrollBeginDrag={(e) => e.stopPropagation()}
                            onScroll={(e) => e.stopPropagation()}
                        />
                    )}

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
        </Modal>
    );
};

export default ModalZonas;
