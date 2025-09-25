import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    TextInput,
    ScrollView,
    Platform,
    StatusBar,
    Modal,
    Animated
} from 'react-native';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { style } from './style';
import { getZonas, createZona, updateZona, deleteZona } from '../../redux/actions/zonaActions';

const Zona = ({ navigation }) => {
    // Redux hooks
    const dispatch = useDispatch();
    const zonas = useSelector(state => state.zona.zonas);

    // Local state
    const [zona, setZona] = useState("");
    const [editingZona, setEditingZona] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editText, setEditText] = useState("");
    const [sortBy, setSortBy] = useState("nombre"); // "nombre" o "fecha"
    const [sortOrder, setSortOrder] = useState("asc"); // "asc" o "desc"

    // Animation refs
    const modalScale = useRef(new Animated.Value(0)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        dispatch(getZonas());
    }, [dispatch]);

    useEffect(() => {
        if (editModalVisible) {
            modalScale.setValue(0);
            modalOpacity.setValue(0);

            Animated.parallel([
                Animated.spring(modalScale, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(modalScale, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(modalOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [editModalVisible, modalScale, modalOpacity]);

    // Función para ordenar las zonas
    const getSortedZonas = () => {
        if (!zonas || zonas.length === 0) return [];

        return [...zonas].sort((a, b) => {
            let comparison = 0;

            if (sortBy === "nombre") {
                comparison = a.nombre.localeCompare(b.nombre);
            } else if (sortBy === "fecha") {
                const dateA = new Date(a.createdAt || a.fechaCreacion || 0);
                const dateB = new Date(b.createdAt || b.fechaCreacion || 0);
                comparison = dateA - dateB;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });
    };

    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const handleCreateZona = async () => {
        if (zona.length > 3) {
            const result = await dispatch(createZona(zona));
            if (result.success) {
                Toast.show({ type: 'success', text1: 'Zona Guardada' });
                setZona("");
            } else {
                Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' });
            }
        } else {
            Toast.show({ type: 'error', text1: 'Zona invalida' });
        }
    };

    const handleEditZona = (zonaData) => {
        setEditingZona(zonaData);
        setEditText(zonaData.nombre);
        setEditModalVisible(true);
    };

    const handleUpdateZona = async () => {
        if (editText.length > 3) {
            const result = await dispatch(updateZona(editingZona._id, editText));
            if (result.success) {
                Toast.show({ type: 'success', text1: 'Zona Actualizada' });
                setEditModalVisible(false);
                setEditingZona(null);
                setEditText("");
            } else {
                Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' });
            }
        } else {
            Toast.show({ type: 'error', text1: 'Zona invalida' });
        }
    };

    const handleDeleteZona = (zonaData) => {
        Alert.alert(
            `Seguro deseas eliminar a: ${zonaData.nombre}`,
            ``,
            [
                { text: 'Confirmar', onPress: () => confirmDelete(zonaData._id, zonaData.nombre) },
            ],
            { cancelable: false },
        );
    };

    const confirmDelete = async (_id, zona) => {
        const result = await dispatch(deleteZona(_id));
        if (result.success) {
            Toast.show({ type: 'error', text1: `zona ${zona} eliminada` });
        } else {
            Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' });
        }
    };

    const renderHeader = () => {
        const getStatusBarHeight = () => {
            if (Platform.OS === 'ios') {
                return StatusBar.currentHeight || 44;
            }
            return StatusBar.currentHeight || 24;
        };

        return (
            <View style={[style.headerContainer, { paddingTop: getStatusBarHeight() - 25 }]}>
                {/* Header with title and count */}
                <View style={style.headerContent}>
                    <View>
                        <Text style={style.headerTitle}>
                            Zonas
                        </Text>
                        {zonas && (
                            <Text style={style.headerSubtitle}>
                                {zonas.length} zonas encontradas
                            </Text>
                        )}
                    </View>

                    {/* Sort controls */}
                    <View style={style.sortContainer}>
                        <TouchableOpacity
                            style={[style.sortButton, sortBy === "nombre" && style.sortButtonActive]}
                            onPress={() => handleSortChange("nombre")}
                        >
                            <Text style={[style.sortButtonText, sortBy === "nombre" && style.sortButtonTextActive]}>
                                Nombre
                            </Text>
                            {sortBy === "nombre" && (
                                <FontAwesome
                                    name={sortOrder === "asc" ? "sort-up" : "sort-down"}
                                    style={style.sortIcon}
                                />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[style.sortButton, sortBy === "fecha" && style.sortButtonActive]}
                            onPress={() => handleSortChange("fecha")}
                        >
                            <Text style={[style.sortButtonText, sortBy === "fecha" && style.sortButtonTextActive]}>
                                Fecha
                            </Text>
                            {sortBy === "fecha" && (
                                <FontAwesome
                                    name={sortOrder === "asc" ? "sort-up" : "sort-down"}
                                    style={style.sortIcon}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Input section */}
                <View style={style.inputContainer}>
                    <TextInput
                        placeholder="Nombre de la zona"
                        autoCapitalize='none'
                        onChangeText={setZona}
                        value={zona}
                        style={style.inputField}
                    />
                    <TouchableOpacity
                        style={style.addButton}
                        onPress={handleCreateZona}
                    >
                        <FontAwesome name={'plus'} style={style.addButtonIcon} />
                        <Text style={style.addButtonText}>
                            Agregar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderZonas = () => {
        const sortedZonas = getSortedZonas();
        return sortedZonas.map((zonaData, key) => (
            <View style={style.vehiculo} key={key}>
                <View style={style.vehiculoTexto}>
                    <Text style={style.zonaItemText}>
                        {zonaData.nombre}
                    </Text>
                </View>
                <View style={style.zonaItemContainer}>
                    <TouchableOpacity
                        style={style.editButton}
                        onPress={() => handleEditZona(zonaData)}
                    >
                        <FontAwesome name={'edit'} style={style.editButtonIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={style.deleteButton}
                        onPress={() => handleDeleteZona(zonaData)}
                    >
                        <FontAwesome name={'trash'} style={style.deleteButtonIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        ));
    };

    const renderEditModal = () => (
        <Modal
            visible={editModalVisible}
            transparent={true}
            animationType="none"
            onRequestClose={() => setEditModalVisible(false)}
        >
            <Animated.View style={[style.contenedorModal, { opacity: modalOpacity }]}>
                <Animated.View style={[
                    style.subContenedorModal,
                    {
                        transform: [{ scale: modalScale }],
                    }
                ]}>
                    <TouchableOpacity
                        style={style.btnModalClose}
                        onPress={() => setEditModalVisible(false)}
                    >
                        <FontAwesome name={'times'} style={style.iconCerrar} />
                    </TouchableOpacity>

                    <Text style={style.titulo}>Editar Zona</Text>

                    <TextInput
                        placeholder="Nombre de la zona"
                        autoCapitalize='none'
                        onChangeText={setEditText}
                        value={editText}
                        style={style.modalInputField}
                    />

                    <View style={style.modalButtonsContainer}>
                        <TouchableOpacity
                            style={style.modalCancelButton}
                            onPress={() => setEditModalVisible(false)}
                        >
                            <Text style={style.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={style.modalSaveButton}
                            onPress={handleUpdateZona}
                        >
                            <Text style={style.modalButtonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );

    return (
        <View style={style.container}>
            {renderHeader()}
            <ScrollView style={style.subContenedor}>
                {renderZonas()}
            </ScrollView>
            {renderEditModal()}
            <Footer navigation={navigation} />
            <Toast />
        </View>
    );
};

export default Zona;
