import React from 'react';
import {RenderCrearPedido} from "./render-crear-pedido"

export default function CreatePedido({searchParams}: any) { 
    const {idUser} = searchParams
    return <RenderCrearPedido idUser={idUser} /> 
}