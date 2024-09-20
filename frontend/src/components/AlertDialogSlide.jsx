import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function AlertDialogSlide({open, onClose}) {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => onClose(false)}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Delete Task"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Are you sure you want to delete this task? You won't be able to restore it.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Close</Button>
                <Button onClick={() => onClose(true)}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}