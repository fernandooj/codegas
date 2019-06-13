// @flow weak

import React from "react";
import ReactDOM from "react-dom";
import { Switch, BrowserRouter }from 'react-router-dom'; 
 
// import smoothScrollPolyfill from "smoothscroll-polyfill";
// import Root from "./Root";
import axios from "axios";
// import "animate.css";
// import "jquery";
// import "font-awesome/css/font-awesome.min.css"; // css is not managed by CSSModule
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
// import "./style/index.scss"; // import general styles, mixins etc...
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import configStore from "./redux/store"; //redux config
import MainRoutes from './routes/MainRoutes';
const store = configStore();
  
// smoothscroll polyfill
// smoothScrollPolyfill.polyfill();
// // force polyfill (even if browser partially implements it)
// window.__forceSmoothScrollPolyfill__ = true;

// const ELEMENT_TO_BOOTSTRAP = "root";
// const BootstrapedElement = document.getElementById(ELEMENT_TO_BOOTSTRAP);

 
 
export const URL = 'http://localhost:8181';
export const URL2 = 'http://localhost:8181'
axios.defaults.baseURL = URL2+"/x/v1/";

class App extends React.Component {
    render(){
        return(
          <Provider store={store}>
              <BrowserRouter>
               <Switch>
                <MainRoutes />
                </Switch>
                </BrowserRouter>
          </Provider> 
        );
    }
};

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
// renderApp(Root);

// if (module.hot) {
//   module.hot.accept("./Root", () => {
//     const RootComponent = require("./Root").default;
//     renderApp(RootComponent);
//   });
// }
