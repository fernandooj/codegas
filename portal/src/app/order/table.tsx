'use client' 
import { Fragment, useState, useEffect } from 'react';
import { TableRow, TableCell, Box, Collapse, Button, Checkbox, Paper, Table, TableBody, TableContainer, TableHead, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import moment from "moment"
import {KeyboardArrowDown, KeyboardArrowUp} from '@mui/icons-material';
import Link from 'next/link';
import {SelectState} from "../components/selecState"
import {colors} from "../utils/colors"
import { PaginationTable } from "../components/pagination/pagination";
import {UpdateDatePedido, UpdateStatePedido} from "../store/fetch-pedido"
import {Date} from "../components/date"
import {Snack} from "../components/snackBar"
import {AlertDialog} from "../components/alertDialog/alertDialog"
import Image from "next/image"

const {espera, noentregado, innactivo, activo, asignado, otro} = colors

const RenderTanques = ({_id, codt, razon_social, cedula, direccion, creado, fechasolicitud, 
  fechaentrega, forma, kilos, valorunitario, placa, novedades, estado, entregado, imagencerrar, addValues}: any) => {
  const [open, setOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [newEstado, setNewEstado] = useState(estado)
  const [showSnack, setShowSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [newFechaEntrega, setFechaEntrega] = useState(fechaentrega)
  const background=newEstado=="espera" ?espera :newEstado=="noentregado" ?noentregado :newEstado=="innactivo" ?innactivo :newEstado=="activo" &&!placa && !entregado ?activo :newEstado=="activo" && !entregado ?asignado :otro
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
  return (
    <Fragment> 
      <TableRow
            key={_id}
            sx={{ 
              background
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
                :<Date setValueDate={(e: any) =>{ updateDate(_id, e), setFechaEntrega(e)}} />
              }
            </TableCell>
            <TableCell align="center">
              <SelectState newEstado={newEstado} setNewEstado={(e: any)=>{setNewEstado(e), updateStatus(_id, e)}} />
            </TableCell>
            <TableCell align="center">
              <Button variant="contained">
                <Link href={`order/${_id}/${moment(newFechaEntrega).format('YYYY-MM-DD')}`} style={{color: "#ffffff", textDecoration: 'none'}}>
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

export default function RenderTable({tanques}: any) {
  const [valorWithArray, setValorWithArray] = useState<{ id: any; newFechaEntrega: any }[]>([]);
  const [newValorWithArray, setNewValorWithArray] = useState<string | undefined>();

  const addValues = (id: any, newFechaEntrega: any) => {
    const index = valorWithArray.some(({ id: _id }) => _id === id);
    if (!index) {
      setValorWithArray((state) => [...state, { id, newFechaEntrega }]);
    } else {
      setValorWithArray(valorWithArray.filter(({ id: _id }) => _id !== id));
    }
  };
  useEffect(()=> {
    let data = ''
    for(let i=0; i<valorWithArray.length; i ++){
      data += valorWithArray[i].id
      data += ','
    }
    setNewValorWithArray(data)
  }, [valorWithArray])

  return(
    <TableContainer component={Paper}>
      {
        newValorWithArray
        &&<Button variant="contained"  sx={{ marginTop: 1, marginLeft: 1 }}>
          <Link 
            href={`order/${newValorWithArray}/${moment().format('YYYY-MM-DD')}`} 
            style={{
              color: "#ffffff", 
              textDecoration: 'none'
            }}
          >
            Vehiculos
          </Link>
        </Button>
      }
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
          {
            tanques.map((e: any, key: string)=> (<RenderTanques {...e} key={key} addValues={addValues} /> ))
          }
          
        </TableBody>
      </Table>
      <PaginationTable total={tanques[0]?.total ?? 0} />
    </TableContainer>
  )
}

