import { ReactNode } from 'react';

export type AlertDialogProps = {
    children: ReactNode,
    showDialog: boolean;
    setShowDialog: (show: boolean) => void;
}