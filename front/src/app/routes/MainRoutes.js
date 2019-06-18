// @flow weak

import React from "react";
import { Route, Switch } from "react-router";

 
import login          from "../pages/login/login";
import pedido           from "../pages/pedido/pedido";
import pedidoVehiculo from "../pages/pedidoVehiculo/pedidoVehiculo";
import {connect} from 'react-redux' 
import { getPerfil } from "../redux/actions/usuarioActions"; 
 
class MainRoutes extends React.Component {
  componentWillMount(){
    this.props.getPerfil()
  }
  render(){
    const {status} = this.props
    return (
      <Switch>
        <Route exact path="/" component={status ?pedido :login} />
        <Route path="/pedidos" component={pedido} />
        <Route path="/pedidoVehiculo/:ruta?" component={pedidoVehiculo} />
      </Switch>
    );
  }
};

const mapState = state => {
	return {
    status:state.usuario.perfil.status,
 
	};
};
  
const mapDispatch = dispatch => {
	return {
		getPerfil: () => {
			dispatch(getPerfil());
		},
	};
};
	   
export default connect(mapState, mapDispatch)(MainRoutes) 
