'use client'
import React, {useState} from 'react';
 
import {Avatar, Box, Container, CssBaseline, Typography,  Stepper, Step, StepLabel, Button} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Step1 from "./step1"
import Step2 from "./step2"
import Step3 from "./step3"
import Step4 from "./step4"

const steps = ['Datos Generales', 'Imagenes', 'Info Usuario', 'Alertas'];

export default function CreateTanque({data, puntos, tanqueId, alerts}: any) {
  const [activeStep, setActiveStep] = useState(0);

  const RenderTitleSteper = () =>(
    <Stepper activeStep={activeStep}  sx={{ mt: 3 }}>
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
          ?<Step1 />
          :activeStep===1
          ?<Step2 tanqueId={tanqueId} />
          :activeStep===2
          ?<Step3 users={data} puntos={puntos} tanqueId={tanqueId} />
          :<Step4 tanqueId={tanqueId} alerts={alerts} />
        }


        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pt: 2 }}>
          <Button onClick={()=>setActiveStep(activeStep-1)}>
            {activeStep>0 &&'Anterior'}
          </Button>
           
          <Button onClick={()=>setActiveStep(activeStep+1)}>
            {(activeStep !== steps.length - 1) && tanqueId  &&'Siguiente'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}