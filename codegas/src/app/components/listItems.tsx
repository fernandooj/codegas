'use client'
import * as React from 'react';

import {ListItemIcon, ListItemButton, ListItemText} from '@mui/material/';
import {Dashboard, ShoppingCart, CalendarToday, Map, FireTruck, AssignmentTurnedIn, People} from '@mui/icons-material/';
import Link from 'next/link'
const menuItems = [
  {link: "pedidos", text: "Pedidos", icon: <Dashboard />},
  {link: "usuarios", text: "Usuarios", icon: <People />}, 
  {link: "vehiculos", text: "Vehiculos", icon: <ShoppingCart/>},
  {link: "fechas", text: "Fechas", icon: <CalendarToday/>},
  {link: "zonas", text: "Zonas", icon: <Map />},
  {link: "tanques", text: "Tanques", icon: <FireTruck/>},
  {link: "revisiones", text: "Revisiones", icon: <AssignmentTurnedIn/>},
  {link: "informes", text: "Informes", icon: <AssignmentTurnedIn/>}
]
export const mainListItems = (
  <React.Fragment>
    {
      menuItems.map(({text, icon, link}, index) => (
        <Link href={link} key={index}>
          <ListItemButton>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
              <ListItemText primary={text} />
          </ListItemButton>
        </Link>
      ))
    }
  </React.Fragment>
);

 
