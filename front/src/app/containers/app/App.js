// @flow weak

import React, {
  Component
}                         from 'react';
import { withRouter }     from 'react-router';
import {
  NavigationBar,
  BackToTop
}                       from '../../components';
import navigationModel  from '../../config/navigation.json';
import MainRoutes       from '../../routes/MainRoutes';
import style            from "./app.scss";
import axios from "axios"; 

class App extends Component {
  state = { navModel: navigationModel };
   
  render() {
    const { navModel } = this.state;
    return (
      <div id="appContainer">
        <NavigationBar
          brand={navModel.brand}
          navModel={navModel}
          history={this.props.history}
          handleLeftNavItemClick={this.handleLeftNavItemClick}
          handleRightNavItemClick={this.handleRightNavItemClick}
        />
        <div className="container-fluid">
          <MainRoutes />
        </div>
        <footer className={style.footer}>
          <p>Todos los derechos reservados | Codegas colombia</p>
        </footer>
        <BackToTop
          minScrollY={40}
          scrollTo={'appContainer'}
        />
      </div>
    );
  }

  /* eslint-disable no-unused-vars*/
  handleLeftNavItemClick = (event, viewName) => {
    // something to do here?
  }

  handleRightNavItemClick = (event, viewName) => {
    // something to do here?
  }
  /* eslint-enable no-unused-vars*/
}

export default withRouter(App);
