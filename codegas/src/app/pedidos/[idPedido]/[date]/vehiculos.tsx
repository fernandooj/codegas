'use client'
import react, {Fragment, useState} from 'react';
import {FormControl, Avatar, RadioGroup, ListItemAvatar, FormControlLabel, TableCell, TableRow, Radio} from '@mui/material';
import {Person, Add} from '@mui/icons-material';
import {addCarPedido} from "../../../store/fetch-pedido"
import { blue } from '@mui/material/colors';
import {Snack} from "../../../components/snackBar"
export interface VehiculoProps {
  _id: number;
  placa: string;
  // onClose: (value: string) => void;
  centro: string;
  conductor: Object;
}

 

export default function VehiculosDialog({_id, placa, centro, conductor, idPedido, date}: any) {
  const [showSnack, setShowSnack] = useState(false);
  const [message, setMessage] = useState("");
  const asignCar = async () => {
    const idPedidoArray = idPedido.split("%2C").filter((value) => value !== "");
  
    await Promise.all(idPedidoArray.map(async (e: any) => {
      const { status } = await addCarPedido(e, _id, date);
      console.log(status)
      if (status) {
        setShowSnack(true)
        setMessage(`Carro ${placa} agregado!`)
      }
    }));
  }
  return (
    <Fragment>
      <TableRow>
        <TableCell component="th" scope="row" align="center">
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              onChange={asignCar}
            >
              <FormControlLabel value="female" control={<Radio />} label="" />
            </RadioGroup>
          </FormControl>
           
        </TableCell>
        <TableCell align="center">
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
              <Person />
            </Avatar>
          </ListItemAvatar>
        </TableCell>
        <TableCell align="center">{_id}</TableCell>
        <TableCell align="center">{placa}</TableCell>
        <TableCell align="center">{centro}</TableCell>
        <TableCell align="center">{conductor?.nombre}</TableCell>
      </TableRow>
      <Snack show={showSnack} setShow={()=>setShowSnack(false)} message={message} />
    </Fragment>
  );
}
