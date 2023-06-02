'use client'
import * as React from 'react';

import {ListItemIcon, ListItemButton, ListItemText} from '@mui/material/';
import {Dashboard, Map, People, AssignmentTurnedIn, PropaneTank, VerifiedUser, BorderColor} from '@mui/icons-material/';
import Link from 'next/link'
const menuItems = [
  {link: "pedidos", text: "Pedidos", icon: <Dashboard />},
  {link: "zonas", text: "Zonas", icon: <Map />},
  {link: "tanques", text: "Tanques", icon: <PropaneTank/>},
  {link: "revisiones", text: "Revisiones", icon: <VerifiedUser />},
  // {link: "vehiculos", text: "Vehiculos", icon: <ShoppingCart/>},
  {link: "informes", text: "Informes", icon: <AssignmentTurnedIn />},
  {link: "crear-usuario", text: "Crear Usuario", icon: <People />}, 
  {link: "crear-pedido", text: "Crear Pedido", icon: <BorderColor />}
]
export const mainListItems = (
  <React.Fragment>
    {
      menuItems.map(({text, icon, link}, index) => (
        <Link href={link} key={index} style={{color: "#666565", textDecoration: "none"}} >
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

 
