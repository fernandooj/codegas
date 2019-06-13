// @flow weak

import React, { PureComponent } from "react";
import "./home.css"
// import style from "./home.scss"
import { Table, Icon, Input, message } from 'antd'; 
import 'antd/dist/antd.css';
import axios from "axios";
import moment 			   from 'moment-timezone'
import {getPedidos}        from '../../redux/actions/pedidoActions' 
import {getVehiculos}      from '../../redux/actions/vehiculoActions' 
import { connect }         from "react-redux";
   const columns = [
  {
    title: 'Cliente',
    dataIndex: 'usuarioId.nombre',
    onFilter: (value, record) => record.usuarioId.nombre.indexOf(value) === 0,
    sorter: (a, b) => a.usuarioId.nombre.length - b.usuarioId.nombre.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Cedula',
    dataIndex: 'usuarioId.cedula',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Fecha creación',
    dataIndex: 'creado',
    render:fecha=>(
      moment(JSON.parse(fecha)).format("YYYY-MM-DD h:mm a")
    ),
    onFilter: (value, record) => record.creado.indexOf(value) === 0,
    sorter: (a, b) => a.creado.length - b.creado.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Fecha solicitud',
    dataIndex: 'fechaEntrega',
    render:fecha=>(
      fecha ?moment(JSON.parse(fecha)).format("YYYY-MM-DD h:mm a") :"Sin Asignar"
    ),
  },
  {
    title: 'Tipo de solicitud',
    dataIndex: 'forma',
    filters: [
      {
        text: 'LLeno',
        value: 'lleno',
      },
      {
        text: 'Monto',
        value: 'monto',
      },
      {
        text: 'Cantidad',
        value: 'cantidad',
      }
    ],
    onFilter: (value, record) => record.forma.indexOf(value) === 0,
    sorter: (a, b) => a.forma.length - b.forma.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Cantidad',
    dataIndex: 'cantidad',
    onFilter: (value, record) => record.cantidad.indexOf(value) === 0,
    sorter: (a, b) => a.cantidad.length - b.cantidad.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Vehiculo Asignado',
    dataIndex: 'carroId.placa',
    onFilter: (value, record) => record.carroId.placa.indexOf(value) === 0,
    sorter: (a, b) => a.carroId.placa.length - b.carroId.placa.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Estado',
    dataIndex: 'estado',
    onFilter: (value, record) => record.estado.indexOf(value) === 0,
    sorter: (a, b) => a.estado.length - b.estado.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Entregado',
    dataIndex: 'entregado',
    render:entregado=>(
     entregado ?"Si" :"No"
    ),
    onFilter: (value, record) => record.entregado.indexOf(value) === 0,
    sorter: (a, b) => a.entregado.length - b.entregado.length,
    sortDirections: ['descend', 'ascend'],
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

class Home extends PureComponent {
  constructor(props){
    super(props)
    this.state={
       
    }
  }
  componentWillMount(){
    this.props.getPedidos()
    this.props.getVehiculos()
  }
  renderTable(){
    const {pedidos} = this.props
    console.log(pedidos)
    return (<Table columns={columns} dataSource={pedidos} onChange={()=>this.onChange()} />)
  }
  render() {
    return (
      <div>
        fer
         {this.renderTable()}
      </div>
    );
  }
  onChange(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter);
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
  
Home.defaultProps = {
    pedidos:[],
    vehiculos:[]
};

 
export default connect(mapState, mapDispatch)(Home);
 
 