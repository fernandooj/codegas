import React from 'react';
import {RenderCrearTanque} from "./renderTanque"

const ACCESS = 'clientes'
const LIMIT = 10
export default function Tanque({searchParams}: any) { 
    let {page, search, tanqueId, idUser} = searchParams
    page = page || 0 
    console.log(searchParams)
    return (
        <RenderCrearTanque
            idUser={idUser}
            tanqueId={tanqueId}
            start={page} 
            search={search}
            limit={LIMIT}
            access={ACCESS}
        /> 
    )
}