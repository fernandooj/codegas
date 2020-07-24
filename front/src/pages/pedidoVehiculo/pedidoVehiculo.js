// @flow weak

import React, { PureComponent } from "react";
 
 
import { Spin, Popover, notification } from 'antd'; 
import {
  LoadingOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import axios from "axios";
import { connect }     from "react-redux";
import moment 			   from 'moment-timezone'
import SocketIOClient      from 'socket.io-client';
import List from "./scrollPedidos" 
import {getPedidos, getVehiculosConPedidos, getZonasPedidos}  from '../../redux/actions/pedidoActions' 
moment.locale('es');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///   FUNCION QUE DEVUELVE EL ARRAY ENTRE DOS FECHAS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getDates=(startDate, endDate, interval)=> {
  const duration = endDate - startDate;
  const steps = duration / interval;
  return Array.from({length: steps+1}, (v,i) => new Date(startDate.valueOf() + (interval * i)));
}

class Pedidos extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      vehiculosPedido:null,
      zonaPedidos:[],
      zonaPedidosSolicitud:[],
    }
  }
  componentWillMount(){
    let fechaInicial = this.props.match.params.ruta ?this.props.match.params.ruta : moment().format("YYYY,MM,DD")
    let fechaFinal   = moment(fechaInicial).add(5, 'days').format("YYYY,MM,DD")
    this.setState({fechaInicial, fechaSeleccionada:fechaInicial, fechaFinal})
  
    fechaInicial = fechaInicial.split(",")
    fechaInicial = fechaInicial.join("-")
    
    this.socket = SocketIOClient(window.location.origin);
    this.socket.on(`actualizaPedidos`, this.reciveMensanje.bind(this, fechaInicial));
    
    this.props.getPedidos()
    this.props.getVehiculosConPedidos(fechaInicial)
    this.props.getZonasPedidos(fechaInicial)
    axios.get(`zon/zona/pedidoSolicitud/${fechaInicial}`)
    .then(res => {
        console.log(res.data)
        this.setState({zonaPedidosSolicitud:res.data.zona})
    })

  }
  reciveMensanje(fechaInicial) {
    console.log({fechaInicial})
    this.props.getVehiculosConPedidos(fechaInicial)
  }
  componentWillReceiveProps(props){
    this.setState({pedidos:props.pedidos, pedidosFiltro:props.pedidos, zonaPedidos:props.zonaPedidos, vehiculosPedido:props.vehiculosPedido})   
  }
  renderFechas(){
      let {fechaInicial, fechaFinal, fechaSeleccionada} = this.state
      fechaInicial = new Date(fechaInicial);
      fechaFinal = new Date(fechaFinal);
      const dayInterval = 1000 * 60 * 60 * 24; // 1 day
      let fechas = getDates(fechaInicial, fechaFinal, dayInterval)
      fechas = JSON.stringify(fechas)
      fechas = JSON.parse(fechas)
 
      return fechas.map((e, key)=>{
        return (
          <div style={moment(e).format("YYYY,MM,DD")==fechaSeleccionada ?{backgroundColor:"#00218b", color:"white"} :null} key={key} onClick={()=>this.redirect(e)}> 
            <p>{moment(e).format("MMM DD")}</p>
          </div>
        )
      })
  }
  redirect(e){
    window.location.href = `#/pedidoVehiculo/${moment(e).format("YYYY,MM,DD")}`;
    e = moment(e).format("YYYY-MM-DD")
    // e = moment(e).valueOf()
    this.props.getZonasPedidos(e)
    axios.get(`zon/zona/pedidoSolicitud/${e}`)
    .then(res => {
        console.log(res.data)
        this.setState({zonaPedidosSolicitud:res.data.zona})
    })

    this.setState({vehiculosPedidos:null, fechaSeleccionada:moment(e).format("YYYY,MM,DD")})
    setTimeout(()=>{ 
      this.props.getVehiculosConPedidos(e)
    }, 1000);
    
	}
  renderZonas(){
    return this.state.zonaPedidos.map((e, key)=>{
      return(
          <div key={key}
            // className={style.btnZona}
              style={
                
                  (e.total>3 && e.total<=5) ?{backgroundColor:"#F59F24"}
                  :e.total>5 ?{backgroundColor:"#F55024"}
                  :{backgroundColor:"#42DF18"}
              }
          >
              <p>{e._id}</p>
              <p>{e.total}</p>
          </div>
      )
    })
  }
  renderZonasSolicitud(){
    return this.state.zonaPedidosSolicitud.map((e, key)=>{
      return(
          <div key={key}
            // className={style.btnZona}
              style={
                  (e.total>3 && e.total<=5) ?{backgroundColor:"#F59F24"}
                  :e.total>5 ?{backgroundColor:"#F55024"}
                  :{backgroundColor:"#42DF18"}
              }
          >
              <p>{e._id}</p>
              <p>{e.total}</p>
          </div>
      )
    })
  }

  renderVehiculos(){
    const {ordenPedidos, vehiculosPedido} = this.state
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return vehiculosPedido.map((e, key)=>{
      return(
        <div key={key}>
          <div 
            // className={style.columnaVehiculo}
          >
            {e._id._id}<br />
            {e.data[0].info[0].conductor}
          </div>
          <div 
            //className={style.filaPedido}
          >
            {e.data.length>0 ?<List pedidos={e.data} ordenPedidos={(ordenPedidos)=>this.setState({ordenPedidos})} /> :<Spin indicator={antIcon} size="large"/>	}
          </div>
          <div 
            //className={style.btnGuardar} 
          onClick={()=>this.guardarOrden(ordenPedidos ?ordenPedidos :e.data, e._id.idPlaca, e.data[0].info[0].conductorId)}>
          {/* <i className="fa fa-floppy-o" aria-hidden="true"></i> */}
          </div>
        </div>
      )
    })
  }
  actualizarFechasTabla(tipo){
    let {fechaInicial, fechaFinal} = this.state
    if(tipo=="siguiente"){
      fechaInicial = moment(fechaInicial).add(5, 'days').format("YYYY,MM,DD") 
      fechaFinal = moment(fechaFinal).add(5, 'days').format("YYYY,MM,DD") 
      this.setState({fechaInicial})
      this.setState({fechaFinal})
    }else{
      fechaInicial = moment(fechaInicial).subtract(5, 'days').format("YYYY,MM,DD") 
      fechaFinal = moment(fechaFinal).subtract(5, 'days').format("YYYY,MM,DD") 
      this.setState({fechaInicial})
      this.setState({fechaFinal})
    }
  }
  render() {
    const {vehiculosPedido, zonaPedidos, zonaPedidosSolicitud} = this.state
    const antIcon = <LoadingOutlined type="loading" style={{ fontSize: 24 }} spin />;
    console.log(vehiculosPedido)
    return (
      <div>
        <section >
          {/* <i className="fa fa-chevron-left" aria-hidden="true" onClick={()=>this.actualizarFechasTabla("anterior")}></i> */}
          {this.renderFechas()}
          {/* <i className="fa fa-chevron-right" aria-hidden="true" onClick={()=>this.actualizarFechasTabla("siguiente")}></i> */}
        </section>
        <section>
          <h4>Total Zonas fecha entrega</h4>
          {
            zonaPedidos.length==0
            ?<div>no hay fechas de entrega encontradas</div>
            :this.renderZonas()
          }
        </section>
        <section>
          <h4>Total Zonas fecha solicitud</h4>
          {
            zonaPedidosSolicitud.length==0
            ?<div>no hay fechas de solicitud encontradas</div>
            :this.renderZonasSolicitud()
          }
        </section>
          {
            !vehiculosPedido
            ?<section >
              <Spin indicator={antIcon} size="large"/>
            </section>
            :<section>
              {
                vehiculosPedido.length==0
                ?<p>no hemos encontrado pedidos asignados</p> 	
                :this.renderVehiculos()
              }
            </section>
          }
      </div>
    );
  }
  guardarOrden(ordenPedidos, carroId, conductorId){
    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'orden de Pedido editado',
        duration: 3,
        description:
          ``,
      });
    };
    console.log({ordenPedidos})
    axios.put("ped/pedido/editarOrden",{pedidos: ordenPedidos, conductorId})
    .then(e=>{
      console.log(e.data)
      e.data.status ?openNotificationWithIcon('success') :alert("Tenemos un problema intenta nuevamente")
    })
    .catch(res=>{
      console.log(res.data)
    })
  }
}
const mapState = state => {
  console.log(state)
	return {
    zonaPedidos:state.pedido.zonaPedidos,
    pedidos: state.pedido.pedidos,
    vehiculosPedido:state.pedido.vehiculosPedidos
	};
};
  
const mapDispatch = dispatch => {
    return {
        getPedidos: () => {
            dispatch(getPedidos());
        },
        getVehiculosConPedidos: (idPedido) => {
            dispatch(getVehiculosConPedidos(idPedido));
        },
        getZonasPedidos: (fechaEntrega) => {
            dispatch(getZonasPedidos(fechaEntrega));
        },
    };
};
  
Pedidos.defaultProps = {
    pedidos:[],
    vehiculosPedido:null
};

 
export default connect(mapState, mapDispatch)(Pedidos);
 
 