'use client';
import react, { ReactElement, useContext } from 'react';
import { Container, Grid, Table, Box, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { redirect } from 'next/navigation';
 
import Chart from '../components/chart';
import {DataContext} from "../context/context"
import { RenderPedidos } from './renderPedido'; 
function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
const Pedidos = (): ReactElement => {
  const {user, login}: any = useContext(DataContext)
  // if(!user) redirect('/')
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
                {/* <Chart /> */}
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
              
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">&nbsp;</TableCell>
                      <TableCell align="center">N pedido</TableCell>
                      <TableCell align="center">Codt</TableCell>
                      <TableCell align="center">Razon Social</TableCell>
                      <TableCell align="center">F Entrega</TableCell>
                      <TableCell align="center">Estado</TableCell>
                      <TableCell align="center">Vehiculo</TableCell>
                      <TableCell align="center">Observación</TableCell>
                      <TableCell align="center">Imagen</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                <RenderPedidos /> 
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Pedidos
 