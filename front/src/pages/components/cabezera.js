import React, {useEffect, useState} from 'react'
import {LayoutCabezera1, Boton, Listado, CabezeraContenedor, Logo} from './style'
import PropTypes from "prop-types";
import { AiOutlineLogin, AiFillCaretDown, AiOutlineLogout }  from 'react-icons/ai';
import { GiBookshelf }  from 'react-icons/gi';
import { BsUpload, BsChatDots }  from 'react-icons/bs';
import { IoIosNotificationsOutline }  from 'react-icons/io';
import { Avatar, Menu, Row, Col, Dropdown } from 'antd';
import { FaBook }    from 'react-icons/fa';
import HamburgerMenu from 'react-hamburger-menu'
import axios         from 'axios'
import { Link }      from "@reach/router";
import { connect }   from "react-redux";
import { getPerfil } from "../../redux/actions/usuarioActions";
import CheeseburgerMenu from 'cheeseburger-menu'
   
const menu=(props)=>( 
    <Menu> 
        <Menu.Item> 
            <Link to="nuevo_libro" rel="subir libro" >
                Subir Libro
            </Link>
        </Menu.Item> 
        <Menu.Item>  
            <Link to="perfil" rel="perfil"  >
                Perfil 
            </Link> 
        </Menu.Item> 
        <Menu.Item>
            <Link to="notificacion/5" rel="mis libros"  >
                Mis Libros
            </Link>  
        </Menu.Item>  
        <Menu.Item>
            <Link to="notificacion" rel="notificaciones"  >
                Notificaciones
            </Link>  
        </Menu.Item>  
        <Menu.Item>
            <Link to="chat" rel="chat"  >
                Chat
            </Link> 
        </Menu.Item> 
        <Menu.Item>
            <a href="x/v1/user/logout" rel="Cerrar Sesion" >
                Cerrar sesión
            </a> 
        </Menu.Item>
    </Menu>
) 
const Cabezera = (props) =>{  
    let {nombre, avatar} = props.perfil
    console.log(props.perfil)
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    useEffect(() => {
        props.getPerfil() 
    }, [])  
    const logout = e => {
        
        axios.get("/user/logout")
        .then(e=>{
          window.location.href ="/"
        })
      };
    return(  
        <CabezeraContenedor>
            <CheeseburgerMenu isOpen={menuIsOpen} closeCallback={()=>setMenuIsOpen(false)} right={true}>
            <div className="my-menu-content">
                {
                    props.acceso 
                    &&<ul>
                        <Listado>
                            <GiBookshelf size={25} />
                            <Link to="/pedidos"     onClick={()=>setMenuIsOpen(false)}>
                                <Boton>
                                    Pedidos
                                </Boton> 
                            </Link>
                        </Listado>
                        <Listado>
                            <BsUpload size={25} />
                            <Link to="/pedidoVehiculo"  onClick={()=>setMenuIsOpen(false)}>
                                <Boton>
                                Fechas
                                </Boton>
                            </Link>
                        </Listado>
                        <Listado>
                            <Avatar src={avatar} />
                            <Link to="/informes"       onClick={()=>setMenuIsOpen(false)}>
                                <Boton>
                                    Informes
                                </Boton>
                            </Link>
                        </Listado>
                        <Listado>
                            <IoIosNotificationsOutline size={25} />
                            <Link to="notificacion" onClick={()=>setMenuIsOpen(false)}>
                                <Boton>
                                    Notificaciones
                                </Boton>
                            </Link>
                        </Listado>
                        <Listado>
                            <BsChatDots size={25} />
                            <Link to="chat"    onClick={()=>setMenuIsOpen(false)}>
                                <Boton>
                                    Chat
                                </Boton>
                            </Link>
                        </Listado>
                        <Listado>
                            <AiOutlineLogout size={25} />
                            <Link to="x/v1/user/logout" onClick={()=>setMenuIsOpen(false)}>
                                <Boton>
                                    Cerrar sesión
                                </Boton>
                            </Link>
                        </Listado>
                        {
                            props.perfil.tipo==="admin"
                            &&<Listado>
                                <FaBook size={25} />
                                <Link to="adminTitulo" onClick={()=>setMenuIsOpen(false)}>
                                    <Boton>
                                        Titulos
                                    </Boton> 
                                </Link>
                                <Link to="ventaTitulo" onClick={()=>setMenuIsOpen(false)}>
                                    <Boton>
                                        Ventas 
                                    </Boton> 
                                </Link>
                            </Listado>
                        }
                    </ul>
                     
                }
            </div> 
            </CheeseburgerMenu> 
            <Row align="middle">  
                <Col lg={7} md={7} sm={8} xs={8}>
                    {/* { 
                        props.perfil.acceso==="admin"
                        &&<div style={{float:"left", padding: "5px"}}>
                            <HamburgerMenu 
                                isOpen={menuIsOpen}
                                menuClicked={()=>setMenuIsOpen(true)}
                                width={26}
                                height={20} 
                                strokeWidth={3}
                                rotate={0}
                                color='black'
                                borderRadius={0} 
                                animationDuration={0.5}
                            />  
                        </div>
                    } */}
                    <Link to={props.perfil.acceso==="adminTanque" ?"/informes" :"/"}> 
                        <Logo src="https://appcodegas.com/public/uploads/logo.png" />
                    </Link>  
                </Col>  
                {
                    props.perfil.acceso  
                    &&<Col lg={17} sm={7} xs={9} style={{textAlign:"right"}}>   
                        <Menu mode="horizontal">  
                            {
                                (props.perfil.acceso==="admin" || props.perfil.acceso==="solucion" || props.perfil.acceso==="despacho" || props.perfil.acceso==="pedidos")
                                &&<Menu.Item key="pedidos">
                                    <Link to="/pedidos" rel="noopener noreferrer" >
                                        Pedidos 
                                    </Link>  
                                </Menu.Item> 
                            }
                            {
                                (props.perfil.acceso==="admin" || props.perfil.acceso==="solucion" || props.perfil.acceso==="despacho" || props.perfil.acceso==="pedidos")
                                &&<Menu.Item key="Fechas">
                                    <Link to="/pedidoVehiculo" rel="noopener noreferrer" >
                                        Fechas 
                                    </Link> 
                                </Menu.Item>
                            }
                            {
                                <Menu.Item key="libros"> 
                                    <Link to="/informes" rel="noopener noreferrer" >
                                        Informes
                                    </Link>   
                                </Menu.Item>
                            } 
                            {
                                props.perfil.acceso==="admin"
                                &&<Menu.Item key="usuarios">
                                    <Link to="/usuarios">
                                        Usuarios
                                    </Link>
                                </Menu.Item>
                            } 
                            {
                                props.perfil.acceso==="admin"
                                &&<Menu.Item key="Zonas">
                                    <Link to="/zonas">
                                        Zonas
                                    </Link> 
                                </Menu.Item>
                            }
                            {
                                (props.perfil.acceso==="admin" || props.perfil.acceso==="adminTanque" || props.perfil.acceso==="depTecnico")
                                &&<Menu.Item key="Tanques">
                                    <Link to="/tanques">
                                        Tanques 
                                    </Link>
                                </Menu.Item>
                            } 
                            {
                                (props.perfil.acceso==="admin" || props.perfil.acceso==="adminTanque" || props.perfil.acceso==="depTecnico")
                                &&<Menu.Item key="Revisiones">
                                    <Link to="/revisiones">
                                        Revisiones
                                    </Link>
                                </Menu.Item>
                            } 
                            {
                                <Menu.Item key="cerrar sesion">
                                   <a onClick={()=>logout()}>
                                       Cerrar sesión
                                    </a>
                                </Menu.Item>
                            } 
                        </Menu> 
                    </Col>
                } 
                <Col lg={props.statusPerfil==="SUCCESS" ?3 :1} md={5} sm={1} xs={1} style={{textAlign:"right"}}> 
                    {   
                        window.innerWidth<768
                        ?<HamburgerMenu
                            isOpen={menuIsOpen}
                            menuClicked={()=>setMenuIsOpen(true)}
                            width={32}
                            height={24}
                            strokeWidth={3}
                            rotate={0}
                            color='black'
                            borderRadius={0}
                            animationDuration={0.5}
                        />
                        :props.acceso                         
                        &&<> 
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            {nombre}  <AiFillCaretDown />
                            </a> 
                        </Dropdown>
                        <Avatar src={avatar} />
                        </>
                    }  
                </Col> 
            </Row>
        </CabezeraContenedor>
    )
}
Cabezera.defaultProps = {
    perfil: {}
  };
  
Cabezera.propTypes = {
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
  )(Cabezera);
  