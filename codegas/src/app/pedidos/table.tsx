'use client' 
import { Fragment, useEffect, useState } from 'react';
import { TableRow, TableCell, Box, Collapse, Table, TableBody, TableHead, Typography, Button, TableContainer, Paper, Checkbox } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {KeyboardArrowDown, KeyboardArrowUp} from '@mui/icons-material';
import Image from "next/image"
import moment from "moment"
import {colors} from "../utils/colors"
import {Date} from "../components/date"
import {UpdateDatePedido, UpdateStatePedido} from "./fetchPedido"
import {Snack} from "../components/snackBar"
import {AlertDialog} from "../components/alertDialog"
import {SelectState} from "../components/selecState"
import Link from 'next/link';

const {espera, noentregado, innactivo, activo, asignado, otro} = colors

const RenderPedidos = ({_id, codt, razon_social, cedula, direccion, creado, fechasolicitud, 
  fechaentrega, forma, kilos, valorunitario, placa, novedades, estado, entregado, imagencerrar, addValues}: any) => {
    const [open, setOpen] = useState(false);
    const [showSnack, setShowSnack] = useState(false);
    const [message, setMessage] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [newFechaEntrega, setFechaEntrega] = useState(fechaentrega)
    const [newEstado, setNewEstado] = useState(estado)
    const updateDate = async (id: any, date: any) => {
      const {status} = await UpdateDatePedido(id, date)
      if (status) {
      setShowSnack(true)
      setMessage("Fecha Actualizada")
      setFechaEntrega(date)
      }
  }

  const updateStatus = async (id: any, state: any) => {
    const {status} = await UpdateStatePedido(id, state)
    if (status) {
      setShowSnack(true)
      setMessage(`estado ${state} cambiado!`)
      setNewEstado(state)
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
          <Checkbox
            onChange={()=>addValues(_id, fechaentrega)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </TableCell>
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
          <Button variant="contained">
            <Link href={`pedidos/${_id}/${moment(newFechaEntrega).format('YYYY-MM-DD')}`} style={{color: "#ffffff", textDecoration: 'none'}}>
              {placa ?placa :"Sin Placa"}
            </Link>
          </Button>
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
        {imagencerrar &&<Image src={imagencerrar} alt="codegas colombia" width={200} height={500}/> }
      </AlertDialog>
    </Fragment>
  )
}
export default function RenderTable({data}: any) {
 
  const [newData, setNewData] = useState(data)
  const [valorWithArray, setValorWithArray] = useState([])
  const [newValorWithArray, setNewValorWithArray] = useState()

  const addValues = (id: any, newFechaEntrega: any) => {
    const index = valorWithArray.some(({ _id }) => _id === id);
    if (!index) {
      setValorWithArray((state) => [...state, {id, newFechaEntrega}])
    }else{
      setValorWithArray(valorWithArray.filter(({_id})=> {return _id !== id})) 
    }
  }
  useEffect(()=> {
    let data = ''
    for(let i=0; i<valorWithArray.length; i ++){
      data += valorWithArray[i].id
      data += ','
    }
    setNewValorWithArray(data)
  }, [valorWithArray])
  
  return (
    <TableContainer component={Paper}>
      <Button variant="contained"  sx={{ marginTop: 1, marginLeft: 1 }}>
        <Link 
          href={`pedidos/${newValorWithArray}/${moment().format('YYYY-MM-DD')}`} 
          style={{
            color: "#ffffff", 
            textDecoration: 'none'
          }}
        >
          Vehiculos
        </Link>
      </Button>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">&nbsp;</TableCell>
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
          { newData.map((row: any, index: any): any => <RenderPedidos key={index} {...row} addValues={addValues} />) }
        </TableBody>
      </Table>
    
    </TableContainer>    
  )
  
}

