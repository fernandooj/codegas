// @flow weak

import React from "react";
import { Route, Switch } from "react-router";

 
import Home        from "../pages/home/home";
import login       from "../pages/login/login";
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
  
      </Switch>
    );
  }
};

const mapState = state => {
	// let mensajes = state.conversacion.mensaje[0].mensaje.reverse()
	// let usuario =  state.conversacion.mensaje[0].usuario
	// let tokenPhoneFiltro = mensajes.filter(e=>{if(e.username==usuario) return e})
	// let tokenPhone = tokenPhoneFiltro[0] ?tokenPhoneFiltro[0].tokenPhone :""
	console.log("state")
	console.table(state.usuario.perfil)
	return {
    // status:state.usuario.perfil.status,
    // perfil:state.status.perfil.perfil
		// conversaciones:state.mensaje.conversaciones,
		// usuario,
		// tokenPhone
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
