'use client'
import { Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Breadcrumbs, Typography } from "@mui/material"
import Link from "next/link"
import {RenderVehiculos} from "./renderVehiculos"

export default function vehiculos({params}: any){
  return(
    <TableContainer component={Paper}>
      <Breadcrumbs aria-label="breadcrumb" sx={{padding: "15px"}}>
        <Link style={{color: "#a2a1a1"}}  href="/pedidos">
          Pedidos
        </Link>
        <Typography color="#a2a1a1"> Pedido N {params.idPedido}</Typography>
      </Breadcrumbs>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">&nbsp;</TableCell>
            <TableCell align="center">Avatar</TableCell>
            <TableCell align="center">Id</TableCell>
            <TableCell align="center">Placa</TableCell>
            <TableCell align="center">Centro</TableCell>
            <TableCell align="center">Nombre</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <RenderVehiculos {...params} />
        </TableBody>
      </Table>
    </TableContainer>   
  )  
}