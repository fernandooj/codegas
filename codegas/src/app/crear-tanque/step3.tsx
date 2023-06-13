'use client'
import React, {useState} from 'react';
import {Autocomplete, Box, Button, FormControl, Container, CssBaseline, InputLabel, Grid, MenuItem, Select, TextField, SelectChangeEvent} from '@mui/material';
import {Snack} from "../components/snackBar"
import {addUserTanque} from "../store/fetch-tanque"
import { usePathname, useRouter } from 'next/navigation';
 

export default function Step1({users, puntos, tanqueId}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [usuarioId, setUsuarioId] = useState('');
  const [puntoId, setPuntoId] = useState('');
  const [showSnack, setShowSnack] = useState(false);
  const [message, setMessage] = useState("");

  const handleChangeSelect = (_: any, value: any) => {
    setUsuarioId(value._id as string);
    router.push(`${pathname}?tanqueId=${tanqueId}&idUser=${value._id}`, undefined)
  };
  const handleChangePunto = (event: SelectChangeEvent) => {
    setPuntoId(event.target.value as string);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const newData = {
      puntoId,
      usuarioId,
      tanqueId
    };
    saveData(newData)
  };
 
  const saveData = async (data: any) => {
    const {status} = await addUserTanque(data)
    if (status) {
      setShowSnack(true)
      setMessage("Pedido Guardado con exito")
    }
  }
  
  const searchUser = async (event: any) => {
    if(event.key === 'Enter') {
      router.push(`${pathname}?tanqueId=${tanqueId}&search=${event.target.value}`, undefined)
    }
  }

  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <Autocomplete
                  sx={{ width: 400 }}
                  freeSolo
                  id="users"
                  disableClearable
                  options={users}
                  getOptionLabel={(option) => option.razon_social?? ""}
                  onChange={handleChangeSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar Usuarios..."
                      InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        onKeyDown: searchUser,
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid> 
              {
                puntos && puntos.length!==0
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
              {
                puntos && puntos.length===0
                &&<p>este usuario no tiene Puntos</p>
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