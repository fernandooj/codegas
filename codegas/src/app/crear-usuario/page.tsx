'use client'
import React, {useState} from 'react';
import {Avatar, Box, Button, FormControl, Container, CssBaseline, InputLabel, Grid, Link, MenuItem, Select, TextField, Typography, SelectChangeEvent} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {accesos, fields, tipos} from "../utils/users_info"

import {createUser} from "./fetchUser"
import {RenderUsers} from "./renderUsers"
const defaultTheme = createTheme();


export default function SignUp() {
  const [newAcceso, setNewAcceso] = useState('')
  const [newTipo, setTipo] = useState('')
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
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
      acceso: data.get('acceso')
    };
    console.log(newData)
    createUser(newData)
  };
  const handleChange = (event: SelectChangeEvent) => {
    setNewAcceso(event.target.value as string);
  };
  const handleTipo = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };


  return (
    <ThemeProvider theme={defaultTheme}>
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
                  <RenderUsers />
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
      </Container>
    </ThemeProvider>
  );
}