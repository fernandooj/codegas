/**
 * Archivo de prueba para verificar que Firebase está correctamente instalado
 * 
 * Para usar este archivo:
 * 1. Importar en App.tsx o cualquier componente
 * 2. Llamar testFirebaseInstallation()
 * 3. Verificar los logs en la consola
 */

import { Platform } from 'react-native';

// Importaciones de Firebase
let firebase, messaging;

try {
    firebase = require('@react-native-firebase/app').default;
    messaging = require('@react-native-firebase/messaging').default;
} catch (error) {
    console.error('❌ Error importing Firebase modules:', error);
}

export const testFirebaseInstallation = async () => {

    try {
        // 1. Verificar que Firebase App está disponible
        if (firebase) {

            // Verificar apps de Firebase
            const apps = firebase.apps;

            if (apps.length > 0) {
            } else {
            }
        } else {
            return false;
        }

        // 2. Verificar Firebase Messaging
        if (messaging) {

            // Verificar permisos (esto puede fallar en simulador)
            try {
                const authStatus = await messaging().hasPermission();

                if (Platform.OS === 'ios') {
                    const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages();
                }

                // Intentar obtener token (puede fallar en simulador)
                try {
                    const token = await messaging().getToken();
                    if (token) {
                    } else {
                    }
                } catch (tokenError) {
                }

            } catch (permissionError) {
            }
        } else {
            return false;
        }

        return true;

    } catch (error) {
        console.error('❌ Error testing Firebase installation:', error);
        return false;
    }
};

export const testPushNotificationService = async () => {

    try {
        const pushNotificationService = require('./src/services/pushNotificationService').default;

        if (pushNotificationService) {

            // Verificar métodos disponibles
            const methods = [
                'initialize',
                'getFCMToken',
                'sendTokenToBackend',
                'sendTestNotification',
                'sendTestOrderNotification'
            ];

            methods.forEach(method => {
                if (typeof pushNotificationService[method] === 'function') {
                } else {
                }
            });

            // Enviar notificación de prueba
            const testResult = pushNotificationService.sendTestNotification(
                'Firebase Test',
                'Firebase Cloud Messaging está funcionando correctamente!'
            );

            if (testResult.success) {
            } else {
            }

            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error('❌ Error testing push notification service:', error);
        return false;
    }
};

// Función para ejecutar todas las pruebas
export const runAllFirebaseTests = async () => {

    const results = {
        firebaseInstallation: await testFirebaseInstallation(),
        pushNotificationService: await testPushNotificationService()
    };


    const allPassed = Object.values(results).every(result => result === true);

    return results;
};

export default {
    testFirebaseInstallation,
    testPushNotificationService,
    runAllFirebaseTests
};
