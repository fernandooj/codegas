// @flow weak

import React, { PureComponent } from "react";
 
import { Button, Form, Icon, Card, message, Row, Col, Statistic  } from 'antd'; 
import 'antd/dist/antd.css';
import axios from "axios";
  
class Home extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      pedidos:[]
    }
  }
  componentWillMount(){
//     <Row>
         
//     <Col span={6} offset={6}>
//        <h2>Generar Informes</h2>
//        <a href="x/v1/inf/informe/conversacion/true/null/null" type="primary" htmlType="submit" className="login-form-button">
//             Generar Chats
//         </a>
//         <a href="x/v1/inf/informe/conversacion/true/null/null" type="primary" htmlType="submit" className="login-form-button">
//             Generar Chats
//         </a>
//     </Col>
//   </Row>
  }
  renderFormulario(){  
    return(
      
      <div style={{ background: '#ECECEC', padding: '30px' }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <a href="x/v1/inf/informe/conversacion/true/null/null" type="primary" htmlType="submit" className="login-form-button">
                1.  Generar Chats
            </a>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <a href="x/v1/inf/informe/users/corporativos/true/null/null" type="primary" htmlType="submit" className="login-form-button">
                2.  Generar Usuarios corporativos
            </a>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <a href="x/v1/inf/informe/users/clientes/true/null/null" type="primary" htmlType="submit" className="login-form-button">
                3.  Generar Clientes
            </a>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <a href="x/v1/inf/informe/vehiculos/true/null/null" type="primary" htmlType="submit" className="login-form-button">
                4.  Generar Vehiculos
            </a>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <a href="/" type="primary" htmlType="submit" className="login-form-button">
               5.	Pedidos trazabilidad pedido
            </a>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <a href="x/v1/inf/informe/pedidos/no_entregados/true/null/null" type="primary" htmlType="submit" className="login-form-button">
              6.    Generar Pedidos no entregados
            </a>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <a href="x/v1/inf/informe/pedidos/cerrados/true/null/null" type="primary" htmlType="submit" className="login-form-button">
                7.  Generar Facturación
            </a>
          </Card>
        </Col>
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
export default Form.create({ name: 'login' })(Home)
 
 