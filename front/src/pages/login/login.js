// @flow weak

import React, { PureComponent } from "react";
 
import { Button, Form, Input, message, Row, Col  } from 'antd'; 
import {
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';

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
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

    return(
      <Row>
        <Col span={6} offset={9}>
             <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.handleSubmit}
            >
            {/*   campo email   */}
            <Form.Item
             label="Email"
             name="email"
              rules={[
                {required:true, message:"Campo obligatorio"}
              ]}
            >  
              <Input
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                
              />    
            </Form.Item> 
            {/*   campos password   */}
            <Form.Item
             label="Password"
             name="password"
              rules={[
                {required:true, message:"Campo obligatorio"}
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            </Form.Item>
             <Button type="primary" htmlType="submit">
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
    console.log(e)
    const noExiste = () => {
      message.info('no existe este usuario');
    };
    const datosErroneos = () => {
      message.info('tus datos no coinciden');
    };
    let {email, password} = e   
    axios.post("/user/login", {email, password})
    .then(res=>{
      console.log(res.data) 
      // res.data.code===2 ?noExiste() :res.data.code===0 ?datosErroneos() : window.location.href = "#/pedidos"
      res.data.code===2 ?noExiste() :res.data.code===0 ?datosErroneos() : window.location.reload()
    })
    .catch(err=>{
      console.log(err)
    })
  }
}
export default Home
 
 