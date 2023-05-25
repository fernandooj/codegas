'use client';
import React, { ReactElement, useContext, useState } from 'react';
import { Table, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import { redirect } from 'next/navigation';
import {DataContext} from "../context/context"
import { RenderPedidos } from './renderPedido'; 
import { PaginationTable } from "../components/pagination";

const Pedidos = ({searchParams}): ReactElement => {
  let {page} = searchParams
  page = page || 1 
  const {user}: any = useContext(DataContext)
  // if(!user) redirect('/')

  return(
    <TableContainer component={Paper}>
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
        <RenderPedidos page={page} /> 
        </TableBody>
      </Table>
      <PaginationTable />
    </TableContainer>    
  )
}

export default Pedidos
 