'use client';
import react, { ReactElement, useContext, useState } from 'react';
import { Container, Grid, Box, Paper} from '@mui/material';
import { redirect } from 'next/navigation';

import {DataContext} from "../context/context"

 
const LayoutRevisiones = ({children}): ReactElement => {
  const {user, login}: any = useContext(DataContext)
  if(!user) redirect('/')
  return(
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }} component="section">
          <Grid item xs={12}>
            {children}
          </Grid>
      </Container>
    </Box>
  )
}

export default LayoutRevisiones
 