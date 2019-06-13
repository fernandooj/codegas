// @flow weak
import React from 'react';
import { Link }       from 'react-router-dom';
import FontAwesome    from 'react-fontawesome';
import classnames     from 'classnames/bind';
import cx             from 'classnames';
import styles      from '../NavigationBar.scss'
import onClickOutside from "react-onclickoutside";


class Menu extends React.PureComponent{
  state={show:true}
  updateShow() {
    this.setState({show: !this.state.show});    
  }
  componentWillReceiveProps(nextProps){
    this.setState({show:nextProps.active})
  }
  render(){
    const {show} = this.state
    return( 
      <div className={show ?styles.subMenu :styles.subMenu1} onClick={this.updateShow.bind(this)}>
      {
        this.props.tipo=="admin"
        ?<div>
          <Link to='/cuenta' >Tu Cuenta</Link>
          <Link to='/libros/1'>Libros Publicados</Link>
          {/* <Link to='/cuenta/4'>Libros que Deseas</Link> */}
          <Link to='/libros/2'>Libros que Buscan</Link>
          <Link to='/conversacion'>Chat</Link>
          <Link to='/resena'>Reseñas</Link>
          <Link to='/categoria'>Categorias</Link>
          <Link to='/titulo'>Titulos</Link>
          <Link to='/ventas'>Ventas</Link>
          <Link to='/usuario'>Usuarios</Link>
          <Link to='/graficos'>graficos</Link>
        </div>
        :<div>
          <Link to='/cuenta' >Tu Cuenta</Link>
          <Link to='/cuenta/5'>Libros Publicados</Link>
          <Link to='/cuenta/4'>Libros que Deseas</Link>
          <Link to='/libros/2'>Libros que Buscan</Link>
          <Link to='/conversacion'>Chat</Link>
        </div>
      }   
      </div>
    )
  }
}

class Humburger extends React.PureComponent{
  state={show:true}
  handleClickOutside = () => {
    this.setState({show: true}); 
  }

  updateShow() {
    this.setState({show: !this.state.show});    
  }
  render(){
    const {show} = this.state
    if(this.props.profile.user){
      return (
        <div>
        <FontAwesome name='bars' onClick={this.updateShow.bind(this)} className={styles.hamburger} />
          <Menu active={this.state.show} tipo={this.props.profile.user.tipo} /> 
        </div>
      );
    }else{
      return null
    }
  }
};

export default onClickOutside(Humburger);
