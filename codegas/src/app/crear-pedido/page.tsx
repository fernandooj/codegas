import React from 'react';
import {RenderCrearPedido} from "./render-crear-pedido"

const ACCESS = 'clientes'
const LIMIT = 10
export default function CreatePedido({searchParams}: any) { 
    let {page, search, idUser} = searchParams
    page = page || 0
    return (
        <RenderCrearPedido 
            idUser={idUser}
            start={page} 
            search={search}
            limit={LIMIT}
            access={ACCESS}
        /> 
    )
}