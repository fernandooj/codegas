// @flow weak

import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import style from "./style.scss"
import { Table, Icon, Input, notification } from 'antd'; 
import 'antd/dist/antd.css';
import axios from "axios";
import moment 			   from 'moment-timezone'
import {getPedidos, getVehiculosConPedidos}  from '../../redux/actions/pedidoActions' 
import { connect }               from "react-redux";

moment.locale('es');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///   FUNCION QUE DEVUELVE EL ARRAY ENTRE DOS FECHAS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getDates=(startDate, endDate, interval)=> {
  const duration = endDate - startDate;
  const steps = duration / interval;
  return Array.from({length: steps+1}, (v,i) => new Date(startDate.valueOf() + (interval * i)));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  COMPONENTE QUE VUELVE DRAGABLE LA LISTA
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let placeholder = document.createElement("li");
placeholder.className = "placeholder";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props};
  }
  dragStart(e) {
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.dragged);
  }
  dragEnd(e) {
    this.dragged.style.display = 'inline-block';
    this.dragged.parentNode.removeChild(placeholder);
    
    // update state
    var data = this.state.pedidos;
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id);
    if(from < to) to--;
    data.splice(to, 0, data.splice(from, 1)[0]);
    this.setState({pedidos: data});
    this.props.ordenPedidos(data)
  }
  dragOver(e) {
    e.preventDefault();
    this.dragged.style.display = "inline-block";
    if(e.target.className === 'placeholder') return;
    this.over = e.target;
    e.target.parentNode.insertBefore(placeholder, e.target);
  }
	render() {
         
    let nuevoPedidos = this.state.pedidos.sort((a, b)=>{
      return a.info[0].orden - b.info[0].orden;
    });
    console.log(nuevoPedidos)
    let listItems = nuevoPedidos.map((item, i) => {
    let {_id, entregado, forma, cantidadKl, cantidadPrecio, cliente, estado} = item.info[0]
     
      return (
        <li 
          style={entregado ?{backgroundColor:"#00218b"} :{backgroundColor:"#5cb85c"}}
          data-id={i}
          key={i}
          draggable='true'
          onDragEnd={this.dragEnd.bind(this)}
          onDragStart={this.dragStart.bind(this)}>
            {_id}<br/>
            {/* {.estado}<br/> */}
            {entregado ?"Entregado" :"En ruta"}<br/>
            {forma}: 
            {forma=="cantidad" ?cantidadKl+" Kl" :forma=="monto" ?" $"+cantidadPrecio :" "}<br/>
            {cliente}<br/>
        </li>
      )
     });
		return (
			<ul onDragOver={this.dragOver.bind(this)}>
        {listItems}
      </ul>
		)
	}
}


class Pedidos extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      // fechaInicial : moment().format("YYYY,MM,DD"),               //// obtengo la fecha inicial que es el dia actual
      // fechaFinal : moment().add(5, 'days').format("YYYY,MM,DD")   //// obtengo la fecha final, que es dentro de 5 dias
    }
  }
  componentWillMount(){
    let fechaInicial = this.props.match.params.ruta ?this.props.match.params.ruta : moment().format("YYYY,MM,DD")
    let fechaFinal   = moment(fechaInicial).add(5, 'days').format("YYYY,MM,DD")
    this.setState({fechaInicial, fechaSeleccionada:fechaInicial, fechaFinal})
  
    fechaInicial = fechaInicial.split(",")
    fechaInicial = fechaInicial.join("-")
    fechaInicial = moment(fechaInicial).valueOf()
    
    this.props.getPedidos()
    this.props.getVehiculosConPedidos(fechaInicial)
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
          <div style={moment(e).format("YYYY,MM,DD")==fechaSeleccionada ?{backgroundColor:"#057fee"} :null} className={style.subContenedorFechas} key={key} onClick={()=>this.redirect(e)}> 
            <p>{moment(e).format("MMM DD")}</p>
          </div>
        )
      })
  }
  redirect(e){
    window.location.href = `#/pedidoVehiculo/${moment(e).format("YYYY,MM,DD")}`;
    e = moment(e).format("YYYY-MM-DD")
    e = moment(e).valueOf()
    this.setState({fechaSeleccionada:moment(e).format("YYYY,MM,DD")})
    this.props.getVehiculosConPedidos(e)
	}
  renderVehiculos(){
    const {ordenPedidos} = this.state
    const {vehiculosPedido} = this.props
    return vehiculosPedido.map((e, key)=>{
      return(
        <div key={key}>
          <div className={style.columnaVehiculo}>
            {e._id._id}<br />
            {e.data[0].info[0].conductor}
          </div>
          <div className={style.filaPedido}>
            <List pedidos={e.data} ordenPedidos={(ordenPedidos)=>this.setState({ordenPedidos})} />	
          </div>
          <div className={style.btnGuardar} onClick={()=>this.guardarOrden(ordenPedidos ?ordenPedidos :e.data, e._id.idPlaca)}>
          <i className="fa fa-floppy-o" aria-hidden="true"></i>
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
    const {vehiculosPedido} = this.props
    return (
      <div>
        <section className={style.contenedorFechas}>
          <i className="fa fa-chevron-left" aria-hidden="true" onClick={()=>this.actualizarFechasTabla("anterior")}></i>
          {this.renderFechas()}
          <i className="fa fa-chevron-right" aria-hidden="true" onClick={()=>this.actualizarFechasTabla("siguiente")}></i>
        </section>
          {
            !vehiculosPedido
            ?<i className="fa fa-spinner" aria-hidden="true"></i>
            :<section className={style.contenedorVehiculosPedidos}>
              {this.renderVehiculos()}
            </section>
          }
      </div>
    );
  }
  guardarOrden(ordenPedidos, carroId){
    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'orden de Pedido editado',
        duration: 3,
        description:
          ``,
      });
    };
    console.log({ordenPedidos})
    axios.put("ped/pedido/editarOrden",{pedidos: ordenPedidos})
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

	return {
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
    };
};
  
Pedidos.defaultProps = {
    pedidos:[],
    vehiculosPedido:null
};

 
export default connect(mapState, mapDispatch)(Pedidos);
 
 