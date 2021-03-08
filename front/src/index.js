import React from "react"
import ReactDom from "react-dom"
import axios        from 'axios' 
import { Provider } from "react-redux";
import configStore from "./redux/store"; //redux config
import {App} from "./app"
import WebFont from 'webfontloader';
import 'antd/dist/antd.css';
WebFont.load({
  google: {
    families: ['Roboto:300,400,700', 'sans-serif']
  }
});
const store = configStore();
export const URL = 'https://appcodegas.com/public/assets/img/';  
export const URL2 = "http://localhost:8181"
// export const URL2 = "https://appcodegas.com"
axios.defaults.baseURL = URL2+"/x/v1/";  
  
ReactDom.render( 
    <Provider store={store}> 
        <App />
    </Provider>
    , document.getElementById("root")
)