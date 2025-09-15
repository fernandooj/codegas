import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import pushNotificationService from '../services/pushNotificationService';

const NotificationTester = () => {
    const handleTestNotification = () => {
        const result = pushNotificationService.sendTestNotification(
            '🧪 Prueba Inmediata',
            'Esta es una notificación de prueba enviada desde la app'
        );

        if (result.success) {
            Alert.alert('✅ Éxito', 'Notificación de prueba enviada');
        } else {
            Alert.alert('❌ Error', result.error || 'Error desconocido');
        }
    };

    const handleScheduledNotification = () => {
        const result = pushNotificationService.sendScheduledTestNotification(
            '⏰ Notificación Programada',
            'Esta notificación fue programada para 5 segundos'
        );

        if (result.success) {
            Alert.alert('⏰ Programada', 'Notificación programada para 5 segundos');
        } else {
            Alert.alert('❌ Error', result.error || 'Error desconocido');
        }
    };

    const handleOrderNotification = () => {
        const orderId = Math.floor(Math.random() * 10000).toString();
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);

        const result = pushNotificationService.sendTestOrderNotification(
            orderId,
            deliveryDate.toLocaleDateString()
        );

        if (result.success) {
            Alert.alert('📦 Pedido Simulado', `Notificación de pedido #${orderId} enviada`);
        } else {
            Alert.alert('❌ Error', result.error || 'Error desconocido');
        }
    };

    const handleCancelNotifications = () => {
        const result = pushNotificationService.cancelAllNotifications();

        if (result.success) {
            Alert.alert('🗑️ Canceladas', 'Todas las notificaciones programadas fueron canceladas');
        } else {
            Alert.alert('❌ Error', result.error || 'Error desconocido');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔔 Probador de Notificaciones</Text>
            <Text style={styles.subtitle}>Simulador iOS - Notificaciones Locales</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleTestNotification}>
                    <Text style={styles.buttonText}>🧪 Enviar Prueba Inmediata</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleScheduledNotification}>
                    <Text style={styles.buttonText}>⏰ Programar (5 segundos)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleOrderNotification}>
                    <Text style={styles.buttonText}>📦 Simular Pedido</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelNotifications}>
                    <Text style={styles.buttonText}>🗑️ Cancelar Todas</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>ℹ️ Información:</Text>
                <Text style={styles.infoText}>• Las notificaciones funcionan en simulador iOS</Text>
                <Text style={styles.infoText}>• Simulan el comportamiento de FCM</Text>
                <Text style={styles.infoText}>• Perfecto para probar la funcionalidad</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    buttonContainer: {
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    infoContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    infoText: {
        fontSize: 14,
        marginBottom: 5,
        color: '#666',
    },
});

export default NotificationTester;
