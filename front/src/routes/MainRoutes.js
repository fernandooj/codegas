// @flow weak

import React from "react"
import { Router }   from "@reach/router"

import Login          from "../pages/login/login";
import Pedido         from "../pages/pedido/pedido";
import Informe        from "../pages/informe/informe";
import Usuarios       from "../pages/usuarios/usuarios";
import Zonas          from "../pages/zonas/zonas";
import PedidoVehiculo from "../pages/pedidoVehiculo/pedidoVehiculo";
import Tanque         from "../pages/tanques/tanques"
import Revision       from "../pages/revision/revision"
import axios from "axios"
 
class MainRoutes extends React.Component {
  state={}
  componentWillMount(){
    axios.get(`user/perfil/`)
    .then(res => {
      console.log(res.data)
      this.setState({status:res.data.status, acceso:res.data.user.acceso})
    })
  }
  render(){
    const {status, acceso} = this.state
    return (
      <Router> 
        {
          !status
          ?<Login  path="/" />
          :(acceso==="adminTanque" || acceso==="depTecnico")
          ?<Informe path="/" /> 
          :<Pedido  path="/" /> 
        }
        <Login    path="/"  />
        <Pedido   path="/pedidos"  />
        <Informe  path="/informes" />
        <Usuarios path="/usuarios" />
        <Zonas    path="/zonas"    />
        <Tanque   path="/tanques" />
        <Revision path="/revisiones" />
        <PedidoVehiculo path="/pedidoVehiculo"  />
        <PedidoVehiculo path="/pedidoVehiculo/:ruta"  /> 
      </Router>
    );

  }
}

export default MainRoutes;
