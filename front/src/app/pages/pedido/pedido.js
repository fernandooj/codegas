// @flow weak

import React, { PureComponent } from "react";
 
import style from "./pedido.scss"
import { Table, Icon, Input, message } from 'antd'; 
import 'antd/dist/antd.css';
import axios from "axios";
import moment 			   from 'moment-timezone'
import {getPedidos}        from '../../redux/actions/pedidoActions' 
import {getVehiculos}      from '../../redux/actions/vehiculoActions' 
import { connect }         from "react-redux";

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
      fechaInicial : moment().format("YYYY,MM,DD"),               //// obtengo la fecha inicial que es el dia actual
      fechaFinal : moment().add(5, 'days').format("YYYY,MM,DD")   //// obtengo la fecha final, que es dentro de 5 dias
    }
  }
  componentWillMount(){
    this.props.getPedidos()
    this.props.getVehiculos()
  }
  renderFechas(){
      let {fechaInicial, fechaFinal} = this.state
      fechaInicial = new Date(fechaInicial);
      fechaFinal = new Date(fechaFinal);
      const dayInterval = 1000 * 60 * 60 * 24; // 1 day
      let fechas = getDates(fechaInicial, fechaFinal, dayInterval)
      fechas = JSON.stringify(fechas)
      fechas = JSON.parse(fechas)
 
      return fechas.map((e, key)=>{
        return (
          <div key={key} className={style.subContenedorFechas}>
            <p>{moment(e).format("MMMM DD")}</p>
          </div>
        )
      })
  }
  renderVehiculos(){
    
  }
  render() {
 
    return (
      <div>
        <section className={style.contenedorFechas}>
          {this.renderFechas()}
        </section>
      </div>
    );
  }
   

}
const mapState = state => {
	return {
        pedidos: state.pedido.pedidos,
        vehiculos:state.vehiculo.vehiculos
	};
};
  
const mapDispatch = dispatch => {
    return {
        getPedidos: () => {
            dispatch(getPedidos());
        },
        getVehiculos: () => {
            dispatch(getVehiculos());
        },
    };
};
  
Pedidos.defaultProps = {
    pedidos:[],
    vehiculos:[]
};

 
export default connect(mapState, mapDispatch)(Pedidos);
 
 