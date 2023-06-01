'use client' 
import { Fragment, useState } from 'react';
import { TableRow, TableCell, Box, Collapse, Button, Typography, Paper, Table, TableBody, TableContainer, TableHead } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {KeyboardArrowDown, KeyboardArrowUp} from '@mui/icons-material';
 
import { PaginationTable } from "../components/pagination/pagination";
 
const RenderRevision = ({_id, codt, razon_social, barrio, m3, nComodatoText, direccion, tanqueid, dpto, ciudad, usuariosAtendidos, poblado, lote, sector, ubicacion}: any) => {
  const [open, setOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  return (
    <Fragment> 
      <TableRow
        key={_id}
      >
        <TableCell align="center" component="th">
         <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
          {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th">{_id}</TableCell>
        <TableCell align="center">{codt}</TableCell>
        <TableCell align="center">{razon_social}</TableCell>
        <TableCell align="center">{barrio}</TableCell>
        <TableCell align="center">{m3}</TableCell>
        <TableCell align="center">{nComodatoText} </TableCell>
        <TableCell align="center">{direccion} </TableCell>
        <TableCell align="center">
            <Button variant="contained" onClick={()=>setShowDialog(true)} color='error'>
              {tanqueid.length}
            </Button>
        </TableCell>
        <TableCell align="center">
          <Button variant="contained" onClick={()=>setShowDialog(true)}>Detalle</Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Datos adicionales
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Usuarios At.</TableCell>
                      <TableCell align="center">Poblado</TableCell>
                      <TableCell align="center">Dpto</TableCell>
                      <TableCell align="center">Ciudad</TableCell>
                      <TableCell align="center">Lote</TableCell>
                      <TableCell align="center">Sector</TableCell>
                      <TableCell align="center">Ubicación</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center">{usuariosAtendidos}</TableCell>
                      <TableCell align="center">{poblado}</TableCell>
                      <TableCell align="center">{dpto}</TableCell>
                      <TableCell align="center">{ciudad}</TableCell>
                      <TableCell align="center">{lote}</TableCell>
                      <TableCell align="center">{sector}</TableCell>
                      <TableCell align="center">{ubicacion}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

export default function RenderTable({revision}: any) {
  return(
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
            <TableCell align="center">&nbsp;</TableCell>
            <TableCell align="center">N Revisión</TableCell>
            <TableCell align="center">Codt</TableCell>
            <TableCell align="center">Usuario</TableCell>
            <TableCell align="center">Barrio</TableCell>
            <TableCell align="center">M 3</TableCell>
            <TableCell align="center">N Como.</TableCell>
            <TableCell align="center">Punto</TableCell>
            <TableCell align="center">Tanques</TableCell>
            <TableCell align="center">&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {
            revision.map((e: any, key: string)=> (<RenderRevision {...e} key={key} /> ))
          }
          
        </TableBody>
      </Table>
      <PaginationTable total={50} />
    </TableContainer>
  )
}

