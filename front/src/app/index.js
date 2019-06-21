// @flow weak

import React from "react";
import {render} from "react-dom";
import { Switch, BrowserRouter }from 'react-router-dom'; 
import { AppContainer } from "react-hot-loader";
import smoothScrollPolyfill from "smoothscroll-polyfill";
import Root from "./Root";
import axios from "axios";
import "animate.css";
import "jquery";
import "font-awesome/css/font-awesome.min.css"; // css is not managed by CSSModule
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./style/index.scss"; // import general styles, mixins etc...
import { Provider } from "react-redux";
import configStore from "./redux/store"; //redux config

const store = configStore();
 
if (window.location.hash && window.location.hash == '#_=_') {
  window.location.hash = '';
}
// smoothscroll polyfill
smoothScrollPolyfill.polyfill();
// force polyfill (even if browser partially implements it)
window.__forceSmoothScrollPolyfill__ = true;

const ELEMENT_TO_BOOTSTRAP = "root";
const BootstrapedElement = document.getElementById(ELEMENT_TO_BOOTSTRAP);

 
 
// export const URL = 'https://releo.co/public/assets/img/';
export const URL2 = window.location.origin
axios.defaults.baseURL = URL2+"/x/v1/";

const renderApp = RootComponent => {
  render(
    <Provider store={store}>
      <AppContainer warnings={false}>
        <BrowserRouter>
          <RootComponent />
        </BrowserRouter>
      </AppContainer>
    </Provider>,
    BootstrapedElement
  );
};
 
renderApp(Root);

if (module.hot) {
  module.hot.accept("./Root", () => {
    const RootComponent = require("./Root").default;
    renderApp(RootComponent);
  });
}
