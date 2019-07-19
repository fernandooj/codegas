// @flow weak

import React from "react";
import { Route, Switch } from "react-router";

import login          from "../pages/login/login";
import pedido         from "../pages/pedido/pedido";
import informe        from "../pages/informe/informe";
import pedidoVehiculo from "../pages/pedidoVehiculo/pedidoVehiculo";
import axios from "axios"
 
class MainRoutes extends React.Component {
  state={}
  componentWillMount(){
    axios.get(`user/perfil/`)
    .then(res => {
      console.log(res.data.status)
      this.setState({status:res.data.status})
    })
  }
  render(){
    const {status} = this.state
    return (
      <Switch>
        <Route exact path="/"   component={status ?pedido :login} />
        <Route path="/pedidos"  component={pedido} />
        <Route path="/informes" component={informe} />
        <Route path="/pedidoVehiculo/:ruta?" component={pedidoVehiculo} />
        
    
        {/* private views: need user to be authenticated */}
   
      </Switch>
    );

  }
}

export default MainRoutes;
