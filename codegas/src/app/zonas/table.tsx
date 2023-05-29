'use client' 
import { useEffect, useState } from 'react';
import { TableRow, TableCell, Checkbox, FormControl, InputLabel, InputAdornment, OutlinedInput, Paper, Table, TableBody, TableContainer, TableHead } from '@mui/material';
import {Snack} from "../components/snackBar"
import {ChangeValorUnitario, ChangeValorUnitarioAll} from "./fetchZona"
import { PaginationTable } from "../components/pagination/pagination";
import InputZones from '../components/input_zones/input_zones';


const RenderZonas = ({zona, updateValor, addValues}: any) => {
  return ( 
    zona.map(({_id, codt, razon_social, nombrezona, nombre, valorunitario, idcliente, isCheked}: any)=> {
    return (
      <TableRow
        key={_id}
      >
        <TableCell component="th" scope="row" align="center">
          <Checkbox
            checked={isCheked ?isCheked :false}
            onChange={()=>addValues(idcliente, valorunitario)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </TableCell>
        <TableCell align="center" component="th">{nombrezona}</TableCell>
        <TableCell align="center">{codt}</TableCell>
        <TableCell align="center">{razon_social}</TableCell>
        <TableCell align="center">{nombre}</TableCell>
        <TableCell align="center">
          <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Valor Uni</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Amount"
            defaultValue={valorunitario}
            onKeyPress={(e)=>{updateValor(e, idcliente, nombre)}}
          />
          </FormControl>
        </TableCell>
      </TableRow>
    )})
  )
}
export default function RenderTable({zona}: any) {
  const [showSnack, setShowSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [valorWithArray, setValorWithArray] = useState([])
  const [newValorUnitario, setNewValorUnitario] = useState({})
  const [newZona, setNewZona] = useState(zona)
  const updateValor = async (event: any, idcliente: any, nombre: any) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const {status} = await ChangeValorUnitario(Number(event.target.value), idcliente)
      if (status) {
        setShowSnack(true)
        setMessage(`Valor Unitario Actualizado al cliente: ${nombre}`)
      }
    }
  }
  const addValues = (id: any, valorunitario: number) => {
    const index = valorWithArray.some(({ _id }) => _id === id);
    if (!index) {
      setValorWithArray((state) => [...state, {_id: id, valorunitario}])
    }else{
      setValorWithArray(valorWithArray.filter(({_id})=> {return _id !== id})) 
    }
  } 
 

  useEffect(() => {
    const {value, replace, type}: any = newValorUnitario
 
    const data = valorWithArray.map(({_id, valorunitario}: any)=>{
      const newValue = type==="porcentege" || type==undefined ? valorunitario +((valorunitario*Number(value))/100) : valorunitario+Number(value)
      return {
        _id,
        valorUnitario: replace ?Number(replace) :Math.round(parseFloat(newValue))
      }
    })
 
    if( value || replace|| type ) saveData(data)
  }, [newValorUnitario])

  const saveData = async (data: any) => {
    const {status} = await ChangeValorUnitarioAll(data)
    if (status) {
      setShowSnack(true)
      setMessage("Valor Unitario actualizado")
    }
  }

  const addValuesAll = async (event: any) => {
    const data = newZona.map((e: any)=>{
      return{
        ...e,
        _id: e.idcliente,
        isCheked: event.target.checked  
      }
    })
    if(event.target.checked) setValorWithArray(data)
    if(!event.target.checked) setValorWithArray([])
    setNewZona(data)
  }

  const validateIfIsSelectd = (e: any) => {
    if(valorWithArray.length===0){
      setShowSnack(true)
      setMessage("Selecciona al menos una fila!!!")
    }else{
      setNewValorUnitario(e)
    }
      
  }
  return(
    <TableContainer component={Paper}>
      <InputZones onSend={validateIfIsSelectd} />
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Checkbox
                  onChange={addValuesAll}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </TableCell>
              <TableCell align="center">Zona</TableCell>
              <TableCell align="center">Codt</TableCell>
              <TableCell align="center">Razon Social</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Valor Unitario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          <RenderZonas 
            zona={newZona} 
            updateValor={updateValor} 
            addValues={addValues} 
          />
        </TableBody>
      </Table>
      <PaginationTable total={50} />
      <Snack show={showSnack} setShow={()=>setShowSnack(false)} message={message} />
    </TableContainer>
  )
}

