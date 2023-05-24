'use client'
import * as React from 'react';
import {Button, Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, DialogTitle, Dialog} from '@mui/material';
import {Person, Add} from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';

export interface VehiculoProps {
  _id: number;
  placa: string;
  // onClose: (value: string) => void;
  centro: string;
  conductor: string;
}

 

export default function VehiculosDialog({_id, placa, centro, conductor}: VehiculoProps) {
  // const [open, setOpen] = React.useState(false);
  // const [selectedValue, setSelectedValue] = React.useState('');

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = (value: string) => {
  //   setOpen(false);
  //   setSelectedValue(value);
  // };

  return (
    <ListItem disableGutters key={_id}>
      <ListItemButton onClick={() => console.log(placa)}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            <Person />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={placa} />
        <ListItemText primary={centro} />
        <ListItemText primary={conductor} />
      </ListItemButton>
    </ListItem>
  );
}
