// @flow weak

import React, { PureComponent } from "react";
 
import { Button, Form, Icon, Card, message, Row, Col, DatePicker  } from 'antd'; 
 
import axios from "axios";
import locale from 'antd/es/date-picker/locale/es_ES';
const { RangePicker } = DatePicker;

class Informe extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      pedidos:[],
      fechaInicio:"2019-01-01",
      fechaFinal: "2030-01-01",
      perfil:{}
    }
  }
  componentWillMount(){
      axios.get(`user/perfil/`)
      .then(res => { 
        console.log(res.data)
        this.setState({perfil: res.data.user})
      })
      .catch(err => {
        console.log(err);
      });
  }
 
  onChange(date, dateString){
    if(date.length==0){
      this.setState({fechaInicio:"2019-01-01", fechaFinal:"2030-01-01"})
    }else{
      this.setState({fechaInicio:dateString[0], fechaFinal:dateString[1]})
    }
  }
  onOpenChanges(data, as){
    console.log(data, as)
  }
  renderFormulario(){   
    let {fechaInicio, fechaFinal, perfil} = this.state
    
    return(
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={16} style={{ "paddingBottom": "30px" }}>
          <h4 style={{ float: 'left', margin: "6px 13px" }}>Filtrar por fechas</h4> 
          <RangePicker onChange={(date,string)=>this.onChange(date,string)} onPanelChange={(date,string)=>this.onPanelChange(date,string)} locale={locale}/>
        </Row>
      <Row gutter={16}>
      {
        perfil.acceso==="admin"
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/conversacion/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
                1.  Generar Chats
            </a>
          </Card>
        </Col>
      }
      {
        perfil.acceso==="admin"
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/users/corporativos/true/"+fechaInicio+"/"+fechaFinal}  type="primary" htmlType="submit" className="login-form-button">
                2.  Generar Usuarios corporativos
            </a>
          </Card>
        </Col>
      }
      {
        perfil.acceso==="admin"
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/users/clientes/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
                3.  Generar Clientes
            </a>
          </Card>
        </Col>
      }
      {
        perfil.acceso==="admin"
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/vehiculos/true/"+fechaInicio+"/"+fechaFinal}  type="primary" htmlType="submit" className="login-form-button">
                4.  Generar Vehiculos
            </a>
          </Card>
        </Col>
      }
      {
        perfil.acceso!=="adminTanque"
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/pedidos/trazabilidad/true/"+fechaInicio+"/"+fechaFinal}  type="primary" htmlType="submit" className="login-form-button">
               5.	Pedidos trazabilidad
            </a>
          </Card>
        </Col>

      }
      {
        perfil.acceso!=="adminTanque"
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/pedidos/no_entregados/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
              6. Generar Pedidos no entregados
            </a>
          </Card>
        </Col>
      }
      {
        perfil.acceso!=="adminTanque"
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/pedidos/cerrados/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
              7.  Facturación
            </a>
          </Card>
        </Col>
      }
      {
        perfil.acceso!=="adminTanque"
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/pedidos/programacion/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
              8.  Programación
            </a>
          </Card>
        </Col>
      }
      {
        perfil.acceso==="admin"
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/novedades/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
                9.  Observaciones
            </a>
          </Card>
        </Col>
      }
      {
        perfil.acceso==="admin"
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/calificaciones/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
                10.  Calificaciones
            </a>
          </Card>
        </Col>
      }   
      {
        perfil.acceso==="admin"
        &&<Col span={6}>
          <Card>
            <a href="x/v1/inf/informe/pdf/chats/true/null/null" type="primary" htmlType="submit" className="login-form-button">
                11.  Generar PDF chats
            </a>
          </Card>
        </Col>
      }
      {
        perfil.acceso==="admin"
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/users/clientesVeos/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
                12.  Generar Clientes con Veos
            </a>
          </Card>
        </Col>
      }
      {
        (perfil.acceso==="admin" || perfil.acceso==="adminTanque" || perfil.acceso==="depTecnico")
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/tanques/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
                13.  Generar Tanques
            </a>
          </Card> 
        </Col>
      } 
      {
        (perfil.acceso==="admin" || perfil.acceso==="adminTanque" || perfil.acceso==="depTecnico")
        &&<Col span={6}>
          <Card>
            <a href={"x/v1/inf/informe/alertaTanques/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
                14.  Generar Alertas tanques
            </a>
          </Card> 
        </Col>
      }  
      {
        (perfil.acceso==="admin" || perfil.acceso==="adminTanque" || perfil.acceso==="depTecnico")
        &&<Col span={6}> 
          <Card>
            <a href={"x/v1/inf/informe/ultimaRev/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
              15.  Generar ultima revisión
            </a>
          </Card>
        </Col>
      }
      {
        (perfil.acceso==="admin" || perfil.acceso==="adminTanque" || perfil.acceso==="depTecnico")
        &&<Col span={6}> 
          <Card>
            <a href={"x/v1/inf/informe/revision/true/"+fechaInicio+"/"+fechaFinal} type="primary" htmlType="submit" className="login-form-button">
              16.  Generar Revisiones
            </a>
          </Card>
        </Col>
      }
      
      </Row>
    </div>

    )
  }
  render() {
    return (
      <div>
          {this.renderFormulario()}
      </div>
    );
  }
  handleSubmit = e => {
    const noExiste = () => {
      message.info('no existe este usuario');
    };
    const datosErroneos = () => {
      message.info('tus datos no coinciden');
    };
    e.preventDefault()
    this.props.form.validateFields((err, valor)=>{
      if(err){
        console.log(err)
      }else{
        let email = valor.username;
        let password = valor.password
        axios.post("/user/login", {email, password})
        .then(res=>{
          console.log(res.data)
          res.data.code===2 ?noExiste() :res.data.code===0 ?datosErroneos() : window.location.href = "#/pedidos"
        })
        .catch(err=>{
          console.log(err)
        })
      }
    })
  }

}
export default Informe
 
 