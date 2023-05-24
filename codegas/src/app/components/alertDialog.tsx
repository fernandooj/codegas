'use client' 
import React, {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


export function AlertDialog({children, showDialog, setShowDialog}) {
  return (
    <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        {children}
      </DialogContent>  
    </Dialog>
  );
}