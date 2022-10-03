import { ReactElement } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IProps {
    open: boolean;
    onClose?: any;
    title: string;
    children?: ReactElement;
    buttonLabel: string;
    onConfirm: any;
}

export default function DynamicPopup({ open, onClose, title, children, buttonLabel, onConfirm }: IProps) {
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={onConfirm} color="primary">
                    {buttonLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}