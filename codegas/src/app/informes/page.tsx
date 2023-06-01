"use client"
import React, {useState} from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Container, Typography, Card, CardContent, Grid, Box} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {ListInformes} from '../utils/informes'
 
const defaultTheme = createTheme();

export default function Reports() {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2022-04-17'));
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container sx={{ py: 8 }} maxWidth="xl"> 
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
            marginBottom: 5,
            p: 5
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker 
                label="Fecha Inicio" 
                maxDate={dayjs()}
              />
              <DatePicker
                label="Fecha Final"
                onChange={(newValue) => setValue(newValue)}
                maxDate={dayjs()}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        
        <Grid container spacing={4}>
          {ListInformes.map(({text, url}, key) => (
            <Grid item key={key} xs={12} sm={6} md={4}>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardContent sx={{ flexGrow: 0 }}>
                  <Typography gutterBottom variant="h6" component="h6">
                    {text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        </Container>

    </ThemeProvider>
  );
}