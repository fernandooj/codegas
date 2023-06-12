'use client'
import React, { ReactElement, useContext } from 'react';
import { RenderPedidos } from './renderPedido'; 
import { PaginationTable } from "../components/pagination/pagination";
import InputSearch from "../components/search/search"
import {DataContext} from "../context/context"

const Pedidos = ({searchParams}: any): ReactElement => {
  let {page, search} = searchParams
  page = page || 0 
  const {idUser, acceso}: any = useContext(DataContext)
  return(
    <>
      <InputSearch search={search} />
      {RenderPedidos({page, search, idUser, acceso})}
      <PaginationTable total={30} />
    </>
  )
}

export default Pedidos
 