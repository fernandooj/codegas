// @flow weak

import React, {
  Component
}                         from 'react';
import { withRouter }     from 'react-router';
import {
  NavigationBar,
  BackToTop
}                         from '../../components';
import navigationModel    from '../../config/navigation.json';
import MainRoutes         from '../../routes/MainRoutes';
import { Link } from "react-router-dom";
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
        <footer>
          <ul>
            <li>
              <Link to="/nosotros">
                Que es Releo
              </Link>
            </li>
            <li>
              <Link to="/politicas">
                Politicas de Privacidad
              </Link>
            </li>
            <li>
              <Link to="/contacto">
                Contáctanos
              </Link>
            </li>
          </ul>
          <ul>
            <li><a href="https://www.instagram.com/releo_books/"     target="blank"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
            <li><a href="https://www.facebook.com/releo.co/"         target="blank"><i className="fa fa-facebook-official" aria-hidden="true"></i></a></li>
            <li><a href="https://twitter.com/releo_books"            target="blank"><i className="fa fa-twitter-square" aria-hidden="true"></i></a></li>
            <li><a href="https://www.youtube.com/channel/UCLwODOB91VrdvbOkGHnyYCg" target="blank"><i className="fa fa-youtube" aria-hidden="true"></i></a></li>
          </ul>
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
