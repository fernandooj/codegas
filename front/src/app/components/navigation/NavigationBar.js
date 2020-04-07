// @flow weak

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getPerfil } from "../../redux/actions/usuarioActions";
import { connect } from "react-redux";
 
import style from "./NavigationBar.scss"
import socket from '../../socket.js'
import axios from "axios"

class NavigationBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      badgeMessage:true,
      badgeCuenta:true,
      badgeSocketMessage:0,
      badgeSocketCuenta:0
    };
  }
  async componentWillMount() {
    this.props.getPerfil();
    // console.log(localStorage.getItem('userId'))
    socket.on(`badgeMensaje${localStorage.getItem('userId')}`, 	this.reciveMensanje.bind(this));
    socket.on(`badgeCuenta${localStorage.getItem('userId')}`, 	this.reciveMensanjeCuenta.bind(this));
  }
  reciveMensanje(messages) {
    this.setState({badgeSocketMessage:this.state.badgeSocketMessage+1, badgeMessage:true })
  }
  reciveMensanjeCuenta(messages) {
    
    this.setState({badgeSocketCuenta:this.state.badgeSocketCuenta+1, badgeCuenta:true })
  }
   
  logout = e => {
    e.preventDefault();
    axios.get("/user/logout")
    .then(e=>{
      window.location.href ="/"
    })
  };
  ///////////////////////////////////       redirecciono al usuario a la cuenta, pero primero elimino el badge
  //////////////////////////////////////////////////////////////////////
  redirecCuenta(){
    this.setState({badgeCuenta:false, badgeSocketCuenta:0})
    this.props.history.push(`/cuenta`)
  }
  redirecMessage(){
    this.setState({badgeMessage:false, badgeSocketMessage:0})
    this.props.history.push(`/conversacion`)
  } 

  render() {
    const { perfil, status } = this.props;
    const { badgeSocketMessage, badgeSocketCuenta, badgeCuenta, badgeMessage } = this.state;
   
    return (
      <nav className={style.nav}>
        
          <Link to="/"><img src="https://codegascolombia.com/wp-content/uploads/2016/09/logo-codegas.png" className={style.logo} /></Link>
        {
          status
          &&<ul>
              {/* <li onClick={()=>this.redirecCuenta()}>
                <img src={`${URL}campana.png`}  />
                { 
                  badgeSocketCuenta>0  
                  ?<section>{badgeSocketCuenta+perfil.badge}</section>
                  :perfil.badge>0 && badgeCuenta ?<section>{perfil.badge}</section> :null
                }
              </li>
              <li onClick={()=>this.redirecMessage()}>
                <img src={`${URL}message.png`}  />
                { 
                  badgeSocketMessage>0  && badgeMessage 
                  &&<section>{badgeSocketMessage}</section>
                }
              </li> */}
              
              <li>
                <Link to="/pedidos">
                  Pedidos
                </Link>
              </li>
              <li>
                <Link to="/pedidoVehiculo">
                  Fechas
                </Link>
              </li>
              {
                perfil.acceso=="admin"
                && <li>
                  <Link to="/informes">
                    Informes
                  </Link>
                </li>
              }
              {
                perfil.acceso=="admin"
                &&<li>
                  <Link to="/usuarios">
                    Usuarios
                  </Link>
                </li>
              }
              {
                perfil.acceso=="admin"
                &&<li>
                  <Link to="/zonas">
                    Zonas
                  </Link>
                </li>
              }
             
              <li>
                <Link to="/ver_perfil" style={{background:"none"}}>
                  <img src={perfil.avatar} />
                </Link>
              </li>
              <li>
                <Link to="/ver_perfil">
                  {perfil.nombre} 
                </Link>
              </li>
              <li>
                <a  onClick={this.logout}>
                  Salir
                </a>
              </li>
            </ul>
        }
      
        
          
               
              {/* <NavItem>
                  <li onClick={()=>this.redirecCuenta()}>
                    <img src={`${URL}campana.png`}  />  
                    { 
                      badgeSocketCuenta>0  
                      ?<section>{badgeSocketCuenta+perfil.badge}</section>
                      :perfil.badge>0 && badgeCuenta ?<section>{perfil.badge}</section> :null
                    }
                   
                  </li>
                  <li onClick={()=>this.redirecMessage()}>
                    <img src={`${URL}message.png`}  />
                    { 
                      badgeSocketMessage>0  && badgeMessage 
                      &&<section>{badgeSocketMessage}</section>
                    }
                  </li>
              </NavItem> */}
              {/* <ul>
                <li>
                  <Link to="/ver_perfil">
                    <div style={{ backgroundImage: `url(${perfil.avatar})` }}></div>
                  </Link>
                </li>
                <li>
                  <Link to="/ver_perfil">
                    {" "}
                    <p>{perfil.nombre}</p>
                  </Link>
                </li>
              </ul>
              <ul>
                <li>
                  <a href="" onClick={this.logout} style={{background:"none", top:10}}>
                    Salir
                  </a>
                </li>
              </ul> */}
             
          
        
      </nav>
    );
  }
}
NavigationBar.defaultProps = {
  perfil: {}
};

NavigationBar.propTypes = {
  perfil: PropTypes.object.isRequired
};

const mapState = state => {
  return {
    status:state.usuario.perfil.status,
    perfil:state.usuario.perfil.user,
  };
};

const mapDispatch = dispatch => {
  return {
    getPerfil: () => {
      dispatch(getPerfil());
    }
  };
};

export default connect(
  mapState,
  mapDispatch
)(NavigationBar);
