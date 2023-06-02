import React from 'react';
import {RenderCrearPedido} from "./render-crear-pedido"

export default function SignUp({searchParams}: any) { 
    const {idUser} = searchParams
    return <RenderCrearPedido idUser={idUser} /> 
}