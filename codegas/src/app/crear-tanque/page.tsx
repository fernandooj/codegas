import React from 'react';
import {RenderCrearTanque} from "./renderTanque"

const ACCESS = 'cliente'
const LIMIT = 10
export default function Tanque({searchParams}: any) { 
    let {page, search, tanqueId} = searchParams
    page = page || 0 
    return (
        <RenderCrearTanque
            tanqueId={tanqueId}
            start={page} 
            search={search}
            limit={LIMIT}
            access={ACCESS}
        /> 
    )
}