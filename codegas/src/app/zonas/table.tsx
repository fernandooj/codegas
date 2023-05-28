'use client' 
import { Fragment, useState } from 'react';
import { TableRow, TableCell, Checkbox, InputBase, FormControl, InputLabel, InputAdornment, OutlinedInput } from '@mui/material';
import {Snack} from "../components/snackBar"
import {ChangeValorUnitario} from "./fetchZona"
 


const RenderZonas = ({zona, updateValor, addValues}: any) => {
  return ( 
    zona.map(({_id, codt, razon_social, nombrezona, nombre, valorunitario, idcliente}: any)=> {
    const [valor, setValor] = useState(valorunitario);
    return (
      <TableRow
        key={_id}
      >
        <TableCell component="th" scope="row" align="center">
            <Checkbox
                // checked={checked}
                onChange={()=>addValues(idcliente)}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </TableCell>
        <TableCell align="center" component="th">{nombrezona}</TableCell>
        <TableCell align="center">{codt}</TableCell>
        <TableCell align="center">{razon_social}</TableCell>
        <TableCell align="center">{nombre} - {idcliente}</TableCell>
        <TableCell align="center">
          <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Valor Uni</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Amount"
            defaultValue={valor}
            onBlur={(e)=>{updateValor(e.target.value, idcliente, valor); setValor(e.target.value)}}
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
  const [valorWithArray, setValorWithArray] = useState([{_id: null}])

  const updateValor = async (event: any, idcliente: any, valorunitario: any) => {
    if(Number(valorunitario)!==Number(event)){
      const {status} = await ChangeValorUnitario(Number(event), idcliente)
      if (status) {
        setShowSnack(true)
        setMessage("Valor Unitario Actualizado")
      }
    }
  }
  const addValues = (id: any) => {
    const index = valorWithArray.some(({ _id }) => _id === id);
    if (!index) {
      setValorWithArray((state) => [...state, {_id: id}])
    }else{
      setValorWithArray(valorWithArray.filter(({_id})=> {return _id !== id})) 
    }
  } 
  
  return(
    <Fragment>
      <RenderZonas 
        zona={zona} 
        updateValor={updateValor} 
        addValues={addValues} 
      />
      <Snack show={showSnack} setShow={()=>setShowSnack(false)} message={message} />
    </Fragment>
  )
}

