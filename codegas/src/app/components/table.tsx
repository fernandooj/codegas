'use client' 
import { Fragment, useState } from 'react';
import { TableRow, TableCell, Box, Collapse, Table, TableBody, TableHead, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {KeyboardArrowDown, KeyboardArrowUp} from '@mui/icons-material';
// import  from '@mui/icons-material/KeyboardArrowUp';
 

export default function RenderTable({data}: any) {
    const {_id, codt, razon_social, cedula, direccion} = data
    const [open, setOpen] = useState(false);
 
    return(
      <Fragment>
        <TableRow
          key={_id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell align="center">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell align="center" component="th">{_id}</TableCell>
          <TableCell align="center">{codt}</TableCell>
          <TableCell align="center">{razon_social}</TableCell>
          <TableCell align="center">{cedula}</TableCell>
          <TableCell align="center">{direccion}</TableCell>
        </TableRow>
         <TableRow>
         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
           <Collapse in={open} timeout="auto" unmountOnExit>
             <Box sx={{ margin: 1 }}>
               <Typography variant="h6" gutterBottom component="div">
                 History
               </Typography>
               <Table size="small" aria-label="purchases">
                 <TableHead>
                   <TableRow>
                     <TableCell>Date</TableCell>
                     <TableCell>Customer</TableCell>
                     <TableCell align="right">Amount</TableCell>
                     <TableCell align="right">Total price ($)</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        ase
                      </TableCell>
                      <TableCell>asef</TableCell>
                      <TableCell align="right">asef</TableCell>
                      <TableCell align="right">
                       asefsef
                      </TableCell>
                    </TableRow>
                 </TableBody>
               </Table>
             </Box>
           </Collapse>
         </TableCell>
       </TableRow>
      </Fragment>
    )
}

