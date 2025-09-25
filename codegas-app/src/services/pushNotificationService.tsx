import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { getApps } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import axios from 'axios';
import {
    NotificationResponse,
    PushNotificationConfig,
    SendTokenRequest,
    SendTokenResponse,
    PushNotificationService
} from './pushNotificationService.types';

// Estado global del servicio
let pushNotificationState: PushNotificationConfig = {
    token: null,
    initialized: false
};

// Verificar si estamos en simulador/emulador
const isSimulator = async (): Promise<boolean> => {
    try {
        // Para iOS: verificar si el dispositivo está registrado para mensajes remotos
        if (Platform.OS === 'ios') {
            try {
                const isRegistered = messaging().isDeviceRegisteredForRemoteMessages;
                const isIOSSimulator = !isRegistered;
                return isIOSSimulator;
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
                return !(testToken && testToken.length > 0);
            } catch (error) {
                return true;
            }
        }

        return false;
    } catch (error) {
        // En caso de error, asumir que es emulador para evitar problemas
        return true;
    }
};

// Configurar notificaciones locales para pruebas (usando Alert nativo)
const configureLocalNotifications = (): void => {
    // Configuración de notificaciones locales si es necesario
};

// Configurar manejadores de mensajes
const setupMessageHandlers = (): void => {
    // Manejar mensajes cuando la app está en primer plano
    messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        // Mostrar alerta local
        Alert.alert(
            remoteMessage.notification?.title || 'Nueva notificación',
            remoteMessage.notification?.body || 'Tienes una nueva notificación',
            [{ text: 'OK' }]
        );
    });

    // Manejar cuando se toca una notificación
    messaging().onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        // Aquí puedes manejar la navegación basada en la notificación
    });

    // Manejar cuando se abre la app desde una notificación
    messaging()
        .getInitialNotification()
        .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
            if (remoteMessage) {
                // Aquí puedes manejar la navegación inicial
            }
        });

    // Manejar actualizaciones del token
    messaging().onTokenRefresh((token: string) => {
        pushNotificationState.token = token;
        AsyncStorage.setItem('fcmToken', token);
    });
};

// Inicializar el servicio de notificaciones push
const initialize = async (): Promise<void> => {
    try {
        if (pushNotificationState.initialized) return;

        // Verificar que Firebase esté inicializado
        if (getApps().length === 0) {
            throw new Error('Firebase not initialized');
        }

        // Configurar notificaciones locales para pruebas (siempre)
        configureLocalNotifications();

        // Verificar si estamos en simulador/emulador
        if (await isSimulator()) {
            pushNotificationState.initialized = true;
            return;
        }

        // Solicitar permisos
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            // Registrar dispositivo para notificaciones remotas (solo iOS)
            if (Platform.OS === 'ios') {
                await messaging().registerDeviceForRemoteMessages();
            }

            // Obtener token FCM
            await getFCMToken();

            // Configurar listeners
            setupMessageHandlers();

            pushNotificationState.initialized = true;
        }
    } catch (error) {
        console.error('Error initializing push notifications:', error);
    }
};

// Obtener token FCM
const getFCMToken = async (): Promise<string | null> => {
    try {
        // Verificar si estamos en simulador/emulador
        if (await isSimulator()) {
            return null;
        }

        // Verificar si el dispositivo está registrado (solo en iOS)
        if (Platform.OS === 'ios') {
            try {
                const isRegistered = messaging().isDeviceRegisteredForRemoteMessages;
                if (!isRegistered) {
                    await messaging().registerDeviceForRemoteMessages();
                }
            } catch (error) {
                console.error('Error checking device registration:', error);
            }
        }

        const token = await messaging().getToken();
        if (token) {
            pushNotificationState.token = token;

            // Guardar token en AsyncStorage
            await AsyncStorage.setItem('fcmToken', token);

            return token;
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);

        // Si falla, intentar registrar el dispositivo nuevamente (solo en iOS)
        if (Platform.OS === 'ios') {
            try {
                await messaging().registerDeviceForRemoteMessages();
                const token = await messaging().getToken();
                if (token) {
                    pushNotificationState.token = token;
                    await AsyncStorage.setItem('fcmToken', token);
                    return token;
                }
            } catch (retryError) {
                console.error('Error retrying FCM token after registration:', retryError);
            }
        }
    }
    return null;
};

// Enviar token al backend
const sendTokenToBackend = async (userId: string): Promise<SendTokenResponse> => {
    try {
        if (!pushNotificationState.token || !userId) {
            return { success: false, error: 'Token o userId no disponible' };
        }

        // Verificar si estamos en simulador/emulador
        if (await isSimulator()) {
            return { success: false, error: 'Simulador/emulador detectado' };
        }

        // Llamada a la API para guardar el token
        const response = await axios.post('user/fcm-token', {
            userId,
            fcmToken: pushNotificationState.token
        } as SendTokenRequest);

        if (response.data.code === 1) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.data.message };
        }
    } catch (error: any) {
        console.error('Error sending token to backend:', error);
        return { success: false, error: error.message };
    }
};

// Obtener token actual
const getCurrentToken = (): string | null => {
    return pushNotificationState.token;
};

// Verificar si las notificaciones están habilitadas
const areNotificationsEnabled = async (): Promise<boolean> => {
    try {
        const authStatus = await messaging().hasPermission();
        return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    } catch (error) {
        console.error('Error checking notification permission:', error);
        return false;
    }
};

// Suscribirse a un tema
const subscribeToTopic = async (topic: string): Promise<void> => {
    try {
        await messaging().subscribeToTopic(topic);
    } catch (error) {
        console.error(`Error subscribing to topic ${topic}:`, error);
    }
};

// Desuscribirse de un tema
const unsubscribeFromTopic = async (topic: string): Promise<void> => {
    try {
        await messaging().unsubscribeFromTopic(topic);
    } catch (error) {
        console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
};

// ===== MÉTODOS PARA NOTIFICACIONES DE PRUEBA =====

// Enviar notificación de prueba local
const sendTestNotification = (
    title: string = 'Notificación de Prueba',
    message: string = 'Esta es una notificación de prueba desde Codegas'
): NotificationResponse => {
    try {
        Alert.alert(
            title,
            message,
            [
                { text: 'Cerrar', style: 'cancel' }
            ]
        );

        return { success: true, message: 'Notificación de prueba enviada' };
    } catch (error: any) {
        console.error('❌ Error enviando notificación de prueba:', error);
        return { success: false, error: error.message };
    }
};

// Enviar notificación de prueba programada (en 5 segundos)
const sendScheduledTestNotification = (
    title: string = 'Notificación Programada',
    message: string = 'Esta notificación fue programada hace 5 segundos'
): NotificationResponse => {
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
    } catch (error: any) {
        console.error('❌ Error programando notificación:', error);
        return { success: false, error: error.message };
    }
};

// Simular notificación de pedido (como las que enviará el Lambda)
const sendTestOrderNotification = (
    orderId: string = '12345',
    deliveryDate: string = '2025-09-16'
): NotificationResponse => {
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
    } catch (error: any) {
        console.error('❌ Error enviando notificación de pedido:', error);
        return { success: false, error: error.message };
    }
};

// Cancelar todas las notificaciones programadas
const cancelAllNotifications = (): NotificationResponse => {
    try {
        return { success: true, message: 'Notificaciones canceladas' };
    } catch (error: any) {
        console.error('❌ Error cancelando notificaciones:', error);
        return { success: false, error: error.message };
    }
};

// ===== MÉTODOS PARA DEBUGGING =====

// Mostrar información completa del token FCM
const showFCMTokenInfo = (): string | null => {
    return pushNotificationState.token;
};

// Forzar obtención de nuevo token FCM
const forceGetNewToken = async (): Promise<string | null> => {
    try {
        const token = await getFCMToken();
        return token;
    } catch (error) {
        console.error('❌ Error forzando obtención de token:', error);
        return null;
    }
};

// Crear el objeto del servicio con todas las funciones
const pushNotificationService: PushNotificationService = {
    initialize,
    getFCMToken,
    sendTokenToBackend,
    getCurrentToken,
    areNotificationsEnabled,
    subscribeToTopic,
    unsubscribeFromTopic,
    sendTestNotification,
    sendScheduledTestNotification,
    sendTestOrderNotification,
    cancelAllNotifications,
    showFCMTokenInfo,
    forceGetNewToken,
    isSimulator
};

// Exportar instancia del servicio
export default pushNotificationService;
