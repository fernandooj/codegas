import React, {useState, useEffect} from "react"
import axios from "axios" 
import { Table, Modal, Button, Space, notification, Card, Input, Descriptions } from 'antd'; 
import {createFilter} from 'react-search-input'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


const KEYS_TO_FILTERS = ["nControl", "barrio",  "lote", 'm3t', 'usuariosAtendidos'] 
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

// const pdf=(data)=>{ 
//     data = data ?data :[]
//     return data.map((e, key)=>{
        
//         return(
//             <a src={img2} style={{width:"40px", float:"left"}} />
//         )
//     })
// }


const Revision =()=>{ 
    const [revision, setRevision] = useState([])
    const [detalleRev, setDetalleRev] = useState({})
    const [modal, setModal] = useState(false)
    const [terminoBuscador, setTerminoBuscador] = useState("")
    useEffect(() => { 
        axios.get("rev/revision") 
        .then(res=>{
            console.log(res.data.revision) 
            setRevision(res.data.revision) 
        }) 
        .catch(err=>{
            console.log(err) 
        }) 
    }, [])   
   
    const renderModal=()=>{
        let lat = detalleRev.coordenadas &&detalleRev.coordenadas.coordinates[0]
        let lng = detalleRev.coordenadas &&detalleRev.coordenadas.coordinates[1]
        return(
            <Modal
                title="Detalles Revisión"
                visible={modal}
                footer={null}
                onCancel={()=>setModal(false)}
            >  
                <Descriptions title="Revision">
                    <Descriptions.Item label="N Control">{detalleRev.nControl}</Descriptions.Item>
                    <Descriptions.Item label="dep Tecnico">{detalleRev.depTecnicoEstado}</Descriptions.Item>
                    <Descriptions.Item label="accesorios">{detalleRev.accesorios ?"Si" :"No"}</Descriptions.Item>
                    {detalleRev.avisos &&<Descriptions.Item label="avisos">{detalleRev.avisos ?"Si" :"No"}</Descriptions.Item>}
                    {detalleRev.distancias &&<Descriptions.Item label="distancias">{detalleRev.distancias ?"Si" :"No"}</Descriptions.Item>}
                    {detalleRev.electricas &&<Descriptions.Item label="electricas">{detalleRev.electricas ?"Si" :"No"}</Descriptions.Item>} 
                    {detalleRev.extintores &&<Descriptions.Item label="extintores">{detalleRev.extintores ?"Si" :"No"}</Descriptions.Item>}
                    {detalleRev.observaciones!="undefined" &&<Descriptions.Item label="observaciones">{detalleRev.observaciones ?detalleRev.observaciones :""}</Descriptions.Item>}
                    <Descriptions.Item label="Lat">{lat}</Descriptions.Item>
                    <Descriptions.Item label="Lng">{lng}</Descriptions.Item>
                    {/* <Descriptions.Item label="Mapa"><a target="blank" href={`https://www.google.com/maps/@${lng},${lat},18z`}>Ver en Mapa</a></Descriptions.Item> */}
                    <Descriptions.Item label="Mapa"><a target="blank" href={`https://www.google.com/maps/dir//${lng},${lat}/@${lng},${lat},18z/data=!4m2!4m1!3e0`}>Ver en Mapa</a></Descriptions.Item>
                </Descriptions>
                <Card title="Isometrico" bordered={false} style={{ width: 300 }}> 
                    {imagen(detalleRev.isometrico)}
                </Card>
                <Card title="Otros Comodato" bordered={false} style={{ width: 300 }}> 
                    {imagen(detalleRev.otrosComodato)}
                </Card>
                <Card title="Soporte Entrega" bordered={false} style={{ width: 300 }}> 
                    {imagen(detalleRev.soporteEntrega)}
                </Card>
                <Card title="visual Instalacion" bordered={false} style={{ width: 300 }}> 
                    {imagen(detalleRev.visual)}
                </Card>
                <Card title="Visual Gasoequipos" bordered={false} style={{ width: 300 }}> 
                    {imagen(detalleRev.puntoConsumo)}
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
    const buscarRevision =(id)=>{
        axios.get(`rev/revision/byId/${id}`)
        .then(res => {
            const {revision} = res.data
            console.log(res.data)
            setDetalleRev(revision)
            setModal(true)
        })
    }

    const renderTable=()=>{
        const columns = [ 
            { 
                title: 'N Revisión',
                dataIndex: 'nControl', 
            },
            {  
                title: 'Codt',
                dataIndex: 'usuarioId',
                render: text => <p>{text &&text.codt}</p>,    
            },
            {
                title: 'usuario', 
                dataIndex: 'usuarioId',
                render: text => <p>{text &&text.razon_social}</p>, 
            },
            {
                title: 'barrio',
                dataIndex: 'barrio',
            },
            {
                title: 'm3',
                dataIndex: 'm3',
            },
            {
                title: 'N Com.',
                dataIndex: 'nComodatoText',  
            },
            {
                title: 'Usuarios At.',
                dataIndex: 'usuariosAtendidos',
            },
            {
                title: 'poblado',
                dataIndex: 'poblado',
            },
           
           
            {
                title: 'punto',
                dataIndex: 'puntoId',
                render: text => <p>{text &&text.direccion}</p>, 
            },
            {
                title: 'punto',
                dataIndex: '_id',
                render: text => <Button type="primary" onClick={()=>buscarRevision(text)}>Detalle</Button>, 
            },
        ]; 
        
        let revisionFiltro = revision.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        return (<Table columns={columns} dataSource={revisionFiltro}   />)
    }
    return( 
        <Space direction="vertical">
            {renderModal()}
            <section style={{padding:"20px 5px"}}> 
           
            {/* <Button style={{backgroundColor:"#00218b"}} onClick={()=>this.handleSubmit()}>Guardar</Button> */}  
            </section>
            <section>
                <Search placeholder="Buscar registro" onSearch={value => setTerminoBuscador(value)} enterButton />
            </section> 
            {renderTable()}
        </Space>
    )
}
  
export default Revision


