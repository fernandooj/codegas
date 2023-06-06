import React from 'react';
import {RenderCrearTanque} from "./renderTanque"

const ACCESS = 'cliente'
const LIMIT = 10
export default function Tanque({searchParams}: any) { 
    let {page, search} = searchParams
    page = page || 0 
    return (
        <RenderCrearTanque 
            start={page} 
            search={search}
            limit={LIMIT}
            access={ACCESS}
        /> 
    )
}