// @flow weak

import React, { PureComponent } from "react";
 
import style from "./style.scss"
import { Table, Modal, Button, Avatar, notification, DatePicker, Select, Input } from 'antd'; 
import 'antd/dist/antd.css';
import locale              from 'antd/lib/date-picker/locale/es_ES';
import axios               from "axios";
import moment 			       from 'moment-timezone'
import {createFilter}       from 'react-search-input'
import SocketIOClient      from 'socket.io-client';
import {getPedidos}        from '../../redux/actions/pedidoActions' 
import {getVehiculos}      from '../../redux/actions/vehiculoActions' 
import { connect }         from "react-redux";
import reqwest from 'reqwest';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const confirm = Modal.confirm;
const { Option } = Select;
const { TextArea, Search } = Input;

const KEYS_TO_FILTERS = ["conductorId.nombre", "conductorId.cedula", 'forma', "nPedido", "zonaId.nombre", 'cantidadKl', 'cantidadPrecio', "usuarioId.nombre", "usuarioId.cedula", "usuarioId.razon_social", "usuarioId.codt", "usuarioId.email", "frecuencia", "estado", "imagenCerrar", "puntoId.direccion"] 

class Home extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      modal:false,
      modalFecha:false,
      loading: false,
      terminoBuscador:"",
      pedidos:[],
      vehiculos:[],
      zonas:[],
      data: [],
      pagination: {},
      loading: false,
      fechaEntregaFiltro:  moment().format("YYYY-MM-DD")
    }
  }
  componentWillMount(){
    axios.get("zon/zona/activos")
    .then(res=>{
        let zonas=res.data.zona.map(e=>{
          return{
            text:e.nombre,
            value:e.nombre
          }
        })
        this.setState({zonas})  
    })
    this.props.getVehiculos()
    this.socket = SocketIOClient(window.location.origin);
    this.socket.on(`actualizaPedidos`, this.reciveMensanje.bind(this));
  }
  reciveMensanje(messages) {
    this.fetch()
  }
  componentWillReceiveProps(props){
 
    let vehiculos = props.vehiculos.map(e=>{
      return{
        text:e.placa,
        value:e.placa
      }
    })
    
 
    this.setState({pedidosFiltro:props.pedidos, vehiculos})
  }
  componentDidMount() {
    this.fetch();
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
 
         
         <DatePicker 
          onChange={(data, fechaEntregaFiltro)=>this.actualizaFecha({data, fechaEntregaFiltro})} 
          locale={locale} 
          placeholder="Fecha creación"
        />
        <DatePicker 
           onChange={(data, fechaEntregaFiltro)=>this.actualizaFechaEntrega({data, fechaEntregaFiltro})} 
          locale={locale} 
          placeholder="Fecha entrega"
          style={{margin:"0 8px"}}
        />
         <Button style={{backgroundColor:"#000000", color:"#ffffff"}} onClick={()=>this.setState({pedidos:this.state.pedidosFiltro})}>Limpiar</Button>
      </div>
    )
  }
  actualizarTabla(filtro){
    this.setState({ loading: true });
    let params={
      results: 1000,
      page: 1000,
      sortField: 1000,
      sortOrder: 1000,
    }
    reqwest({
      url: `x/v1/ped/pedido/todos/web/undefined`,
      method: 'get',
      data: {
        results: 10,
        ...params,
      },
      type: 'json',
    }).then(data => {
      console.log(data)
      let pedidos = data.pedido.filter(e=>{
        if(!e.carroId)
        e["carroId"]={placa:"Sin placa"}
        return e
      })
      pedidos = pedidos.filter(e=>{
        if(!e.zonaId)
        e["zonaId"]={nombre:"Sin Zona"}
        return e
      })
      pedidos = pedidos.filter(e=>{
        return e.estado==filtro
      })
      const pagination = { ...this.state.pagination };
      pagination.total = 200;
      this.setState({
        loading: false,
        data: pedidos,
        pagination,
      });
    });

     
  
  }
  actualizarTabla2(filtro, filtro2){
    this.setState({ loading: true });
    let params={
      results: 1000,
      page: 1000,
      sortField: 1000,
      sortOrder: 1000,
    }
    reqwest({
      url: `x/v1/ped/pedido/todos/web/undefined`,
      method: 'get',
      data: {
        results: 10,
        ...params,
      },
      type: 'json',
    }).then(data => {
      let pedidos = data.pedido.filter(e=>{
        if(!e.carroId)
        e["carroId"]={placa:"Sin placa"}
        return e
      })
      pedidos = pedidos.filter(e=>{
        if(!e.zonaId)
        e["zonaId"]={nombre:"Sin Zona"}
        return e
      })
      if(filtro2){
        pedidos = pedidos.filter(e=>{
          return e.estado==filtro &&e.carroId
        })
        console.log(pedidos)
      }else{
        pedidos = pedidos.filter(e=>{
          return e.estado==filtro &&!e.carroId
        })
      }
      const pagination = { ...this.state.pagination };
      pagination.total = 200;
      this.setState({
        loading: false,
        data: pedidos,
        pagination,
      });
    });

    // let {pedidos, pedidosFiltro} = this.state
    // if(filtro2){
    //   pedidos = pedidosFiltro.filter(e=>{
    //     return e.estado==filtro &&e.carroId
    //   })
    // }else{
    //   pedidos = pedidosFiltro.filter(e=>{
    //     return e.estado==filtro &&!e.carroId
    //   })
    // }
    
  }
  actualizarTabla3(filtro, filtro2){
    this.setState({ loading: true });
    let params={
      results: 1000,
      page: 1000,
      sortField: 1000,
      sortOrder: 1000,
    }
    reqwest({
      url: `x/v1/ped/pedido/todos/web/undefined`,
      method: 'get',
      data: {
        results: 10,
        ...params,
      },
      type: 'json',
    }).then(data => {
      let pedidos = data.pedido.filter(e=>{
        if(!e.carroId)
        e["carroId"]={placa:"Sin placa"}
        return e
      })
      pedidos = pedidos.filter(e=>{
        if(!e.zonaId)
        e["zonaId"]={nombre:"Sin Zona"}
        return e
      })
      pedidos = pedidos.filter(e=>{
        return e.estado==filtro &&e.entregado
      })
      const pagination = { ...this.state.pagination };
      pagination.total = 200;
      this.setState({
        loading: false,
        data: pedidos,
        pagination,
      });
    });

   
    
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };
  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: `x/v1/ped/pedido/todos/web/undefined`,
      method: 'get',
      data: {
        results: 10,
        ...params,
      },
      type: 'json',
    }).then(data => {
      console.log(data)
      let pedidos = data.pedido.filter(e=>{
        if(!e.carroId)
        e["carroId"]={placa:"Sin placa"}
        return e
      })
      pedidos = pedidos.filter(e=>{
        if(!e.zonaId)
        e["zonaId"]={nombre:"Sin Zona"}
        return e
      })

      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 200;
      this.setState({
        loading: false,
        data: pedidos,
        pagination,
      });
    });
  };
  renderTable(){
    const columns = [
      {
        title: 'N Pedido',
        dataIndex: 'nPedido',
      },
      {
        title: 'CODT',
        dataIndex: 'usuarioId.codt',
      },
      {
        title: 'Razón social',
        dataIndex: 'usuarioId.razon_social',
      },
      {
        title: 'Cedula',
        dataIndex: 'usuarioId.cedula',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Dirección',
        dataIndex: 'puntoId.direccion',
      },
      {
        title: 'Zona',
        dataIndex: 'zonaId.nombre',
        filters:this.state.zonas,
        onFilter: (value, record) => record.zonaId.nombre.indexOf(value) === 0,
        sorter: (a, b) => a.zonaId.nombre.length - b.zonaId.nombre.length,
        sortDirections: ['descend', 'ascend'],
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
              :this.setState({modalFecha:true, placaPedido:e.carroId ?e.carroId.placa :null, imagenPedido:e.imagen, fechaEntrega:e.fechaEntrega, id:e._id, estado:e.estado, nombre:e.usuarioId.nombre, email:e.usuarioId.email, tokenPhone:e.usuarioId.tokenPhone, cedula:e.usuarioId.cedula, forma:e.forma, nPedido:e.nPedido, cantidad:e.cantidad, entregado:e.entregado, factura:e.factura, kilos:e.kilos, valor_unitario:e.valor_unitario })
            }
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
        filters:this.state.vehiculos,
        render:(carro, e)=>(
          <Button type="link" className={style.link} 
            onClick={()=>
            {
              e.estado=="espera" || e.estado=="innactivo" 
              ?alert("no puedes editar aun el pedido")
              :this.setState({modal:true, placaPedido:e.carroId ?e.carroId.placa :null, imagenPedido:e.imagen, fechaEntrega:e.fechaEntrega, id:e._id, estado:e.estado, nombre:e.usuarioId.nombre, email:e.usuarioId.email, tokenPhone:e.usuarioId.tokenPhone, nPedido:e.nPedido, cedula:e.usuarioId.cedula, forma:e.forma, cantidad:e.cantidad, entregado:e.entregado, factura:e.factura, kilos:e.kilos, valor_unitario:e.valor_unitario })}
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
        render:(carro, e)=>(
          <Select style={{ width: '100%' }} value={e.estado} onChange={(estado)=>this.cambiarEstado(estado, e._id, e.estado, e.nPedido )} >
            <Option value="activo">Activo</Option>
            <Option value="innactivo">Innactivo</Option>
            <Option value="espera">Espera</Option>
          </Select>
        ),
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
      {
        title: 'Imagen',
        dataIndex: 'imagenCerrar',
        render:(carro, e)=>(
          <Zoom>
            <img src={e.imagenCerrar} className={style.iconImagen} />
          </Zoom>
        ),
        onFilter: (value, record) => record.estado.indexOf(value) === 0,
        sorter: (a, b) => a.estado.length - b.estado.length,
        sortDirections: ['descend', 'ascend'],
      },
    ];
    const {data, terminoBuscador} = this.state
    let pedidosFiltro = data.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
    
    return (
      <Table 
        columns={columns} 
        dataSource={pedidosFiltro} 
        scroll={{ x: 1800 }} 
        loading={this.state.loading}
        onChange={this.handleTableChange}
        
        rowClassName={ (e, record) =>  e.estado=="espera" ?style.espera :e.estado=="noentregado" ?style.noentregado :e.estado=="innactivo" ?style.innactivo :e.estado=="activo" &&!e.carroId && !e.entregado ?style.activo :e.estado=="activo" && !e.entregado ?style.asignado :style.otro   }
      />)
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////            CAMBIO EL ESTADO DEL PEDIDO
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  cambiarEstado(estado, id, estadoInicial, nPedido){
    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'Pedido editado',
        duration: 8,
        description:
          `Nuevo estado: ${estado}`,
      });
    };
    confirm({
      title: `Cambiar el pedido N: ${nPedido}`,
      // content: 'a este pedido',
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
      axios.get(`ped/pedido/cambiarEstado/${id}/${estado}`)
      .then(res=>{
        console.log(res.data)
        if(res.data.status){
            if(estado=="activo"){
                //////// esta condicion es para cuando estaba el pedido innactivo y luego lo activaron
                if(estadoInicial=="innactivo"){
                    this.setState({modalNovedad:true, estadoEntrega:"asignado"})
                }else{
                    // this.setState({modalFechaEntrega:true, estadoEntrega:"asignado"})
                    openNotificationWithIcon('success')
                }
                ////////////////////////////////////////////////////////////////////////////////////
            }else if(estado=="innactivo"){
                this.setState({modalNovedad:true})
            } else{
              openNotificationWithIcon('success')
              this.fetch()
            }
        }else{
            alert("Tenemos un problema, intentelo mas tarde")
        }
      })
    }
  }  
  modalNovedad(){
    const {novedad} = this.state
    return(
      <Modal
        title="Novedad Innactividad"
        visible={this.state.modalNovedad}
        onOk={()=>this.guardarNovedadInnactivo()}
        onCancel={()=>this.setState({modalNovedad:false})}
      >
        <TextArea 
          rows={4}
          placeholder="Novedades"
          placeholderTextColor="#aaa" 
          autoCapitalize = 'none'
          onChangeText={(novedad)=> this.setState({novedad})}
        />
          
      </Modal>
    )
  } 
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////           GUARDAR NOVEDAD CUANDO ES INNACTIVO
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  guardarNovedadInnactivo(){
    let {novedad, id} = this.state
    axios.post(`nov/novedad/`, {pedidoId:id, novedad})
    .then((res2)=>{
        this.setState({modalNovedad:false, estadoEntrega:"noentregado", novedad:""})
        setTimeout(() => {
            alert("Pedido actualizado")
        }, 1000);
        // this.props.getPedidos(moment(fechaEntregaFiltro).valueOf())
        this.fetch()
    })
  }

  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////            RENDER MODAL VEHICULO
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderModalVehiculo(){
    const {modal, idVehiculo, loading, placa} = this.state
    
    return(
      <Modal
          title="Asignar Vehiculo"
          visible={modal}
          onOk={this.handleOk}
          onCancel={()=>this.setState({modal:false, idVehiculo:null, placa:null })}
          footer={[
            <Button key="submit" type="primary" loading={loading} onClick={()=>{!placa ?alert("Selecciona un vehiculo") :this.asignarConductor()} }>
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
  disabledDate(current) {
    console.log
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'days');
  }
  modalFecha(){
    let {modalFecha, fechaEntrega, loading} = this.state
    fechaEntrega = moment(fechaEntrega).format("YYYY-MM-DD")
    const dateFormat = 'YYYY-MM-DD';
    return(
      <Modal
          title="Asignar Fecha"
          visible={modalFecha}
          onOk={this.handleOk}
          onCancel={()=>this.setState({modalFecha:false})}
          footer={[
             
            <Button key="submit" type="primary" loading={loading} onClick={()=>this.asignarFecha()}>
              Asignar
            </Button>,
          ]}
        >
        <DatePicker 
          defaultValue={moment(fechaEntrega, dateFormat)} format={dateFormat}
          onChange={(fechaEntrega)=>this.setState({ fechaEntrega})} 
          locale={locale} 
          disabledDate={this.disabledDate}
        />
        </Modal>
    )
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////          GUARDAR FECHA
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  asignarFecha(){
    let {fechaEntrega, id, nPedido} = this.state
    fechaEntrega = moment(fechaEntrega).format("YYYY-MM-DD")
    console.log({fechaEntrega})
    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'Fecha editada',
        duration: 8,
        description:
          `Se edito la fecha: ${fechaEntrega} al pedido: ${nPedido}`,
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
          console.log(res.data)
            if(res.data.status){
              openNotificationWithIcon('success')
              this.setState({modalFecha:false})
              this.fetch()
            }else{
                alert("Tenemos un problema, intentelo mas tarde")            }
        })
    }
}
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////            ASIGNO UN CONDUCTOR A UN PEDIDO
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  asignarConductor(){
    const {placa, idVehiculo, id, fechaEntrega, nPedido} = this.state
    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'Vehiculo agregado',
        duration: 8,
        description:
          `Se agrego el vehiculo: ${placa} al pedido: ${nPedido}`,
      });
    };
    confirm({
      title: `Seguros deseas agregar a ${placa}`,
      content: `al pedido ${nPedido}`,
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
        axios.get(`ped/pedido/asignarConductor/${id}/${idVehiculo}/${fechaEntrega}/${nPedido}`)
        .then((res)=>{
            if(res.data.status){
                this.fetch()
                openNotificationWithIcon('success')
                this.setState({modal:false, fechaEntrega:null})
            }else{
              console.log(res.data)
            }
        })
    }
  }
  buscarRegistro= (terminoBuscador) => {
     
    
      this.setState({
        
        terminoBuscador
      });
      this.fetch({
        results: 1000,
        page: 1000,
        sortField: 1000,
        sortOrder: 1000,
 
      });
 
  }
  render() {
    return (
      <div className={style.container}> 
        <section className={style.containerBotones}>
          <section>
            {this.renderBotones()}
          </section>
          <section>
            {/* <input className={style.inputSearch} placeholder="Buscar registro" onChange={(e)=>this.setState({terminoBuscador:e.target.value})} /> */}
            <Search className={style.inputSearch} placeholder="Buscar registro" onSearch={value => this.buscarRegistro(value)} enterButton /> 

          </section>

        </section>
        {this.renderTable()}
        {this.renderModalVehiculo()}
        {this.modalNovedad()}
        {this.modalFecha()}
      </div>
    );
  }
  actualizaFecha = fechaEntregaFiltro => {
    let {pedidos, pedidosFiltro} = this.state
    let pedidosSlice = pedidosFiltro.filter(item=>{
      item.creado = item.creado.slice(0,10);
      return item;
    })
    console.log(pedidosSlice) 
    pedidos = pedidosSlice.filter(e=>{
      return e.creado==fechaEntregaFiltro.fechaEntregaFiltro 
    })
    this.setState({pedidos})
  }
  actualizaFechaEntrega = fechaEntregaFiltro => {
    let {pedidos, pedidosFiltro} = this.state
   
    pedidos = pedidosFiltro.filter(e=>{
      return e.fechaEntrega==fechaEntregaFiltro.fechaEntregaFiltro 
    })
    this.setState({pedidos})
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
 
 