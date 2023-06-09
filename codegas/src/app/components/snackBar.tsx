'use client' 
import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


export const Snack = ({severity='success', message, show, setShow}: any) => {
    return(
        <Snackbar open={show} autoHideDuration={6000} onClose={()=>setShow(false)}>
            <Alert onClose={()=>setShow(false)} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}