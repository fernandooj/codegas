import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import configStore from './src/redux/store.js';
import MainRoutes from './src/routes/MainRoutes';
import axios from 'axios';
import { DataProvider } from './src/context/context';
import Toast from 'react-native-toast-message';
import pushNotificationService from './src/services/pushNotificationService';
import remoteConfigService from './src/services/remoteConfigService';
// import { runAllFirebaseTests } from './TestFirebase';
import { initializeApp, getApps, getApp } from '@react-native-firebase/app';
import SplashScreen from './src/components/SplashScreen';
const store = configStore();

// URL y versión de la app
export let URL = ''; // Se cargará desde Firebase Remote Config
export const VERSION = '3.2.0';

// Función para actualizar la URL desde Remote Config
export const updateBaseURL = (newURL: string) => {
  URL = newURL;
  // Configurar axios con la nueva URL base desde Remote Config
  axios.defaults.baseURL = newURL;
  // Para desarrollo local, descomenta la siguiente línea y comenta la anterior:
  // axios.defaults.baseURL = "http://127.0.0.1:4000";
};

function App(): React.JSX.Element {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Initialize Firebase if not already initialized
        if (getApps().length === 0) {
          // Firebase se inicializa automáticamente con los archivos de configuración
          // google-services.json (Android) y GoogleService-Info.plist (iOS)
        }

        // Wait to ensure Firebase is fully ready
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify Firebase is working by testing auth
        try {
          const app = getApp();
          const auth = app.auth();
        } catch (authError) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Initialize Remote Config and get URL_END_POINT
        console.log('🔧 Initializing Remote Config...');
        await remoteConfigService.initialize();
        // En desarrollo forzamos el API codegas-dev (el Remote Config viejo apunta a otro stack sin firmas S3).
        const endpointUrl = __DEV__
          ? 'https://qykk424q9l.execute-api.us-east-1.amazonaws.com'
          : remoteConfigService.getEndpointUrl();
        updateBaseURL(endpointUrl);
        console.log('📡 API baseURL:', endpointUrl);

        // Mark Firebase as initialized
        setFirebaseInitialized(true);

        // Initialize push notification service after Firebase
        await pushNotificationService.initialize();

        // Test Firebase installation (remove this in production)
        // setTimeout(() => {
        //   runAllFirebaseTests();
        // }, 1000);

      } catch (error) {
        console.error('❌ Error during app initialization:', error);
        // Even if Firebase fails, show the app (for development)
        setFirebaseInitialized(true);
      }
    };

    initializeFirebase();
  }, []);

  // Eliminar la pantalla de carga - Firebase se inicializa en segundo plano
  // if (!firebaseInitialized) {
  //   return (
  //     <View style={{
  //       flex: 1,
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       backgroundColor: '#fff',
  //     }}>
  //       <Text style={{
  //         fontSize: 18,
  //         fontWeight: '600',
  //         color: '#333',
  //       }}>
  //         Inicializando Firebase...
  //       </Text>
  //     </View>
  //   );
  // }

  // Mostrar splash screen personalizado
  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <DataProvider>
        <Provider store={store}>
          <MainRoutes />
          <Toast
            config={{
              success: (props) => (
                <View style={{
                  height: 50,
                  width: '90%',
                  backgroundColor: '#4CAF50',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                    {props.text1}
                  </Text>
                </View>
              ),
              error: (props) => (
                <View style={{
                  minHeight: 60,
                  width: '90%',
                  backgroundColor: '#F44336',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}>
                    {props.text1}
                  </Text>
                  {props.text2 && (
                    <Text style={{
                      color: 'white',
                      fontSize: 14,
                      fontWeight: '400',
                      textAlign: 'center',
                      marginTop: 4,
                      opacity: 0.9,
                    }}>
                      {props.text2}
                    </Text>
                  )}
                </View>
              ),
              info: (props) => (
                <View style={{
                  minHeight: 60,
                  width: '90%',
                  backgroundColor: '#2196F3',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}>
                    {props.text1}
                  </Text>
                  {props.text2 && (
                    <Text style={{
                      color: 'white',
                      fontSize: 14,
                      fontWeight: '400',
                      textAlign: 'center',
                      marginTop: 4,
                      opacity: 0.9,
                    }}>
                      {props.text2}
                    </Text>
                  )}
                </View>
              ),
            }}
          />
        </Provider>
      </DataProvider>
    </SafeAreaProvider>
  );
}
export default App;