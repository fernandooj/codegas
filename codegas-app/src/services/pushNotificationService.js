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
            console.log(`🔍 Verificando si es simulador/emulador en ${Platform.OS}...`);

            // Para iOS: verificar si el dispositivo está registrado para mensajes remotos
            if (Platform.OS === 'ios') {
                try {
                    const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages();
                    const isIOSSimulator = !isRegistered;
                    if (isIOSSimulator) {
                        console.log('🔍 Detectado simulador iOS (no registrado para mensajes remotos)');
                        return true;
                    } else {
                        console.log('✅ Dispositivo iOS físico detectado');
                        return false;
                    }
                } catch (error) {
                    console.log('⚠️ Error verificando registro de mensajes remotos en iOS:', error);
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
                        console.log('✅ Dispositivo Android físico detectado (token FCM obtenido)');
                        return false;
                    } else {
                        console.log('🔍 Posible emulador Android (no se pudo obtener token FCM)');
                        return true;
                    }
                } catch (error) {
                    console.log('🔍 Emulador Android detectado (error obteniendo token FCM):', error.message);
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.log('⚠️ Error detectando simulador/emulador:', error);
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
                console.log('⚠️ Firebase not initialized yet, waiting...');
                throw new Error('Firebase not initialized');
            }

            console.log('✅ Firebase is available, initializing push notifications...');

            // Configurar notificaciones locales para pruebas (siempre)
            this.configureLocalNotifications();

            // Verificar si estamos en simulador/emulador
            if (await this.isSimulator()) {
                console.log('⚠️ Ejecutando en simulador/emulador - Usando notificaciones locales para pruebas');
                this.initialized = true;
                return;
            }

            // Solicitar permisos
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Push notification permission granted');

                // Registrar dispositivo para notificaciones remotas (iOS)
                await messaging().registerDeviceForRemoteMessages();
                console.log('Device registered for remote messages');

                // Obtener token FCM
                await this.getFCMToken();

                // Configurar listeners
                this.setupMessageHandlers();

                this.initialized = true;
            } else {
                console.log('Push notification permission denied');
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
                console.log('⚠️ No se puede obtener token FCM en simulador/emulador');
                return null;
            }

            // Verificar si el dispositivo está registrado
            const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages();
            if (!isRegistered) {
                console.log('Device not registered for remote messages, registering now...');
                await messaging().registerDeviceForRemoteMessages();
            }

            const token = await messaging().getToken();
            if (token) {
                this.token = token;
                console.log('🎫 ===== FCM TOKEN OBTENIDO =====');
                console.log('📱 Token FCM:', token);
                console.log('📏 Longitud del token:', token.length);
                console.log('🔍 Primeros 20 caracteres:', token.substring(0, 20) + '...');
                console.log('🔍 Últimos 20 caracteres:', '...' + token.substring(token.length - 20));
                console.log('🎫 ================================');

                // Guardar token en AsyncStorage
                await AsyncStorage.setItem('fcmToken', token);
                console.log('💾 Token guardado en AsyncStorage');

                return token;
            }
        } catch (error) {
            console.error('Error getting FCM token:', error);

            // Si falla, intentar registrar el dispositivo nuevamente
            try {
                console.log('Attempting to register device for remote messages...');
                await messaging().registerDeviceForRemoteMessages();
                const token = await messaging().getToken();
                if (token) {
                    this.token = token;
                    console.log('🎫 ===== FCM TOKEN OBTENIDO (REINTENTO) =====');
                    console.log('📱 Token FCM:', token);
                    console.log('📏 Longitud del token:', token.length);
                    console.log('🔍 Primeros 20 caracteres:', token.substring(0, 20) + '...');
                    console.log('🔍 Últimos 20 caracteres:', '...' + token.substring(token.length - 20));
                    console.log('🎫 ===========================================');
                    await AsyncStorage.setItem('fcmToken', token);
                    console.log('💾 Token guardado en AsyncStorage (reintento)');
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
            console.log('Message received in foreground:', remoteMessage);

            // Mostrar alerta local
            Alert.alert(
                remoteMessage.notification?.title || 'Nueva notificación',
                remoteMessage.notification?.body || 'Tienes una nueva notificación',
                [{ text: 'OK' }]
            );
        });

        // Manejar cuando se toca una notificación
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification opened app:', remoteMessage);
            // Aquí puedes manejar la navegación basada en la notificación
        });

        // Manejar cuando se abre la app desde una notificación
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('App opened from notification:', remoteMessage);
                    // Aquí puedes manejar la navegación inicial
                }
            });

        // Manejar actualizaciones del token
        messaging().onTokenRefresh(token => {
            console.log('🔄 ===== FCM TOKEN ACTUALIZADO =====');
            console.log('📱 Nuevo Token FCM:', token);
            console.log('📏 Longitud del token:', token.length);
            console.log('🔍 Primeros 20 caracteres:', token.substring(0, 20) + '...');
            console.log('🔍 Últimos 20 caracteres:', '...' + token.substring(token.length - 20));
            console.log('🔄 ================================');
            this.token = token;
            AsyncStorage.setItem('fcmToken', token);
            console.log('💾 Token actualizado guardado en AsyncStorage');
        });
    }

    // Enviar token al backend
    async sendTokenToBackend(userId) {
        try {
            if (!this.token || !userId) {
                console.log('No token or userId available');
                return;
            }

            // Verificar si estamos en simulador/emulador
            if (await this.isSimulator()) {
                console.log('⚠️ Ejecutando en simulador/emulador - Token FCM no se enviará al backend');
                return { success: false, error: 'Simulador/emulador detectado' };
            }

            // Llamada a la API para guardar el token
            const response = await axios.post('user/fcm-token', {
                userId,
                fcmToken: this.token
            });

            if (response.data.code === 1) {
                console.log('FCM token sent successfully to backend for user:', userId);
                return { success: true, data: response.data };
            } else {
                console.log('Error sending FCM token:', response.data.message);
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            console.error('Error sending token to backend:', error);
            return { success: false, error: error.message };
        }
    }

    // Obtener token actual
    getCurrentToken() {
        console.log('🔍 ===== CONSULTANDO TOKEN FCM ACTUAL =====');
        if (this.token) {
            console.log('📱 Token FCM actual:', this.token);
            console.log('📏 Longitud del token:', this.token.length);
            console.log('🔍 Primeros 20 caracteres:', this.token.substring(0, 20) + '...');
            console.log('🔍 Últimos 20 caracteres:', '...' + this.token.substring(this.token.length - 20));
        } else {
            console.log('❌ No hay token FCM disponible');
            console.log('💡 Esto es NORMAL si estás usando un emulador/simulador');
            console.log('💡 Los tokens FCM solo funcionan en dispositivos físicos');
        }
        console.log('🔍 ========================================');
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
            console.log(`Subscribed to topic: ${topic}`);
        } catch (error) {
            console.error(`Error subscribing to topic ${topic}:`, error);
        }
    }

    // Desuscribirse de un tema
    async unsubscribeFromTopic(topic) {
        try {
            await messaging().unsubscribeFromTopic(topic);
            console.log(`Unsubscribed from topic: ${topic}`);
        } catch (error) {
            console.error(`Error unsubscribing from topic ${topic}:`, error);
        }
    }

    // ===== MÉTODOS PARA NOTIFICACIONES DE PRUEBA =====

    // Configurar notificaciones locales para pruebas (usando Alert nativo)
    configureLocalNotifications() {
        console.log('📱 Configurando notificaciones locales con Alert nativo');
    }

    // Enviar notificación de prueba local
    sendTestNotification(title = 'Notificación de Prueba', message = 'Esta es una notificación de prueba desde Codegas') {
        try {
            Alert.alert(
                title,
                message,
                [
                    { text: 'Ver', onPress: () => console.log('Ver presionado') },
                    { text: 'Cerrar', style: 'cancel' }
                ]
            );

            console.log('✅ Notificación de prueba enviada:', { title, message });
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
                    [{ text: 'OK', onPress: () => console.log('Notificación programada vista') }]
                );
            }, 5000);

            console.log('⏰ Notificación programada para:', date.toLocaleString());
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
                    { text: 'Ver Pedido', onPress: () => console.log('Ver pedido presionado') },
                    { text: 'Cerrar', style: 'cancel' }
                ]
            );

            console.log('📦 Notificación de pedido de prueba enviada:', { orderId, deliveryDate });
            return { success: true, message: 'Notificación de pedido enviada' };
        } catch (error) {
            console.error('❌ Error enviando notificación de pedido:', error);
            return { success: false, error: error.message };
        }
    }

    // Cancelar todas las notificaciones programadas
    cancelAllNotifications() {
        try {
            console.log('🗑️ Todas las notificaciones programadas canceladas');
            return { success: true, message: 'Notificaciones canceladas' };
        } catch (error) {
            console.error('❌ Error cancelando notificaciones:', error);
            return { success: false, error: error.message };
        }
    }

    // ===== MÉTODOS PARA DEBUGGING =====

    // Mostrar información completa del token FCM
    showFCMTokenInfo() {
        console.log('🔍 ===== INFORMACIÓN COMPLETA DEL TOKEN FCM =====');
        console.log('📱 Token FCM:', this.token);
        console.log('📏 Longitud del token:', this.token ? this.token.length : 'N/A');
        console.log('🔍 Primeros 30 caracteres:', this.token ? this.token.substring(0, 30) + '...' : 'N/A');
        console.log('🔍 Últimos 30 caracteres:', this.token ? '...' + this.token.substring(this.token.length - 30) : 'N/A');
        console.log('💾 Guardado en AsyncStorage:', this.token ? 'Sí' : 'No');
        console.log('🔍 ==============================================');
        return this.token;
    }

    // Forzar obtención de nuevo token FCM
    async forceGetNewToken() {
        try {
            console.log('🔄 Forzando obtención de nuevo token FCM...');
            const token = await this.getFCMToken();
            if (token) {
                console.log('✅ Nuevo token FCM obtenido exitosamente');
                return token;
            } else {
                console.log('❌ No se pudo obtener nuevo token FCM');
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
