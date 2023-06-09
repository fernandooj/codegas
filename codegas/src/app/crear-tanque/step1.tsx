'use client'
import React, {useState} from 'react';
 
import {Box, Button, FormControl, Container, CssBaseline, InputLabel, Grid, 
  MenuItem, Select, TextField, SelectChangeEvent} from '@mui/material';
import {Snack} from "../components/snackBar"
import {fields, ano, ubicacion, propiedad, capacidad} from "../utils/tanques"
import {createTanque} from "../store/fetch-tanque"
import { usePathname, useRouter } from 'next/navigation';
import {Date} from "../components/date"
import moment from 'moment';

export default function Step1() {
  const router = useRouter();
  const pathname = usePathname()
  const [showSnack, setShowSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [newForma, setNewForma] = useState()
  const [date, setDate] = useState({})

  const handleDate = (event: SelectChangeEvent, prop: any) => {
    setDate({...date, [prop]: event});
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newData = {
      placaText: data.get('placaText'),
      capacidad: data.get('capacidad'),
      fabricante: data.get('fabricante'),
      fechaUltimaRev: moment(date.fechaUltimaRev).format("YYYY-MM-DD"),
      nPlaca: data.get('nPlaca'),
      serie: data.get('serie'),
      anoFabricacion: data.get('anoFabricacion'),
      existeTanque: data.get('existeTanque'),
      propiedad: data.get('propiedad'),
      registroOnac: data.get('registroOnac'),
      ultimRevTotal: moment(date.ultimRevTotal).format("YYYY-MM-DD"),
      usuarioCrea: 2,
    };
    
    saveData(newData)
  };
  const handleChange = (event: SelectChangeEvent) => {
    setNewForma(event.target.value as string);
  };
 
  const saveData = async (data: any) => {
    const {status, code} = await createTanque(data)
    if (status) {
      setShowSnack(true)
      setMessage("Tanque Guardado con exito")
      router.push(`${pathname}?tanqueId=${code}`, undefined)
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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}  maxWidth="sm">
          <Grid container spacing={2}>
            {
              fields.map(({label, value, type}) => {
              return (
                <Grid item xs={12} sm={12} key={label}>
                  <FormControl fullWidth>
                    {
                      type==="select"
                      ?<>
                        <InputLabel id={value}>{label}</InputLabel>
                        <Select
                          name={value}
                          labelId={value}
                          id={value}
                          value={newForma}
                          label="Forma"
                          onChange={handleChange}
                        >
                          {
                            value==="capacidad"
                            ?capacidad.map((e)=> <MenuItem value={e} key={e}>{e}</MenuItem>)
                            :value==="anoFabricacion"
                            ?ano.map((e)=> <MenuItem value={e} key={e}>{e}</MenuItem>)
                            :value==="existeTanque"
                            ?ubicacion.map((e)=> <MenuItem value={e.value} key={e.value}>{e.label}</MenuItem>)
                            :propiedad.map((e)=> <MenuItem value={e.value} key={e.value}>{e.label}</MenuItem>)
                          }
                        </Select>
                      </>
                      :type==="text"
                      ?<TextField
                        id={value}
                        label={label}
                        name={value}
                      />
                      :<Date setValueDate={(e: any)=>handleDate(e, value)} label={label} />
                    }
                  </FormControl>
                </Grid>
                )
              })
            }
           </Grid>
           
          
          <Button
            type="submit"
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