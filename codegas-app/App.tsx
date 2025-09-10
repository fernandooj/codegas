import React from 'react';
import { Provider } from 'react-redux';
import { View, Text } from 'react-native';
import configStore from './src/redux/store.js';
import MainRoutes from './src/routes/MainRoutes';
import axios from 'axios';
import { DataProvider } from './src/context/context';
import Toast from 'react-native-toast-message';
const store = configStore();

// export const URL = 'https://216vhep1ye.execute-api.us-east-1.amazonaws.com';
// export const URL = 'https://appcodegas.com:3131'; //// URL WEB DEV
export const URL = 'http://localhost:4000'; //// URL local
export const VERSION = '1.0.0';
axios.defaults.baseURL = URL;

function App(): JSX.Element {
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