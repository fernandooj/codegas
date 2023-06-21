import React from 'react';
import {Provider} from 'react-redux';
import configStore from './src/redux/store.js';
import MainRoutes from './src/routes/MainRoutes';
import axios from 'axios';
import {ToastProvider} from 'react-native-toast-notifications';
import {DataProvider} from './src/context/context';
const store = configStore();

export const URL = 'https://uk1e5xqrv4.execute-api.us-east-1.amazonaws.com';
// export const URL = 'https://appcodegas.com:3131'; //// URL WEB DEV
// export const URL = 'http://127.0.0.1:8181';       //// URL local
export const VERSION = '1.0.0';
axios.defaults.baseURL = URL;

function App(): JSX.Element {
  return (
    <DataProvider>
      <Provider store={store}>
        <ToastProvider>
          <MainRoutes />
        </ToastProvider>
      </Provider>
    </DataProvider>
  );
}
export default App;
