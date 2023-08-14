import React from 'react';
import {Provider} from 'react-redux';
import configStore from './src/redux/store.js';
import MainRoutes from './src/routes/MainRoutes';
import axios from 'axios';
import {DataProvider} from './src/context/context';
const store = configStore();

export const URL = 'https://216vhep1ye.execute-api.us-east-1.amazonaws.com';
// export const URL = 'https://appcodegas.com:3131'; //// URL WEB DEV
// export const URL = 'http://localhost:4000'; //// URL local
export const VERSION = '1.0.0';
axios.defaults.baseURL = URL;

function App(): JSX.Element {
  return (
    <DataProvider>
      <Provider store={store}>
        <MainRoutes />
      </Provider>
    </DataProvider>
  );
}
export default App;
