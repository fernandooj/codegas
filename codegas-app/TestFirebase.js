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
    console.log('✅ Firebase modules imported successfully');
} catch (error) {
    console.error('❌ Error importing Firebase modules:', error);
}

export const testFirebaseInstallation = async () => {
    console.log('\n🧪 === Testing Firebase Installation ===');

    try {
        // 1. Verificar que Firebase App está disponible
        if (firebase) {
            console.log('✅ Firebase App is available');
            console.log('📱 Platform:', Platform.OS);

            // Verificar apps de Firebase
            const apps = firebase.apps;
            console.log('🔧 Firebase apps:', apps.length);

            if (apps.length > 0) {
                console.log('✅ Firebase is initialized');
                console.log('📋 App name:', apps[0].name);
            } else {
                console.log('⚠️ Firebase apps not found - may need GoogleService files');
            }
        } else {
            console.log('❌ Firebase App not available');
            return false;
        }

        // 2. Verificar Firebase Messaging
        if (messaging) {
            console.log('✅ Firebase Messaging is available');

            // Verificar permisos (esto puede fallar en simulador)
            try {
                const authStatus = await messaging().hasPermission();
                console.log('🔐 Notification permission status:', authStatus);

                if (Platform.OS === 'ios') {
                    const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages();
                    console.log('📝 Device registered for remote messages:', isRegistered);
                }

                // Intentar obtener token (puede fallar en simulador)
                try {
                    const token = await messaging().getToken();
                    if (token) {
                        console.log('🎯 FCM Token obtained successfully');
                        console.log('📧 Token length:', token.length);
                        console.log('🔑 Token preview:', token.substring(0, 50) + '...');
                    } else {
                        console.log('⚠️ No FCM token - may be running on simulator');
                    }
                } catch (tokenError) {
                    console.log('⚠️ Could not get FCM token (normal on simulator):', tokenError.message);
                }

            } catch (permissionError) {
                console.log('⚠️ Could not check permissions (normal on simulator):', permissionError.message);
            }
        } else {
            console.log('❌ Firebase Messaging not available');
            return false;
        }

        console.log('✅ Firebase installation test completed successfully!\n');
        return true;

    } catch (error) {
        console.error('❌ Error testing Firebase installation:', error);
        return false;
    }
};

export const testPushNotificationService = async () => {
    console.log('\n🧪 === Testing Push Notification Service ===');

    try {
        const pushNotificationService = require('./src/services/pushNotificationService').default;

        if (pushNotificationService) {
            console.log('✅ Push notification service imported successfully');

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
                    console.log(`✅ Method available: ${method}`);
                } else {
                    console.log(`❌ Method missing: ${method}`);
                }
            });

            // Enviar notificación de prueba
            const testResult = pushNotificationService.sendTestNotification(
                'Firebase Test',
                'Firebase Cloud Messaging está funcionando correctamente!'
            );

            if (testResult.success) {
                console.log('✅ Test notification sent successfully');
            } else {
                console.log('❌ Test notification failed:', testResult.error);
            }

            console.log('✅ Push notification service test completed!\n');
            return true;
        } else {
            console.log('❌ Push notification service not available');
            return false;
        }

    } catch (error) {
        console.error('❌ Error testing push notification service:', error);
        return false;
    }
};

// Función para ejecutar todas las pruebas
export const runAllFirebaseTests = async () => {
    console.log('\n🚀 === Running All Firebase Tests ===\n');

    const results = {
        firebaseInstallation: await testFirebaseInstallation(),
        pushNotificationService: await testPushNotificationService()
    };

    console.log('\n📊 === Test Results Summary ===');
    console.log('Firebase Installation:', results.firebaseInstallation ? '✅ PASS' : '❌ FAIL');
    console.log('Push Notification Service:', results.pushNotificationService ? '✅ PASS' : '❌ FAIL');

    const allPassed = Object.values(results).every(result => result === true);
    console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');

    return results;
};

export default {
    testFirebaseInstallation,
    testPushNotificationService,
    runAllFirebaseTests
};
