// @flow weak

import React, { PureComponent } from "react";
 
import { Table, Modal, Button, Avatar, notification, DatePicker, Select, InputNumber } from 'antd'; 
import 'antd/dist/antd.css';
import axios from "axios";
import {createFilter} from 'react-search-input'
import { connect }         from "react-redux";
import {getUsuarios} from '../../redux/actions/usuarioActions'  
import style from "./style.scss"
const KEYS_TO_FILTERS = ["nombre", "emai", 'codt'] 

class Home extends PureComponent {
  constructor(props){
    super(props)
    this.state={
        usuarios:[],
        usuariosFiltro:[],
        fechaInicio:"2019-01-01",
        fechaFinal: "2030-01-01",
        terminoBuscador:"",
    }
  }
 
    componentWillMount(){
        this.props.getUsuarios()
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
              this.props.getUsuarios()
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

  renderTable(){
   
    const columns = [
      {
        title: 'Nombre',
        dataIndex: 'nombre',
        sorter: (a, b) => a.nombre.length - b.nombre.length,
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'acceso',
        dataIndex: 'acceso',
      },
      {
        title: 'CODT',
        dataIndex: 'codt',
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
    const {usuarios, terminoBuscador} = this.state
    let usuariosFiltro = usuarios.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
    
    return (<Table columns={columns} dataSource={usuariosFiltro}   />)
  }
  render() {
    return (
      <div> 
        <section className={style.seccionContainer}>
          <InputNumber
            
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            onChange={(valor)=>this.setState({valor})}
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
    const {valor} = this.state
    axios.get(`users/cambiarValorTodos/${valor}`)
    .then((res)=>{
      console.log(res.data)
        if(res.data.status){
          this.props.getUsuarios()
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


const mapState = state => {
	return {
        usuarios:state.usuario.usuarios,
	};
};
  
const mapDispatch = dispatch => {
    return {
        getUsuarios: () => {
			dispatch(getUsuarios());
        },
    };
};
  
Home.defaultProps = {
    vehiculos:[]
};

 
export default connect(mapState, mapDispatch)(Home);

 
 