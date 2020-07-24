import React, {useState, useEffect} from "react"
import axios from "axios" 
import { Table, Modal, Button, Space, notification, DatePicker, Input, InputNumber } from 'antd'; 
import {createFilter} from 'react-search-input'
const KEYS_TO_FILTERS = ["_id.capacidad", "_id.placaText",  "_id.razon_social", '_id.codt'] 
const { Search } = Input;
const Tanque =()=>{
    const [tanques, setTanque] = useState([])
    const [terminoBuscador, setTerminoBuscador] = useState("")
    useEffect(() => {
        axios.get("tan/tanque/web") 
        .then(res=>{
            console.log(res.data.tanque)
            setTanque(res.data.tanque)
        })
        .catch(err=>{
            console.log(err)
        }) 
    }, [])   
    const renderTable=()=>{
        const columns = [ 
            {
                title: 'Codigo activo',
                dataIndex: '_id',
                render: text => <p>{text.placaText}</p>, 
            },
            {
                title: 'capacidad',
                dataIndex: '_id',
                render: text => <p>{text.capacidad}</p>, 
                // sorter: (a, b) => a.nombre.length - b.nombre.length,
            },
            {
                title: 'fabricante',
                dataIndex: '_id',
                render: text => <p>{text.fabricante}</p>, 
                
            },
            {
                title: 'Registro Onac',
                dataIndex: '_id',
                render: text => <p>{text.registroOnac}</p>, 
                
            },
            {
                title: 'Ultima Rev',
                dataIndex: '_id',
                render: text => <p>{text.fechaUltimaRev}</p>, 
                
            },
            {
                title: 'Placa Man.',
                dataIndex: '_id',
                render: text => <p>{text.nPlaca}</p>, 
                
            },
            {
                title: 'codigoActivo',
                dataIndex: '_id',
                render: text => <p>{text.codigoActivo}</p>, 
                
            },
            {
                title: 'serie',
                dataIndex: '_id',
                render: text => <p>{text.serie}</p>, 
                
            },
            {
                title: 'anoFabricacion',
                dataIndex: '_id',
                render: text => <p>{text.anoFabricacion}</p>, 
            },
            {
                title: 'Ubi Tanque',
                dataIndex: '_id',
                render: text => <p>{text.existeTanque}</p>, 
            },
            {
                title: 'ultimRevTotal',
                dataIndex: '_id',
                render: text => <p>{text.ultimRevTotal}</p>, 
            },
            {
                title: 'propiedad',
                dataIndex: '_id',
                render: text => <p>{text.propiedad}</p>, 
            },
            {
                title: 'punto',
                dataIndex: '_id',
                render: text => <p>{text.punto}</p>, 
            },
            {
                title: 'usuario',
                dataIndex: '_id',
                render: text => <p>{text.usuario}</p>, 
            },
            {  
                title: 'Codt',
                dataIndex: '_id',
                render: text => <p>{text.codt}</p>,    
            },
            {  
                title: 'Alertas',
                dataIndex: 'data',
                render: text => <div>
                    {
                        text.map((e2, key2)=>{
                            return (
                                <>
                                <div style={{padding:5, backgroundColor: e2.activo ?"#F96D6C" :"white" }} key={key2}>
                                    <p style={{color:e2.activo&&"white" }} >{e2.texto}</p>
                                    {e2.cerrado &&<p>{e2.cerrado}</p>}
                                </div>
                                <div style={ {width:"100%"}}></div>
                                </>
                            )
                        })
                    }
                </div>,
            },
            
            
            
        ];
        
        let tanquesFiltro = tanques.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        console.log(terminoBuscador)
        return (<Table columns={columns} dataSource={tanquesFiltro}   />)
    }
    return( 
        <Space direction="vertical">
            <section style={{padding:"20px 5px"}}> 
           
            {/* <Button style={{backgroundColor:"#00218b"}} onClick={()=>this.handleSubmit()}>Guardar</Button> */}
            </section>
            <section>
                <Search placeholder="Buscar registro" onSearch={value => setTerminoBuscador(value)} enterButton />
                {/* <input placeholder="Buscar registro" onChange={(e)=>setTerminoBuscador(e.target.value)} /> */}
            </section> 
            {renderTable()}
        </Space>
    )
}
  
export default Tanque


