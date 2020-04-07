// @flow weak

import React, { PureComponent } from "react";
 
import { Table, Checkbox, Button, Avatar, notification, DatePicker, Select, InputNumber } from 'antd'; 
import 'antd/dist/antd.css';
import axios from "axios";
import {createFilter} from 'react-search-input'
import { connect }         from "react-redux";
import {getUsuariosZonas} from '../../redux/actions/usuarioActions'  
import style from "./style.scss"
const KEYS_TO_FILTERS = ["nombre", "email",  "razon_social", 'codt', "nombreZona"] 
const { Option } = Select;
class Home extends PureComponent {
  constructor(props){
    super(props)
    this.state={
        valor2:0,
        usuarios:[],
        usuariosFiltro:[],
        seleccionados:[],
        zonas:[],
        selectedRowKeys:[],
        fechaInicio:"2019-01-01",
        fechaFinal: "2030-01-01",
        terminoBuscador:"",
        pageSize:12
    }
  }
 
    componentWillMount(){
        this.props.getUsuariosZonas()
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
    }
    componentWillReceiveProps(props){
        console.log(props.usuarios)
        this.setState({usuarios:props.usuarios, usuariosFiltro:props.usuarios})
    }
    cambiarValorUnitario(valor, id) {
      console.log({valor:valor.target.value, id})
      axios.get(`users/cambiarValor/${valor.target.value}/${id}`)
      .then((res)=>{
        console.log(res.dta)
          if(res.data.status){
              this.props.getUsuariosZonas()
              const openNotificationWithIcon = type => {
                notification[type]({
                  message: 'Valor unitario editado',
                  duration: 8,
                  description:
                    ``,
                });
              };
              // openNotificationWithIcon('success')
          }else{
            alert("Tenemos un problema, intentelo mas tarde")
          }
      })
    }
    tableChange(a,e,i){
        console.log(e.nombreZona[0])
        this.setState({terminoBuscador:e.nombreZona[0] ?e.nombreZona[0] :""})
    }
    renderTable(){
        const { selectedRowKeys, pageSize, terminoBuscador, usuarios } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (e,a)=>this.onSelectChange(e,a),
        };

        const columns = [
        {
            title: 'Zona',
            dataIndex: 'nombreZona',
            width: 250,
            
            filters:this.state.zonas,
            onFilter: (value, record) => record.nombreZona.indexOf(value) === 0,
            sorter: (a, b) => a.nombreZona.length - b.nombreZona.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'CODT',
            dataIndex: 'codt',
            width: 100,
        },
        {
            title: 'Razon Social',
            dataIndex: 'razon_social',
            width: 600,
        },  
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            width: 250,
            sorter: (a, b) => a.nombre.length - b.nombre.length,
        },
        {
            title: 'valor Uni.',
            dataIndex: 'valorUnitario',
            render:(carro, e)=>(
            <div>
                <input
                value={e.valorUnitario}
                className={style.inputValue}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={(a)=>this.cambiarValorUnitario(a, e._id)}
                />
            </div>
            ),
        },
        
        ];
        
        let usuariosFiltro = usuarios.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        return (<Table rowSelection={rowSelection} columns={columns} dataSource={usuariosFiltro} onChange={(a,e,i)=>this.tableChange(a,e,i)} pagination={{ pageSize:terminoBuscador.length<1 ?pageSize :usuariosFiltro.length }} scroll={{ x: 1500, y: 800 }} bordered />)
    }
    onSelectChange = (selectedRowKeys, seleccionados) => {
        this.setState({ selectedRowKeys, seleccionados });
    };
    render() {
        const {showValorBase, tipo} = this.state 
        console.log(showValorBase)
        let icon = tipo=="porcentaje" ?"%" :"$"
        return (
        <div> 
            <section className={style.seccionContainer}>
                
                <Checkbox onChange={(showValorBase)=>this.setState({showValorBase:showValorBase.target.checked})}>Tomar valor base</Checkbox>
                {
                    showValorBase
                    &&<InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={(valor)=>this.setState({valor})}
                        placeholder="Valor Base"
                    />    
                }
                <Select defaultValue="Tipo" style={{ width: 150,  margin:"0 10px" }} onChange={(tipo)=>this.setState({tipo})}>
                    <Option value="porcentaje">% Porcentaje</Option>
                    <Option value="numerico">$ Numerico</Option>
                </Select>
                <InputNumber
                    formatter={value2 => `  ${value2}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value2 => value2.replace(/\$\s?|(,*)/g, '')}
                    onChange={(valor2)=>this.setState({valor2})}
                    placeholder="Valor Base"
                    
                /> 
            <Button style={{backgroundColor:"#00218b"}} onClick={()=>this.handleSubmit()}>Guardar</Button>
            </section>
            <section>
                <input className={style.inputSearch} placeholder="Buscar registro" onChange={(e)=>this.setState({terminoBuscador:e.target.value})} />
            </section>
            {this.renderTable()}
        </div>
        );
  }
  handleSubmit = e => {
    let {valor, valor2, seleccionados, tipo, showValorBase} = this.state
    
    showValorBase
    ?seleccionados = seleccionados.map(e=>{
        e.valorUnitario = tipo=="porcentaje" ?valor+(valor*(valor2/100)) :valor+valor2
        return e
    })
    :seleccionados = seleccionados.map(e=>{
        e.valorUnitario = tipo=="porcentaje" ?e.valorUnitario+(e.valorUnitario*(valor2/100)) :e.valorUnitario+valor2
        return e
    })
    seleccionados = seleccionados.map(e=>{
        return {
            _id:e.idCliente,
            valorUnitario:e.valorUnitario
        }
    })
    

    if(!tipo && !showValorBase){
        alert("selecciona porcentaje o numerico")
    }
    else if(seleccionados.length==0){
        alert("selecciona algun usuario")
    }else{
        axios.put(`users/cambiarValorTodos/`, {seleccionados})
        .then((res)=>{
          console.log(res.data)
            if(res.data.status){
              this.props.getUsuariosZonas()
              const openNotificationWithIcon = type => {
                notification[type]({
                  message: 'Valor unitario editado',
                  duration: 3,
                  description:
                    ``,
                });
              };
              openNotificationWithIcon('success')
            }else{
                alert("Tenemos un problema, intentelo mas tarde")
            }
        })
    }
  }
}


const mapState = state => {
	return {
    usuarios:state.usuario.usuariosZonas,
	};
};
  
const mapDispatch = dispatch => {
    return {
      getUsuariosZonas: () => {
			  dispatch(getUsuariosZonas());
       },
    };
};
  
Home.defaultProps = {
    vehiculos:[]
};

 
export default connect(mapState, mapDispatch)(Home);

 
 