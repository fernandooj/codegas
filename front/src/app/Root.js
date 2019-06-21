// @flow weak

// #region imports
import React, { Component } from "react";
import { Router, Switch } from "react-router-dom";
// #region import createHistory from hashHistory or BrowserHistory:
import createHistory from "history/createHashHistory";
 
import App from "./containers/app/App";
 
 
import ErrorBoundary from "./components/error_boundary/ErrorBoundary";
 

// #endregion

// #region flow types
type Props = any;
type State = any;
// #endregion

const history = createHistory();

class Root extends Component {

  render() {
      return (
        <Router history={history}>
          
            <Switch>
              <App />
              {/* logout: just redirects to login (App will take care of removing the token) */}
          
            </Switch>
           
        </Router>
      );
  }
}

export default Root;
