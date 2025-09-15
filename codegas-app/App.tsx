import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { View, Text } from 'react-native';
import configStore from './src/redux/store.js';
import MainRoutes from './src/routes/MainRoutes';
import axios from 'axios';
import { DataProvider } from './src/context/context';
import Toast from 'react-native-toast-message';
import pushNotificationService from './src/services/pushNotificationService';
import { runAllFirebaseTests } from './TestFirebase';
import { initializeApp, getApps, getApp } from '@react-native-firebase/app';
const store = configStore();

// export const URL = 'https://216vhep1ye.execute-api.us-east-1.amazonaws.com';
// export const URL = 'https://appcodegas.com:3131'; //// URL WEB DEV
export const URL = 'http://192.168.0.8:4000'; //// URL local para Android
export const VERSION = '1.0.0';
axios.defaults.baseURL = URL;

function App(): React.JSX.Element {
  const [firebaseInitialized, setFirebaseInitialized] = React.useState(false);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Initialize Firebase if not already initialized
        if (getApps().length === 0) {
          console.log('⚠️ No Firebase apps found, initializing...');
          await initializeApp();
          console.log('✅ Firebase initialized successfully');
        } else {
          console.log('✅ Firebase already initialized');
        }

        // Wait to ensure Firebase is fully ready
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify Firebase is working by testing auth
        try {
          const app = getApp();
          const auth = app.auth();
          console.log('✅ Firebase Auth module loaded successfully');
        } catch (authError) {
          console.log('⚠️ Firebase Auth not ready yet, waiting more...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Mark Firebase as initialized
        setFirebaseInitialized(true);

        // Initialize push notification service after Firebase
        await pushNotificationService.initialize();
        console.log('✅ Push notification service initialized');

        // Test Firebase installation (remove this in production)
        setTimeout(() => {
          runAllFirebaseTests();
        }, 1000);

      } catch (error) {
        console.error('❌ Error during app initialization:', error);
        // Even if Firebase fails, show the app (for development)
        setFirebaseInitialized(true);
      }
    };

    initializeFirebase();
  }, []);

  // Show loading screen while Firebase initializes
  if (!firebaseInitialized) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: '#333',
        }}>
          Inicializando Firebase...
        </Text>
      </View>
    );
  }

  return (
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
                height: 50,
                width: '90%',
                backgroundColor: '#F44336',
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
          }}
        />
      </Provider>
    </DataProvider>
  );
}
export default App;