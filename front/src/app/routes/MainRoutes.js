// @flow weak

import React from "react";
import { Route, Switch } from "react-router";

 
import Home        from "../pages/home/home";
import login       from "../pages/login/login";
import pedido      from "../pages/pedido/pedido";
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
        <Route exact path="/" component={status ?Home :login} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/pedidos" component={pedido} />
	
      </Switch>
    );
  }
};

const mapState = state => {
	console.log("state")
	console.log(state.usuario.perfil)
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
