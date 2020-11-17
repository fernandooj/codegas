// @flow weak

import React, { PureComponent } from "react";
 
import { Table, Checkbox, Button, Input, notification, Space, Select, InputNumber } from 'antd'; 
import 'antd/dist/antd.css';
import axios from "axios";
import {createFilter} from 'react-search-input'
import { connect }         from "react-redux";
import {getUsuariosZonas} from '../../redux/actions/usuarioActions'  
const KEYS_TO_FILTERS = ["nombre", "email",  "razon_social", 'codt', "valorUnitario","nombreZona"] 
const { Search } = Input;

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
    let valorUnis = parseInt(valor.target.value)
    let valorUni = valorUnis===NaN ?0 :valorUnis
 
      axios.get(`users/cambiarValor/${valorUni}/${id}`)
      .then((res)=>{
          if(res.data.status){
              let usuarios = this.state.usuarios.filter(e=>{
                  if(e.idCliente==id){e.valorUnitario=valorUni}
                  return e
              })
              this.setState({usuarios})
               
          }else{
            const openNotificationWithIcon = type => {
                notification[type]({
                  message: 'Valor unitario editado',
                  duration: 8,
                  description:
                    ``,
                });
              };
            let usuarios = this.state.usuarios.filter(e=>{
                if(e.idCliente==id){e.valorUnitario=0}
                return e
            })
            this.setState({usuarios})
            openNotificationWithIcon('success')
             
          }
      })
    }
    tableChange(a,e,i){
 
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
                <Input
                    value={e.valorUnitario}
                    
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    enterButton
                    onChange={(a)=>this.cambiarValorUnitario(a, e.idCliente)}
                />
            </div>
            ),
        },
        
        ];
        
        let usuariosFiltro = usuarios.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS)) 
        return (<Table  rowKey={(record) => record.idCliente} rowSelection={rowSelection} columns={columns} dataSource={usuariosFiltro} onChange={(a,e,i)=>this.tableChange(a,e,i)} pagination={{ pageSize:terminoBuscador.length<1 ?pageSize :usuariosFiltro.length }} scroll={{ x: 1500, y: 800 }} bordered />)
    }
    onSelectChange = (selectedRowKeys, seleccionados) => {
        this.setState({ selectedRowKeys, seleccionados });
    }; 
    render() {
      const {showValorBase, seleccionados, tipo} = this.state 
      console.log({seleccionados})
      let icon = tipo=="porcentaje" ?"%" :"$"
      return (
          <Space direction="vertical">
            <section style={{padding: "20px 5px"}}>
                
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
                <Checkbox onChange={(todos)=>this.seleccionaTodos(todos.target.checked)} style={{ margin:"0 10px" }} >Cambiar a todos</Checkbox>
            <Button type="primary" onClick={()=>this.handleSubmit()}>Guardar</Button>
            </section>
            <section>
                <Search  allowClear enterButton  placeholder="Buscar registro" onSearch={(e)=>this.setState({terminoBuscador:e})} />
            </section>
            {this.renderTable()}
        </Space>
      );
  }
  seleccionaTodos(todos){
    let {seleccionados, usuarios} = this.state
    if(todos){
        this.setState({seleccionados:usuarios})
        console.log({usuarios})
    }
    
  } 
  handleSubmit = e => {
    let {valor, valor2, seleccionados, tipo, showValorBase} = this.state
    console.log(valor2)
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
    console.log(seleccionados)

    if(!tipo && !showValorBase){
        alert("selecciona porcentaje o numerico")
    }
    else if(seleccionados.length==0){
        alert("selecciona algun usuario")
    }else{
        axios.put(`users/cambiarValorTodos/`, {seleccionados})
        .then((res)=>{
        
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

 
 