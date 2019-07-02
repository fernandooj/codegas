// @flow weak

import React, { PureComponent } from "react";
 
import style from "./style.scss"
import { Table, Modal, Button, Avatar, notification, DatePicker } from 'antd'; 
import 'antd/dist/antd.css';
import locale from 'antd/lib/date-picker/locale/es_ES';
import axios from "axios";
import moment 			   from 'moment-timezone'
import {getPedidos}        from '../../redux/actions/pedidoActions' 
import {getVehiculos}      from '../../redux/actions/vehiculoActions' 
import { connect }         from "react-redux";
const confirm = Modal.confirm;
 

class Home extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      modal:false,
      modalFecha:false,
      loading: false,
    }
  }
  componentWillMount(){
    this.props.getPedidos()
    this.props.getVehiculos()
  }
  componentWillReceiveProps(props){
    this.setState({pedidos:props.pedidos, pedidosFiltro:props.pedidos})
  }
  renderBotones(){
    return(
      <div>
         <Button style={{backgroundColor:"#d9534f"}} onClick={()=>this.actualizarTabla("innactivo")}>Innactivo</Button>
         <Button style={{backgroundColor:"#5bc0de"}} onClick={()=>this.actualizarTabla("espera")}>Espera</Button>
         <Button style={{backgroundColor:"#f0ad4e"}} onClick={()=>this.actualizarTabla2("activo", false)}>Activo</Button>
         <Button style={{backgroundColor:"#5cb85c"}} onClick={()=>this.actualizarTabla2("activo", true)}>Asignado</Button>
         <Button style={{backgroundColor:"#00218b"}} onClick={()=>this.actualizarTabla3("activo")}>Entregado</Button>
         <Button style={{color:"#000000"}}           onClick={()=>this.actualizarTabla("noentregado")}>No Entregado</Button>
         <Button style={{backgroundColor:"#000000", color:"#ffffff"}} onClick={()=>this.setState({pedidos:this.state.pedidosFiltro})}>Todos</Button>
      </div>
    )
  }
  actualizarTabla(filtro){
    let {pedidos, pedidosFiltro} = this.state
    pedidos = pedidosFiltro.filter(e=>{
      return e.estado==filtro
    })
    this.setState({pedidos})
  }
  actualizarTabla2(filtro, filtro2){
    let {pedidos, pedidosFiltro} = this.state
    if(filtro2){
      pedidos = pedidosFiltro.filter(e=>{
        return e.estado==filtro &&e.carroId
      })
    }else{
      pedidos = pedidosFiltro.filter(e=>{
        return e.estado==filtro &&!e.carroId
      })
    }
    this.setState({pedidos})
  }
  actualizarTabla3(filtro, filtro2){
    let {pedidos, pedidosFiltro} = this.state
    pedidos = pedidosFiltro.filter(e=>{
      return e.estado==filtro &&e.entregado
    })
    this.setState({pedidos})
  }
  renderTable(){
    const columns = [
      {
        title: 'Cliente',
        dataIndex: 'usuarioId.codt',
        // onFilter: (value, record) => record.usuarioId.nombre.indexOf(value) === 0,
        // sorter: (a, b) => a.usuarioId.nombre.length - b.usuarioId.nombre.length,
        // sortDirections: ['descend'],
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
          fecha
        ),
        onFilter: (value, record) => record.creado.indexOf(value) === 0,
        sorter: (a, b) => a.creado.length - b.creado.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Fecha entrega',
        dataIndex: 'fechaEntrega',
        render:(fecha, e)=>(
          <Button type="link" className={style.link} 
            onClick={()=>
            {
              e.estado=="espera" || e.estado=="innactivo" 
              ?alert("No puedes editar aun el pedido")
              :this.setState({modalFecha:true, placaPedido:e.carroId ?e.carroId.placa :null, imagenPedido:e.imagen, fechaEntrega:e.fechaEntrega, id:e._id, estado:e.estado, nombre:e.usuarioId.nombre, email:e.usuarioId.email, tokenPhone:e.usuarioId.tokenPhone,  cedula:e.usuarioId.cedula, forma:e.forma, cantidad:e.cantidad, entregado:e.entregado, factura:e.factura, kilos:e.kilos, valor_unitario:e.valor_unitario })}
            }
            >
           {fecha ?fecha :"Sin Asignar"}
          </Button>
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
        dataIndex: 'cantidadKl',
        render:(cantidadKl, e)=>(
          // console.log(e)
         <p>{e.forma=="monto" ?e.cantidadPrecio :e.forma=="cantidad" &&e.cantidadKl}</p>
        ),
        onFilter: (value, record) => record.cantidad.indexOf(value) === 0,
        sorter: (a, b) => a.cantidad.length - b.cantidad.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Vehiculo Asignado',
        dataIndex: 'carroId.placa',
        render:(carro, e)=>(
          <Button type="link" className={style.link} 
            onClick={()=>
            {
              e.estado=="espera" || e.estado=="innactivo" 
              ?alert("no puedes editar aun el pedido")
              :this.setState({modal:true, placaPedido:e.carroId ?e.carroId.placa :null, imagenPedido:e.imagen, fechaEntrega:e.fechaEntrega, id:e._id, estado:e.estado, nombre:e.usuarioId.nombre, email:e.usuarioId.email, tokenPhone:e.usuarioId.tokenPhone,  cedula:e.usuarioId.cedula, forma:e.forma, cantidad:e.cantidad, entregado:e.entregado, factura:e.factura, kilos:e.kilos, valor_unitario:e.valor_unitario })}
            }
            >
            {carro ?carro :"Sin asignar"}
          </Button>
        ),
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
    const {pedidos} = this.state
    return (<Table columns={columns} dataSource={pedidos} onChange={()=>this.onChange()} />)
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////            RENDER MODAL VEHICULO
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderModalVehiculo(){
    const {modal, idVehiculo, loading} = this.state
  
    return(
      <Modal
          title="Asignar Vehiculo"
          visible={modal}
          onOk={this.handleOk}
          onCancel={()=>this.setState({modal:false})}
          footer={[
            <Button key="back" onCancel={()=>this.setState({modal:false})}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={()=>this.asignarConductor()}>
              Asignar
            </Button>,
          ]}
        >
        {
          this.props.vehiculos.map(e=>{
              return <div
                      key={e._id}
                      className={style.contenedorConductor}
                      style={idVehiculo == e._id ?{backgroundColor:"#5cb85c"} :null}
                      onClick={()=>this.setState({idVehiculo:e._id, placa:e.placa})}
                  >
                  <div>
                    <p className={style.conductor}>{e.placa}</p>       
                  </div>
                  <div>
                    <p className={style.conductor}>{e.conductor ? e.conductor.nombre :""}</p>       
                  </div>
                  {
                    e.conductor
                    ?<div>
                      <Avatar src={e.conductor.avatar} />
                    </div>
                    :null
                  }
              </div>
          })
        }
        </Modal>
    )
  }
  modalFecha(){
    let {modalFecha, fechaEntrega, loading} = this.state
    fechaEntrega = moment(fechaEntrega).format("YYYY-MM-DD")
    const dateFormat = 'YYYY-MM-DD';
    return(
      <Modal
          title="Asignar Usuario"
          visible={modalFecha}
          onOk={this.handleOk}
          onCancel={()=>this.setState({modalFecha:false})}
          footer={[
            <Button key="regresar" onCancel={()=>alert({modalFecha:false})}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={()=>this.asignarFecha()}>
              Asignar
            </Button>,
          ]}
        >
        <DatePicker 
          defaultValue={moment(fechaEntrega, dateFormat)} format={dateFormat}
          onChange={(data, fechaEntrega)=>this.setState({data, fechaEntrega})} 
          locale={locale} 
        />
        </Modal>
    )
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////          GUARDAR FECHA
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  asignarFecha(){
    let {fechaEntrega, id} = this.state
    fechaEntrega = moment(fechaEntrega).valueOf()
    console.log({fechaEntrega})
    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'Fecha editada',
        duration: 8,
        description:
          `Se edito la fecha: ${fechaEntrega} al pedido: ${id}`,
      });
    };
    confirm({
      title: `Seguros deseas cambiar el dia: ${fechaEntrega}`,
      content: 'a este pedido',
      okText: 'Si',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        confirmar()
      },
      onCancel() {
        console.log('Cancel');
      },
    });

    const confirmar =()=>{
        axios.get(`ped/pedido/asignarFechaEntrega/${id}/${fechaEntrega}`)
        .then((res)=>{
            if(res.data.status){
              openNotificationWithIcon('success')
              this.setState({modalFecha:false})
              this.props.getPedidos()
            }else{
                alert("Tenemos un problema, intentelo mas tarde")            }
        })
    }
}
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////            ASIGNO UN CONDUCTOR A UN PEDIDO
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  asignarConductor(){
    const {placa, idVehiculo, id, fechaEntrega} = this.state
    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'Vehiculo agregado',
        duration: 8,
        description:
          `Se agrego el vehiculo: ${placa} al pedido: ${id}`,
      });
    };
    confirm({
      title: `Seguros deseas agregar a ${placa}`,
      content: 'a este pedido',
      okText: 'Si',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        confirmar()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
    const confirmar =()=>{
        console.log("confirmar")
        axios.get(`ped/pedido/asignarConductor/${id}/${idVehiculo}/${fechaEntrega}`)
        .then((res)=>{
            if(res.data.status){
                this.props.getPedidos()
                openNotificationWithIcon('success')
                this.setState({modal:false, fechaEntrega:null})
            }else{
              console.log(res.data)
            }
        })
    }
  }

  render() {
    return (
      <div className={style.container}> 
        <section className={style.containerBotones}>
          {this.renderBotones()}
        </section>
        {this.renderTable()}
        {this.renderModalVehiculo()}
        {this.modalFecha()}
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
 
 