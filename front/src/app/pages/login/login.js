// @flow weak

import React, { PureComponent } from "react";
 
import { Button, Form, Icon, Input, message, Row, Col  } from 'antd'; 
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
     
  }
  renderFormulario(){
    const { getFieldDecorator } = this.props.form;
    return(
      <Row>
         
        <Col span={6} offset={9}>
           <h2>Iniciar Sesión</h2>
           <Form onSubmit={this.handleSubmit}>
            {/*   campo email   */}
            <Form.Item>
              {
                getFieldDecorator("username",{
                  rules:[
                    {required:true, message:"Campo obligatorio"}
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="email"
                  />
                )
              }
            </Form.Item>
            {/*   campos password   */}
            <Form.Item>
              {
                getFieldDecorator("password",{
                  rules:[
                    {required:true, message:"Campo obligatorio"}
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="password"
                    type="password"
                  />
                )
              }
            </Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                  Log in
              </Button>
            </Form>
        </Col>
      </Row>
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
          res.data.code===2 ?noExiste() :res.data.code===0 ?datosErroneos() : window.location.href = "home"
        })
        .catch(err=>{
          console.log(err)
        })
      }
    })
  }

}
export default Form.create({ name: 'login' })(Home)
 
 