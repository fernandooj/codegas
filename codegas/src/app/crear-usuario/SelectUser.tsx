'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function SelectUser({data}) {
  console.log(data)
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <>
      <Select
        labelId="idPadre"
        id="idPadre"
        value={age}
        label="Padre"
        onChange={handleChange}
      >
      {
          data.map(({_id, nombre})=> <MenuItem value={_id} key={_id}>{nombre}</MenuItem>)
      }
      </Select>
    </>
  );
}