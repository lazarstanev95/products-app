import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import { closeSnackbar, getSnackbar } from './DynamicSnackbarSlice';
import styles from './DynamicSnackbar.module.css';

function TransitionUp(props: any) {
    return <Slide {...props} direction="up"/>
}

export function DynamicSnackbar() {
    const dispatch = useDispatch();
    const snackbar = useSelector(getSnackbar);

    const handleClose = (event?: any, reason?: any) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(closeSnackbar());
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            open={snackbar.snackbarIsOpen}
            onClose={handleClose}
            classes={{root: styles.snackbarWrapper}}
            TransitionComponent={TransitionUp}
            autoHideDuration={5000}
        >
            <Alert
                elevation={6}
                variant={"filled"}
                classes={{root: styles.alertWrapper}}
                iconMapping={{
                    success: <CheckCircleOutlineIcon fontSize="inherit" />,
                    error: <ErrorOutlineIcon fontSize="inherit" />,
                    info: <InfoIcon fontSize="inherit" />,
                    warning: <WarningIcon fontSize="inherit" />
                }}
                severity={snackbar.severity}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    )
}