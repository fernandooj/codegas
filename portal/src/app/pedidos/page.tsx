'use client'
import React, { ReactElement, useContext } from 'react';
import { RenderPedidos } from './renderPedido'; 

import InputSearch from "../components/search/search"
import {DataContext} from "../context/context"

const Pedidos = ({searchParams}: any): ReactElement => {
  let {page, search} = searchParams
  page = page || 0 
  const {idUser, acceso}: any = useContext(DataContext)
  console.log({idUser, acceso, plus:"+"})

  return(
    <>
      <InputSearch search={search} />
      {RenderPedidos({page, search, idUser, acceso})}
    </>
  )
}

export default Pedidos
 