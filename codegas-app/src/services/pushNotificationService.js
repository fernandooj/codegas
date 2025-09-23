import messaging from '@react-native-firebase/messaging';
import { getApps } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import axios from 'axios';

class PushNotificationService {
    constructor() {
        this.token = null;
        this.initialized = false;
    }

    // Verificar si estamos en simulador/emulador
    async isSimulator() {
        try {

            // Para iOS: verificar si el dispositivo está registrado para mensajes remotos
            if (Platform.OS === 'ios') {
                try {
                    const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages();
                    const isIOSSimulator = !isRegistered;
                    if (isIOSSimulator) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    // Asumir que es simulador si hay error
                    return true;
                }
            }

            // Para Android: intentar obtener token FCM como prueba
            if (Platform.OS === 'android') {
                try {
                    // Intentar obtener token FCM - si falla, probablemente es emulador
                    const testToken = await messaging().getToken();
                    if (testToken && testToken.length > 0) {
                        return false;
                    } else {
                        return true;
                    }
                } catch (error) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            // En caso de error, asumir que es emulador para evitar problemas
            return true;
        }
    }

    // Inicializar el servicio de notificaciones push
    async initialize() {
        try {
            if (this.initialized) return;

            // Verificar que Firebase esté inicializado
            if (getApps().length === 0) {
                throw new Error('Firebase not initialized');
            }


            // Configurar notificaciones locales para pruebas (siempre)
            this.configureLocalNotifications();

            // Verificar si estamos en simulador/emulador
            if (await this.isSimulator()) {
                this.initialized = true;
                return;
            }

            // Solicitar permisos
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {

                // Registrar dispositivo para notificaciones remotas (iOS)
                await messaging().registerDeviceForRemoteMessages();

                // Obtener token FCM
                await this.getFCMToken();

                // Configurar listeners
                this.setupMessageHandlers();

                this.initialized = true;
            } else {
            }
        } catch (error) {
            console.error('Error initializing push notifications:', error);
        }
    }

    // Obtener token FCM
    async getFCMToken() {
        try {
            // Verificar si estamos en simulador/emulador
            if (await this.isSimulator()) {
                return null;
            }

            // Verificar si el dispositivo está registrado
            const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages();
            if (!isRegistered) {
                await messaging().registerDeviceForRemoteMessages();
            }

            const token = await messaging().getToken();
            if (token) {
                this.token = token;

                // Guardar token en AsyncStorage
                await AsyncStorage.setItem('fcmToken', token);

                return token;
            }
        } catch (error) {
            console.error('Error getting FCM token:', error);

            // Si falla, intentar registrar el dispositivo nuevamente
            try {
                await messaging().registerDeviceForRemoteMessages();
                const token = await messaging().getToken();
                if (token) {
                    this.token = token;
                    await AsyncStorage.setItem('fcmToken', token);
                    return token;
                }
            } catch (retryError) {
                console.error('Error retrying FCM token after registration:', retryError);
            }
        }
        return null;
    }

    // Configurar manejadores de mensajes
    setupMessageHandlers() {
        // Manejar mensajes cuando la app está en primer plano
        messaging().onMessage(async remoteMessage => {

            // Mostrar alerta local
            Alert.alert(
                remoteMessage.notification?.title || 'Nueva notificación',
                remoteMessage.notification?.body || 'Tienes una nueva notificación',
                [{ text: 'OK' }]
            );
        });

        // Manejar cuando se toca una notificación
        messaging().onNotificationOpenedApp(remoteMessage => {
            // Aquí puedes manejar la navegación basada en la notificación
        });

        // Manejar cuando se abre la app desde una notificación
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    // Aquí puedes manejar la navegación inicial
                }
            });

        // Manejar actualizaciones del token
        messaging().onTokenRefresh(token => {
            this.token = token;
            AsyncStorage.setItem('fcmToken', token);
        });
    }

    // Enviar token al backend
    async sendTokenToBackend(userId) {
        try {
            if (!this.token || !userId) {
                return;
            }

            // Verificar si estamos en simulador/emulador
            if (await this.isSimulator()) {
                return { success: false, error: 'Simulador/emulador detectado' };
            }

            // Llamada a la API para guardar el token
            const response = await axios.post('user/fcm-token', {
                userId,
                fcmToken: this.token
            });

            if (response.data.code === 1) {
                return { success: true, data: response.data };
            } else {
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            console.error('Error sending token to backend:', error);
            return { success: false, error: error.message };
        }
    }

    // Obtener token actual
    getCurrentToken() {
        if (this.token) {
        } else {
        }
        return this.token;
    }

    // Verificar si las notificaciones están habilitadas
    async areNotificationsEnabled() {
        try {
            const authStatus = await messaging().hasPermission();
            return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        } catch (error) {
            console.error('Error checking notification permission:', error);
            return false;
        }
    }

    // Suscribirse a un tema
    async subscribeToTopic(topic) {
        try {
            await messaging().subscribeToTopic(topic);
        } catch (error) {
            console.error(`Error subscribing to topic ${topic}:`, error);
        }
    }

    // Desuscribirse de un tema
    async unsubscribeFromTopic(topic) {
        try {
            await messaging().unsubscribeFromTopic(topic);
        } catch (error) {
            console.error(`Error unsubscribing from topic ${topic}:`, error);
        }
    }

    // ===== MÉTODOS PARA NOTIFICACIONES DE PRUEBA =====

    // Configurar notificaciones locales para pruebas (usando Alert nativo)
    configureLocalNotifications() {
    }

    // Enviar notificación de prueba local
    sendTestNotification(title = 'Notificación de Prueba', message = 'Esta es una notificación de prueba desde Codegas') {
        try {
            Alert.alert(
                title,
                message,
                [
                    { text: 'Cerrar', style: 'cancel' }
                ]
            );

            return { success: true, message: 'Notificación de prueba enviada' };
        } catch (error) {
            console.error('❌ Error enviando notificación de prueba:', error);
            return { success: false, error: error.message };
        }
    }

    // Enviar notificación de prueba programada (en 5 segundos)
    sendScheduledTestNotification(title = 'Notificación Programada', message = 'Esta notificación fue programada hace 5 segundos') {
        try {
            const date = new Date();
            date.setSeconds(date.getSeconds() + 5);

            setTimeout(() => {
                Alert.alert(
                    title,
                    message,
                );
            }, 5000);

            return { success: true, message: 'Notificación programada para 5 segundos' };
        } catch (error) {
            console.error('❌ Error programando notificación:', error);
            return { success: false, error: error.message };
        }
    }

    // Simular notificación de pedido (como las que enviará el Lambda)
    sendTestOrderNotification(orderId = '12345', deliveryDate = '2025-09-16') {
        try {
            const title = '🚚 Recordatorio de Pedido';
            const message = `Tu pedido #${orderId} será entregado el ${deliveryDate}. ¡Prepárate!`;

            Alert.alert(
                title,
                message,
                [
                    { text: 'Cerrar', style: 'cancel' }
                ]
            );

            return { success: true, message: 'Notificación de pedido enviada' };
        } catch (error) {
            console.error('❌ Error enviando notificación de pedido:', error);
            return { success: false, error: error.message };
        }
    }

    // Cancelar todas las notificaciones programadas
    cancelAllNotifications() {
        try {
            return { success: true, message: 'Notificaciones canceladas' };
        } catch (error) {
            console.error('❌ Error cancelando notificaciones:', error);
            return { success: false, error: error.message };
        }
    }

    // ===== MÉTODOS PARA DEBUGGING =====

    // Mostrar información completa del token FCM
    showFCMTokenInfo() {
        return this.token;
    }

    // Forzar obtención de nuevo token FCM
    async forceGetNewToken() {
        try {
            const token = await this.getFCMToken();
            if (token) {
                return token;
            } else {
                return null;
            }
        } catch (error) {
            console.error('❌ Error forzando obtención de token:', error);
            return null;
        }
    }
}

// Exportar instancia singleton
export default new PushNotificationService();
