import React from 'react';
import {RenderCrearTanque} from "./renderTanque"

const ACCESS = 'clientes'
const LIMIT = 10

export default function Tanque({searchParams}: any) { 
    let {page, search, tanqueId, userId} = searchParams
    page = page || 0
    return RenderCrearTanque({userId, tanqueId, page, search, limit: LIMIT, access: ACCESS})
}
