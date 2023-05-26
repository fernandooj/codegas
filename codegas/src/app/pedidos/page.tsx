'use client';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Table, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody} from '@mui/material';

import { usePathname, useRouter } from 'next/navigation';
import {DataContext} from "../context/context"
import { RenderPedidos } from './renderPedido'; 
import { PaginationTable } from "../components/pagination/pagination";
import InputSearch from "../components/search/search"

const Pedidos = ({searchParams}): ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const [total, setTotal] = useState(20)
  let {page, search} = searchParams
  page = page || 0
  search = search || ''
  const {user}: any = useContext(DataContext)
  // if(!user) redirect('/')
  useEffect(()=>{
    // router.push(`${pathname}?search=${search}&page=${page}`);
  }, [])

  return(
    <TableContainer component={Paper}>
      <InputSearch />
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">&nbsp;</TableCell>
              <TableCell align="center">N pedido</TableCell>
              <TableCell align="center">Codt</TableCell>
              <TableCell align="center">Razon Social</TableCell>
              <TableCell align="center">F Entrega</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Placa</TableCell>
              <TableCell align="center">Obervacion</TableCell>
              <TableCell align="center">Imagen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          <RenderPedidos page={page} search={search} />
        </TableBody>
      </Table>
      <PaginationTable total={total} />
    </TableContainer>    
  )
}

export default Pedidos
 