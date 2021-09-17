import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { closeConfirmPopup, getConfirmPopup } from './DynamicConfirmPopupSlice';
import styles from './DynamicConfirmPopup.module.css';

export default function DynamicConfirmPopup() {
    const dispatch = useDispatch();
    const confirmPopup = useSelector(getConfirmPopup);

    const cancel = () => {
        dispatch(closeConfirmPopup());
    }

    const confirm = (url: string, callback: Function | null) => {
        if (callback) {
            callback();
        } else {
            window.open(url);
        }
        dispatch(closeConfirmPopup());
    }

    if (!confirmPopup.confirmPopupIsOpen) {
        return null;
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.innerWrap}>
                <div className={styles.contentWrap}>
                    <div className={styles.content}>
                        <span className={styles.title}>Caution</span>
                        <span className={styles.message}>{confirmPopup.message}</span>
                    </div>
                    <div className={styles.buttonsWrap}>
                        <Button 
                            variant="contained" 
                            size="small"
                            color="secondary" 
                            onClick={() => cancel()}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained" 
                            size="small"
                            color="primary" 
                            onClick={() => confirm(confirmPopup.url, confirmPopup.callback)}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}