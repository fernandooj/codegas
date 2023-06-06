'use client'
import React, {useState} from 'react';
 
import {Avatar, Box, Container, CssBaseline, Typography,  Stepper, Step, StepLabel} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Snack} from "../components/snackBar"
import Step1 from "./step1"
import Step2 from "./step2"

const steps = ['Datos Generales', 'Imagenes', 'Info Usuario', 'Alertas'];

export default function CreateTanque({data, puntos, tanqueId}: any) {
  const [showSnack, setShowSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [activeStep, setActiveStep] = useState(1);

  const RenderTitleSteper = () =>(
    <Stepper activeStep={activeStep}>
      {steps.map((label, index) => {
        const stepProps: { completed?: boolean } = {};
        const labelProps: {
          optional?: React.ReactNode;
        } = {};
        
      
        return (
          <Step key={label} {...stepProps}>
            <StepLabel {...labelProps}>{label}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  )
  

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <RenderTitleSteper />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Nuevo Tanque 
        </Typography>
        
        {
          activeStep===0
          ?<Step1 setActiveStep={setActiveStep} />
          :activeStep===1
          ?<Step2 setActiveStep={setActiveStep} tanqueId={tanqueId} />
          :activeStep===2
          ?<Step1 users={data} puntos={puntos} tanqueId={tanqueId} />
          :null
        }
       
      </Box>
      <Snack show={showSnack} setShow={()=>setShowSnack(false)} message={message} />
    </Container>
  );
}