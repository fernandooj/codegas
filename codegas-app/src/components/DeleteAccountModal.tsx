import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    Dimensions
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { deleteAccount } from '../redux/actions/usuarioActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

interface DeleteAccountModalProps {
    visible: boolean;
    onClose: () => void;
    onAccountDeleted: () => void;
    userName: string;
    userId: string;
}

const { width } = Dimensions.get('window');

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    visible,
    onClose,
    onAccountDeleted,
    userName,
    userId
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleDeleteAccount = async () => {
        if (confirmText.toLowerCase() !== 'eliminar') {
            Alert.alert(
                'Error de confirmación',
                'Por favor escribe "ELIMINAR" para confirmar la eliminación de tu cuenta.',
                [{ text: 'Entendido', style: 'default' }]
            );
            return;
        }

        Alert.alert(
            '⚠️ Última confirmación',
            '¿Estás completamente seguro de que deseas eliminar tu cuenta? Podrás reactivarlacontactando soporte.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                    onPress: () => setConfirmText('')
                },
                {
                    text: 'SÍ, ELIMINAR',
                    style: 'destructive',
                    onPress: () => proceedWithDeletion()
                }
            ]
        );
    };

    const proceedWithDeletion = async () => {
        setIsDeleting(true);

        try {
            const response = await deleteAccount(userId);

            if (response.status) {
                // Clear all local storage
                await AsyncStorage.multiRemove([
                    'userId',
                    'nombre',
                    'email',
                    'acceso',
                    'avatar',
                    'tokenPhone',
                    'idPerfilregistro',
                    'formularioChat',
                    'usuariosEntrando'
                ]);

                Toast.show({
                    type: 'success',
                    text1: 'Cuenta eliminada',
                    text2: 'Tu cuenta ha sido eliminada exitosamente.'
                });

                onAccountDeleted();
                onClose();
            } else {
                throw new Error(response.message || 'Error al eliminar la cuenta');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo eliminar la cuenta. Intenta nuevamente.'
            });
        } finally {
            setIsDeleting(false);
            setConfirmText('');
        }
    };

    const resetModal = () => {
        setConfirmText('');
        setIsDeleting(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={resetModal}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <FontAwesome name="exclamation-triangle" size={40} color="#e74c3c" />
                            <Text style={styles.title}>Eliminar Cuenta</Text>
                        </View>

                        <View style={styles.content}>
                            <Text style={styles.warningText}>
                                <Text style={styles.bold}>¡ADVERTENCIA!</Text> Estás a punto de eliminar tu cuenta en Codegas.
                            </Text>

                            <View style={styles.consequencesContainer}>
                                <Text style={styles.consequencesTitle}>Esta acción causará:</Text>
                                <View style={styles.consequenceItem}>
                                    <FontAwesome name="ban" size={16} color="#e74c3c" />
                                    <Text style={styles.consequenceText}>Tu cuenta será eliminada</Text>
                                </View>
                                <View style={styles.consequenceItem}>
                                    <FontAwesome name="ban" size={16} color="#e74c3c" />
                                    <Text style={styles.consequenceText}>No podrás acceder a la aplicación ni a tu cuenta</Text>
                                </View>
                                <View style={styles.consequenceItem}>
                                    <FontAwesome name="ban" size={16} color="#e74c3c" />
                                    <Text style={styles.consequenceText}>Tus datos se mantendrán guardados</Text>
                                </View>
                                <View style={styles.consequenceItem}>
                                    <FontAwesome name="ban" size={16} color="#e74c3c" />
                                    <Text style={styles.consequenceText}>Podrás reactivar tu cuenta contactando soporte</Text>
                                </View>
                            </View>

                            <Text style={styles.irreversibleText}>
                                <Text style={styles.bold}>Tu cuenta será eliminada</Text> pero tus datos se conservarán para futuras reactivaciones.
                            </Text>

                            <View style={styles.confirmationContainer}>
                                <Text style={styles.confirmationText}>
                                    Para confirmar, escribe <Text style={styles.bold}>"ELIMINAR"</Text> en el campo de abajo:
                                </Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.confirmInput}
                                        value={confirmText}
                                        onChangeText={setConfirmText}
                                        placeholder="Escribe ELIMINAR aquí"
                                        placeholderTextColor="#999"
                                        autoCapitalize="characters"
                                        editable={!isDeleting}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={resetModal}
                                disabled={isDeleting}
                            >
                                <FontAwesome name="times" size={16} color="#ffffff" />
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    styles.deleteButton,
                                    (isDeleting || confirmText.toLowerCase() !== 'eliminar') && styles.disabledButton
                                ]}
                                onPress={handleDeleteAccount}
                                disabled={isDeleting || confirmText.toLowerCase() !== 'eliminar'}
                            >
                                {isDeleting ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <FontAwesome name="ban" size={16} color="#ffffff" />
                                )}
                                <Text style={styles.deleteButtonText}>
                                    {isDeleting ? 'Eliminando...' : 'Eliminar Cuenta'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        width: width * 0.9,
        maxHeight: '80%',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    scrollContainer: {
        maxHeight: '100%',
    },
    header: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginTop: 10,
    },
    content: {
        padding: 20,
    },
    warningText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
    consequencesContainer: {
        backgroundColor: '#fff5f5',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#e74c3c',
    },
    consequencesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 10,
    },
    consequenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    consequenceText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
    },
    irreversibleText: {
        fontSize: 14,
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    confirmationContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    confirmationText: {
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#ffffff',
    },
    confirmInput: {
        padding: 12,
        fontSize: 16,
        textAlign: 'center',
        borderWidth: 0,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 20,
        paddingTop: 0,
        gap: 10,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    cancelButton: {
        backgroundColor: '#95a5a6',
    },
    cancelButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
    },
    deleteButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#bdc3c7',
        opacity: 0.6,
    },
});

export default DeleteAccountModal;
