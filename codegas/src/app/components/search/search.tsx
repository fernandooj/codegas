"use client"
import React, { useState } from 'react';

import {Paper, InputBase} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { usePathname, useRouter } from 'next/navigation';


export default function InputSearch({search}) {
  const [url, setUrl] = useState(1);
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeUrl = (newUrl) => {
    router.push(`${pathname}?search=${newUrl}`, undefined)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleChangeUrl(url);
    } 
  };
  const handleChange = (event) => {
    setUrl(event.target.value)
  };
    
 
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', margin: "8px 0" }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Buscar ..."
        defaultValue={search &&search}
        inputProps={{ 'aria-label': 'search google maps' }}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={()=>handleChangeUrl(url)}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}