import React, {useState, useEffect} from "react"
import axios from "axios" 
import { Table, Modal, Button, Space, Descriptions, Card, Input, InputNumber } from 'antd'; 
import {createFilter} from 'react-search-input'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const KEYS_TO_FILTERS = ["_id.capacidad", "_id.placaText",  "_id.razon_social", '_id.codt'] 
const { Search } = Input;


const imagen=(data)=>{ 
    data = data ?data :[]
    return data.map((e, key)=>{
        let img2 = e.split("-")
        img2 = `${img2[0]}Resize${img2[2]}`
        return(
            <Zoom key={key}>
                <img src={img2} style={{width:"40px", float:"left"}} />
            </Zoom>
        )
    })
}

const Tanque =()=>{
    const [tanques, setTanques] = useState([])
    const [tanque,  setTanque]  = useState({})
    const [modal,   setModal]   = useState(false)
    const [terminoBuscador, setTerminoBuscador] = useState("")
    useEffect(() => {
        axios.get("tan/tanque/web") 
        .then(res=>{
            setTanques(res.data.tanque)
        })
        .catch(err=>{
            console.log(err)
        })  
    }, [])   

    const searchTanque=(tanqueId)=>{
        console.log(tanqueId)
        axios.get(`tan/tanque/byId/${tanqueId._id}`)
        .then(res => {
            const {tanque} = res.data   
            setTanque(tanque)
            setModal(true)
        }) 
    }
    const renderModal=()=>{
 
        return(
            <Modal
                title="Detalles Tanque"
                visible={modal}
                footer={null}
                onCancel={()=>setModal(false)}
            >  
                <Descriptions title="Tanque">
                    <Descriptions.Item label="Ano Fabricación">{tanque.placaText}</Descriptions.Item>
                    <Descriptions.Item label="Fabricante">{tanque.fabricante}</Descriptions.Item> 
                </Descriptions>
                <Card title="Placa" bordered={false} style={{ width: 300 }}> 
                    {imagen(tanque.placa)}
                </Card>
                <Card title="Placa Fabricante" bordered={false} style={{ width: 300 }}> 
                    {imagen(tanque.placaFabricante)}
                </Card>
                <Card title="Placa Mantenimiento" bordered={false} style={{ width: 300 }}>  
                    {imagen(tanque.placaMantenimiento)}
                </Card>
                <Card title="visual" bordered={false} style={{ width: 300 }}> 
                    {imagen(tanque.visual)}
                </Card>
                
                
                {/* <Card title="Protocolo llenado" bordered={false} style={{ width: 300 }}> 
                    {imagen(detalleRev.puntoConsumo)}
                </Card> 
                <Card title="Hoja Seguridad" bordered={false} style={{ width: 300 }}> 
                    {imagen(detalleRev.puntoConsumo)}
                </Card> 
                <Card title="Visual Gasoequipos" bordered={false} style={{ width: 300 }}> 
                    {imagen(detalleRev.puntoConsumo)}
                </Card> 
                <Card title="Visual Gasoequipos" bordered={false} style={{ width: 300 }}> 
                    {imagen(detalleRev.puntoConsumo)}
                </Card>  */}
            </Modal>
        )
    }
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
                title: 'Fecha Mto',
                dataIndex: '_id',
                render: text => <p>{text.fechaUltimaRev}</p>, 
                
            },
            {
                title: 'Placa Man.',
                dataIndex: '_id',
                render: text => <p>{text.nPlaca}</p>, 
                
            },
            // {
            //     title: 'codigoActivo',
            //     dataIndex: '_id',
            //     render: text => <p>{text.codigoActivo}</p>, 
                
            // },
            {
                title: 'serie',
                dataIndex: '_id',
                render: text => <p>{text.serie}</p>, 
                
            },
            {
                title: 'Año Fab.',
                dataIndex: '_id',
                render: text => <p>{text.anoFabricacion}</p>, 
            },
            {
                title: 'Ubicación Tan.',
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
                                <section key={key2}>
                                <div style={{padding:5, backgroundColor: e2.activo ?"#F96D6C" :"white" }} key={key2}>
                                    <p style={{color:e2.activo&&"white" }} >{e2.texto}</p>
                                    {e2.cerrado &&<p>{e2.cerrado}</p>}
                                </div>
                                <div style={ {width:"100%"}}></div>
                                </section>
                            )
                        })
                    }
                </div>,
            },
            {
                title: 'Detalle',
                dataIndex: '_id',
                render: text => <Button type="primary" onClick={()=>searchTanque(text)}>Detalle</Button>,  
            }, 
        ];
        let tanquesFiltro = tanques.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        console.log(terminoBuscador)
        return (<Table columns={columns} dataSource={tanquesFiltro}   />)
    }
   
    return( 
        <Space direction="vertical">
            {renderModal()}
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


