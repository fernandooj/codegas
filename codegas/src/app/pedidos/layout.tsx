'use client';
import react, { ReactElement, useContext, useState } from 'react';
import { Container, Grid, Box, Paper} from '@mui/material';
import { redirect } from 'next/navigation';

import Chart from '../components/chart';
import Incomes from '../components/incomes/incomes'

import {DataContext} from "../context/context"
 
const LayoutPedidos = ({children}): ReactElement => {
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
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
                {/* <Chart />  */}
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Incomes />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default LayoutPedidos
 