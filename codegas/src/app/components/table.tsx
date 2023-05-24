'use client' 
import { Fragment, useState } from 'react';
import { TableRow, TableCell, Box, Collapse, Table, TableBody, TableHead, Typography, Button, TableContainer } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {KeyboardArrowDown, KeyboardArrowUp} from '@mui/icons-material';
import Image from "next/image"
import moment from "moment"
import {colors} from "../utils/colors"
import {Date} from "./date"
import {UpdateDatePedido, addCarPedido, UpdateStatePedido} from "../pedidos/fetchPedido"
import {Snack} from "./snackBar"
import {AlertDialog} from "./alertDialog"
import {SelectState} from "./selecState"
import {RenderVehiculosDialog} from "../pedidos/renderVehiculosDialog"
const {espera, noentregado, innactivo, activo, asignado, otro} = colors
export default function RenderTable({data}: any) {
  const {_id, codt, razon_social, cedula, direccion, creado, fechasolicitud, fechaentrega, forma, kilos, valorunitario, placa, novedades, estado, entregado, imagencerrar } = data
  const [open, setOpen] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [newFechaEntrega, setFechaEntrega] = useState(fechaentrega)
  const [newEstado, setNewEstado] = useState(estado)

  const updateDate = async (id, date) => {
      const {status} = await UpdateDatePedido(id, date)
      if (status) {
      setShowSnack(true)
      setMessage("Fecha Actualizada")
      setFechaEntrega(date)
      }
  }

  const updateStatus = async (id, state) => {
    const {status} = await UpdateStatePedido(id, state)
    if (status) {
      setShowSnack(true)
      setMessage(`estado ${state} cambiado!`)
      setNewEstado(state)
    }
  }
  const asignCar = async (id, date) => {
    const {status} = await addCarPedido(id, date)
    if (status) {
    setShowSnack(true)
    setMessage(`Carro ${placa} agregado!`)
    setNewEstado(date)
    }
  }

  return(
    <Fragment>
      <TableRow
        key={_id}
        sx={{ 
          background: newEstado=="espera" ?espera :newEstado=="noentregado" ?noentregado :newEstado=="innactivo" ?innactivo :newEstado=="activo" &&!placa && !entregado ?activo :newEstado=="activo" && !entregado ?asignado :otro
        }}
      >
        <TableCell align="center">
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
        <TableCell align="center">
          {
            newFechaEntrega 
            ?moment(newFechaEntrega).format('YYYY-MM-DD')
            :<Date setValueDate={(e) => updateDate(_id, e)} />
          }
        </TableCell>
        <TableCell align="center">
          <SelectState newEstado={newEstado} setNewEstado={(e)=>updateStatus(_id, e)} />
        </TableCell>
        <TableCell align="center">
          <Button variant="contained" onClick={()=>setShowDialog(true)}>{placa ?placa :"Sin Placa"}</Button>
        </TableCell>
        <TableCell align="center">
          {novedades &&<Button variant="contained">Si</Button>}
        </TableCell>
        <TableCell align="center">
          {imagencerrar &&<Button variant="contained" onClick={()=>setShowDialog(true)}>Si</Button>}
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
                    <TableCell align="center">F. Solicitud</TableCell>
                    <TableCell align="center">Solicitud</TableCell>
                    <TableCell align="center">Kilos</TableCell>
                    <TableCell align="center">Valor</TableCell>
                    <TableCell align="center">Cedula</TableCell>
                    <TableCell align="center">Direccion</TableCell>
                    <TableCell align="center">F Creación</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" align="center">
                      {fechasolicitud}
                    </TableCell>
                    <TableCell align="center">{forma}</TableCell>
                    <TableCell align="center">{kilos}</TableCell>
                    <TableCell align="center">{valorunitario}</TableCell>
                    <TableCell align="center">{cedula}</TableCell>
                    <TableCell align="center">{direccion}</TableCell>
                    <TableCell align="center">{moment(creado).format('YYYY-MM-DD HH:mm')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Snack show={showSnack} setShow={()=>setShowSnack(false)} message={message} />
       
      <AlertDialog showDialog={showDialog} setShowDialog={()=>setShowDialog(false)}>
        {/* {imagencerrar &&<Image src={imagencerrar} alt="codegas colombia" width={200} height={500}/> } */}
        <RenderVehiculosDialog />
      </AlertDialog>
    </Fragment>
  )
}

