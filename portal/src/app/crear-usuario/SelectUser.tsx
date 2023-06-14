'use client'
import React, {useState, useContext} from 'react';
import {Avatar, Box, Button, FormControl, Container, CssBaseline, InputLabel, Grid, MenuItem, Select, TextField, Typography, SelectChangeEvent} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Snack} from "../components/snackBar"
import {accesos, fields, tipos} from "../utils/users_info"
import {createUser} from "../store/fetch-user"
import {DataContext} from '../context/context'


export default function SelectUser({data}: any) {
  const {createUserFirebase}: any = useContext(DataContext)
  const [idPadre, setIdPadre] = useState('');
  const [showSnack, setShowSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const handleChangeSelect = (event: SelectChangeEvent) => {
    setIdPadre(event.target.value as string);
  };

  const [newAcceso, setNewAcceso] = useState('')
  const [newTipo, setTipo] = useState('')
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    try {
      const response = await createUserFirebase(data.get('email'));
      if (typeof response === 'string') {
        setSeverity("error")
        setShowSnack(true)
        setMessage("Este email ya existe")
        console.log('Error:', response);
      } else {
        const newData = {
          email: data.get('email'),
          cedula: data.get('cedula'),
          nombre: data.get('nombre'),
          celular: data.get('celular'),
          codMagister: data.get('codMagister'),
          razon_social: data.get('razon_social'),
          direccion_factura: data.get('direccion_factura'),
          codt: data.get('codt'),
          valorUnitario: data.get('valorUnitario'),
          acceso: data.get('acceso'),
          idPadre: idPadre,
          uid: response.uid
        };
        saveData(newData);
      }
    } catch (error) {
      console.error(error);
    }

  };
  const handleChange = (event: SelectChangeEvent) => {
    setNewAcceso(event.target.value as string);
  };
  const handleTipo = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };
  const saveData = async (data: any) => {
    const {status} = await  createUser(data)
    if (status) {
      setShowSnack(true)
      setMessage("Usuario Guardado con exito")
      setSeverity("success")
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
          Nuevo {newAcceso || 'Usuario' }
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id="acceso">Acceso</InputLabel>
                <Select
                  name="acceso"
                  labelId="acceso"
                  id="acceso"
                  value={newAcceso}
                  label="Acceso"
                  onChange={handleChange}
                >
                  {
                    accesos.map(({value, label})=> <MenuItem value={value} key={value}>{label}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </Grid>
            
            {
              fields.map(({label, value, acceso}, key)=> {
                if (acceso === 'all' || acceso === newAcceso) {
                  return <Grid item xs={12} key={key}>
                    <TextField
                      required
                      fullWidth
                      name={value}
                      label={label}
                      type={value}
                      id={value}
                      autoComplete={value}
                    />
                  </Grid>
                }
              })
            }
            {
              newAcceso==="cliente"
              &&<Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id="tipo">Tipo</InputLabel>
                    <Select
                      name="tipo"
                      labelId="tipo"
                      id="tipo"
                      value={newTipo}
                      label="Tipo"
                      onChange={handleTipo}
                    >
                      {
                        tipos.map(({value, label})=> <MenuItem value={value} key={value}>{label}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </Grid>
            }
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel id="idPadre">Veo / Padre</InputLabel>
                  <Select
                      labelId="idPadre"
                      id="idPadre"
                      value={idPadre}
                      label="Padre"
                      onChange={handleChangeSelect}
                    >
                    {
                        data.map(({_id, nombre}: any)=> <MenuItem value={_id} key={_id}>{nombre}</MenuItem>)
                    }
                    </Select>
                </FormControl>
              </Grid> 
          
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Guardar Usuario
          </Button>
        </Box>
      </Box>
      <Snack show={showSnack} setShow={()=>setShowSnack(false)} message={message} severity={severity} />
    </Container>
  );
}