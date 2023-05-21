'use client'
import * as React from 'react';

import {ListItemIcon, ListItemButton, ListItemText, ListSubheader} from '@mui/material/';
import {Dashboard, ShoppingCart, CalendarToday, Map, FireTruck, AssignmentTurnedIn, People} from '@mui/icons-material/';

const menuItems = [
  {text: "Pedido", icon: <Dashboard />},
  {text: "Usuarios", icon: <People />}, 
  {text: "Vehiculos", icon: <ShoppingCart/>},
  {text: "Fechas", icon: <CalendarToday/>},
  {text: "Zonas", icon: <Map />},
  {text: "Tanques", icon: <FireTruck/>},
  {text: "Revisiones", icon: <AssignmentTurnedIn/>},
  {text: "Zonas", icon: <AssignmentTurnedIn/>}
]
export const mainListItems = (
  <React.Fragment>
    {
      menuItems.map(({text, icon}, index) => (
        <ListItemButton key={index}>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
        <ListItemText primary={text} />
        </ListItemButton>
      ))
    }
  </React.Fragment>
);

 
