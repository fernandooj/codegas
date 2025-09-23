/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {

    // Procesar la notificación en background
    // Esto es importante para que las notificaciones aparezcan cuando la app está cerrada
});

AppRegistry.registerComponent(appName, () => App);
