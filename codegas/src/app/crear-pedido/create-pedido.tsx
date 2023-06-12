'use client'
import React, {useState, useContext} from 'react';
 
import {Avatar, Box, Button, FormControl, Container, CssBaseline, InputLabel, Grid, MenuItem, Select, TextField, Typography, SelectChangeEvent} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Snack} from "../components/snackBar"
import {forma} from "../utils/pedido_info"
import {createPedido} from "./fetch-pedido"
import { usePathname, useRouter } from 'next/navigation';
import {Date} from "../components/date"
import moment from 'moment';
import {DataContext} from '../context/context'


export default function CrearPedido({data, puntos}: any) {
  const {idUser: usuarioCrea}: any = useContext(DataContext)

  const router = useRouter();
  const pathname = usePathname();
  const [usuarioId, setUsuarioId] = useState('');
  const [puntoId, setPuntoId] = useState('');
  const [showSnack, setShowSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [newForma, setNewForma] = React.useState<string | undefined>(undefined);

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setUsuarioId(event.target.value as string);
    router.push(`${pathname}?idUser=${event.target.value}`, undefined)
  };
  const handleChangePunto = (event: SelectChangeEvent) => {
    setPuntoId(event.target.value as string);
  };

  const [date, setDate] = useState('')
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newData = {
      forma: data.get('forma'),
      cantidadKl: Number(data.get('cantidadKl')),
      cantidadPrecio: Number(data.get('cantidadPrecio')),
      fechaSolicitud: moment(date).format('YYYY-MM-DD'),
      puntoId: Number(data.get('puntoId')),
      usuarioId: Number(data.get('usuarioId')),
      observaciones: data.get('observaciones'),
      usuarioCrea,
      pedidoPadre: 1
    };
    saveData(newData)
  };
  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;
    setNewForma(newValue || undefined);
  };
  
 
  const saveData = async (data: any) => {
    const {status} = await createPedido(data)
    if (status) {
      setShowSnack(true)
      setMessage("Pedido Guardado con exito")
    }
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Nuevo Pedido
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id="forma">Forma</InputLabel>
                <Select
                  name="forma"
                  labelId="forma"
                  id="forma"
                  value={newForma}
                  label="Forma"
                  onChange={handleChange}
                >
                  {
                    forma.map(({value, label})=> <MenuItem value={value} key={value}>{label}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </Grid>
            {
              (newForma && newForma!=="lleno")
              &&<Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name={newForma === 'monto' ?'cantidadPrecio' :'cantidadKl'}
                  label={newForma === 'monto' ?'cantidadPrecio' :'cantidadKl'}
                  type={newForma === 'monto' ?'cantidadPrecio' :'cantidadKl'}
                  id={newForma === 'monto' ?'cantidadPrecio' :'cantidadKl'}
                />
              </Grid>
            }
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <Date setValueDate={setDate} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <TextField
                  id="outlined-Observaciones"
                  label="Observaciones"
                  name="observaciones"
                  multiline
                  rows={4}
                />
              </FormControl>
            </Grid> 
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel id="usuarioId">Cliente</InputLabel>
              <Select
                  labelId="usuarioId"
                  id="usuarioId"
                  name="usuarioId"
                  value={usuarioId}
                  label="Padre"
                  onChange={handleChangeSelect}
                >
                {
                    data.map(({_id, nombre}: any)=> <MenuItem value={_id} key={_id}>{nombre}</MenuItem>)
                }
                </Select>
            </FormControl>
          </Grid> 
              {
                puntos
                &&<Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id="puntoId">Punto</InputLabel>
                    <Select
                        labelId="puntoId"
                        id="puntoId"
                        name="puntoId"
                        value={puntoId}
                        label="Punto"
                        onChange={handleChangePunto}
                      >
                      {
                          puntos.map(({_id, direccion}: any)=> <MenuItem value={_id} key={_id}>{direccion}</MenuItem>)
                      }
                      </Select>
                  </FormControl>
                </Grid> 
              }
             
          
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Guardar
          </Button>
        </Box>
      </Box>
      <Snack show={showSnack} setShow={()=>setShowSnack(false)} message={message} />
    </Container>
  );
}