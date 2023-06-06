'use client';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { MenuItem, Select,   Button, Grid, Paper, InputBase } from '@mui/material';

import {InputZonaProps} from "./input_zona_props"

const PaperContent = ({children}: {children: React.ReactNode}) => {
  return(
    <Grid item xs={12} sm={2}>
      <Paper
        component="form"
        sx={{ p: '8px 4px', display: 'flex', alignItems: 'center', marginTop: 2, marginLeft: 2 }}
      >
        {children}
      </Paper>
    </Grid>
  )
}

const InputZones = ({onSend}: object): ReactElement => {
  const [data, setData] = useState<InputZonaProps>();

  const handleChange = (prop, event) =>{
    setData({...data, [prop]: event})
  } 

  return (
    <div>
      <Grid container spacing={2}>
        <PaperContent>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="reemplazar valor unitario ..."
            onChange={(e)=> handleChange('replace', e.target.value)}
          />
        </PaperContent>
        <Grid item xs={12} sm={2}>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={data?.type || 'porcentege'}
            onChange={(e)=> handleChange('type', e.target.value)}
            label="Age"
            sx={{ marginLeft: 1, marginTop: 2, p: '0px', display: 'flex', alignItems: 'center', width: "100%" }}
          >
            <MenuItem value="porcentege">Porcentaje</MenuItem>
            <MenuItem value="adicion">Adición</MenuItem>
          </Select>
        </Grid>
        <PaperContent>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={data?.typeValue === "porcentege" ? "% valor en porcentaje" : "$ valor a sumar o restar"}
            onChange={(e)=> handleChange('value', e.target.value)}
          />
        </PaperContent>
        <Grid item xs={12} sm={2}>
          <Button 
            variant="contained" 
            sx={{marginTop: 2, p: '12px 12px'}}
            onClick={()=>onSend(data)}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default InputZones;
