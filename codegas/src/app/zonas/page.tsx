'use client';
import React, { ReactElement, useMemo, useContext, useEffect, useState } from 'react';
import { Table, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Autocomplete, TextField} from '@mui/material';

import { usePathname, useRouter } from 'next/navigation';
import {DataContext} from "../context/context"
import { RenderZonasUsers } from './renderZonasUsers'; 
import { PaginationTable } from "../components/pagination/pagination";
import InputSearch from "../components/search/search"

const Zona = ({searchParams}): ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const [total, setTotal] = useState(20)
  const [idZona, setIdZona] = useState(1)
  const [zonasData, setZonas] = useState([]);
  const [type, setType] = useState('BySearch')
  let {page, search} = searchParams
  const limit =10
  page =10
  search=''
  const {user}: any = useContext(DataContext)
  // if(!user) redirect('/')
 
  return(
    <TableContainer component={Paper}>
      <InputSearch />
        
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">&nbsp;</TableCell>
              <TableCell align="center">Zona</TableCell>
              <TableCell align="center">Codt</TableCell>
              <TableCell align="center">Razon Social</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Valor Unitario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          <RenderZonasUsers 
            limit={limit} 
            page={page} 
            idZona={idZona}
            type={type}
            search={search}
 
          />
        </TableBody>
      </Table>
      <PaginationTable total={total} />
    </TableContainer>    
  )
}

export default Zona
 