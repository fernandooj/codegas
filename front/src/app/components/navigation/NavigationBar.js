// @flow weak

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Humburger from "./humburger/Humburger";
import { Link } from "react-router-dom";
import {
  getPerfil
} from "../../redux/actions/usuarioActions";
import { connect } from "react-redux";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  Popover,
  PopoverBody,
} from "reactstrap";
import socket from '../../socket.js'

import {URL} from "../../index"

class NavigationBar extends PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
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
    console.log(localStorage.getItem('userId'))
    socket.on(`badgeMensaje${localStorage.getItem('userId')}`, 	this.reciveMensanje.bind(this));
    socket.on(`badgeCuenta${localStorage.getItem('userId')}`, 	this.reciveMensanjeCuenta.bind(this));
  }
  reciveMensanje(messages) {
    this.setState({badgeSocketMessage:this.state.badgeSocketMessage+1, badgeMessage:true })
  }
  reciveMensanjeCuenta(messages) {
    console.log(messages)
    this.setState({badgeSocketCuenta:this.state.badgeSocketCuenta+1, badgeCuenta:true })
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  
  logout = e => {
    e.preventDefault();
    
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
    const { profile } = this.props;
    console.log(this.state.badgeSocketMessage)
    return (
      <Navbar light expand="md">
        {profile.status == "SUCCESS" ? <Humburger profile={profile} /> : null}
          <Link to="/"><img src={`${URL}logo_releo.png`} style={{width:"95px"}}  /></Link>
          
        {
          window.innerWidth<768
          ?profile.status == "SUCCESS"
          ?<section>
            <Link to="/nuevo_libro" >
              <img src={`${URL}nuevoLibro.png`} style={{width:"39px"}} id="Popover1"  onMouseEnter={()=>this.setState({popUp:true})} onMouseLeave={()=>this.setState({popUp:false})}  />
              </Link>
              <aside onClick={()=>this.redirecCuenta()}>
                    <img src={`${URL}campana.png`}  />
                    { 
                      this.state.badgeSocketCuenta>0  
                      ?<section>{this.state.badgeSocketCuenta+profile.user.badge}</section>
                      :profile.user.badge>0 && this.state.badgeCuenta ?<section>{profile.user.badge}</section> :null
                    }
                   
                  </aside>
                  <aside onClick={()=>this.redirecMessage()}>
                    <img src={`${URL}message.png`}  />
                    { 
                      this.state.badgeSocketMessage>0  && this.state.badgeMessage 
                      &&<section>{this.state.badgeSocketMessage}</section>
                       
                    }
                   
                  </aside>
          </section>
          :<Link to="/registrarse" >
            <img src={`${URL}nuevoLibro.png`} style={{width:"39px", top:"-9px"}}  id="Popover2"  onMouseEnter={()=>this.setState({popUp:true})} onMouseLeave={()=>this.setState({popUp:false})} />
          </Link>
          :null
        }
        
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          {profile.status == "SUCCESS" ? (
            <Nav className="ml-auto" navbar>
              <Link to="/nuevo_libro" >
                <img src={`${URL}nuevoLibro.png`}  id="Popover1"  onMouseEnter={()=>this.setState({popUp:true})} onMouseLeave={()=>this.setState({popUp:false})}  />
              </Link>
              <Popover
                placement="bottom"
                isOpen={this.state.popUp}
                target="Popover1"
              >
                <PopoverBody>Subir Libro</PopoverBody>
              </Popover>
              <NavItem>
                <Link to="/nuevo_libro">Subir Libro</Link>
              </NavItem>
              <NavItem>
                  <aside onClick={()=>this.redirecCuenta()}>
                    <img src={`${URL}campana.png`}  />
                    { 
                      this.state.badgeSocketCuenta>0  
                      ?<section>{this.state.badgeSocketCuenta+profile.user.badge}</section>
                      :profile.user.badge>0 && this.state.badgeCuenta ?<section>{profile.user.badge}</section> :null
                    }
                   
                  </aside>
                  <aside onClick={()=>this.redirecMessage()}>
                    <img src={`${URL}message.png`}  />
                    { 
                      this.state.badgeSocketMessage>0  && this.state.badgeMessage 
                      &&<section>{this.state.badgeSocketMessage}</section>
                       
                    }
                   
                  </aside>
              </NavItem>
              <NavItem>
                <Link to="/ver_perfil">
                  <div style={{ backgroundImage: `url(${profile.user.avatar})` }}></div>
                </Link>
                <Link to="/ver_perfil">
                  {" "}
                  <p>{profile.user.nombre}</p>
                </Link>
              </NavItem>
              <NavItem>
                <a href="" onClick={this.logout} style={{background:"none", top:10}}>
                  Salir
                </a>
              </NavItem>
            </Nav>
          ) : (
            <Nav className="ml-auto" navbar>
              <Link to="/registrarse" >
                 <img src={`${URL}nuevoLibro.png`} id="Popover2"  onMouseEnter={()=>this.setState({popUp:true})} onMouseLeave={()=>this.setState({popUp:false})} style={{top:"-9px"}}/>
              </Link>
               <Popover
                  placement="bottom"
                  isOpen={this.state.popUp}
                  target="Popover2"
                >
                <PopoverBody>Subir Libro</PopoverBody>
              </Popover>
              
              <NavItem>
                <Link to="/ingresar">Subir Libro</Link>
              </NavItem>
              <NavItem>
                <Link to="/ingresar">Ingresar</Link>
              </NavItem>
              <NavItem>
                <Link to="/registrarse" className="btn-registrarse">Registrarse</Link>
              </NavItem>
            </Nav>
          )}
        </Collapse>
      </Navbar>
    );
  }
}
NavigationBar.defaultProps = {
  profile: {}
};

NavigationBar.propTypes = {
  profile: PropTypes.object.isRequired
};

const mapState = state => {
  return {
    profile: state.usuario.profile
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
