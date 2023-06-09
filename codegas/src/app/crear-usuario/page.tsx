import React from 'react';
import {RenderUsers} from "./renderUsers"

const ACCESS = 'administradores'
const LIMIT = 20

export default function SignUp({searchParams}) { 
    let {page, search} = searchParams
    page = page || 0
    
    return (
        <RenderUsers 
            start={page} 
            search={search}
            limit={LIMIT}
            access={ACCESS}
        /> 
    )
}