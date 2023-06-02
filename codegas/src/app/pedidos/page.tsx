'use client'
import React, { ReactElement, useState } from 'react';
import { RenderPedidos } from './renderPedido'; 
import { PaginationTable } from "../components/pagination/pagination";
import InputSearch from "../components/search/search"

const Pedidos = ({searchParams}: any): ReactElement => {
  let {page, search} = searchParams
  page = page || 0 
  return(
    <>
      <InputSearch search={search} />
        <RenderPedidos page={page} search={search} />
      <PaginationTable total={30} />
    </>
  )
}

export default Pedidos
 