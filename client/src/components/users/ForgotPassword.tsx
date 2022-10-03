import DynamicPopup from "../shared/dynamicPopup/DynamicPopup";
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import { useState } from "react";

interface IProps {
    open: boolean;
    onClose?: any;
    onConfirm?: any;
}
export default function ForgotPassword({ open, onClose, onConfirm }: IProps) {

    const [email, setEmail] = useState('');

    const handleClose = () => {
        setEmail('');
        onClose && onClose();
    }

    const handleSubmit = () => {
        onConfirm && onConfirm({email})
        handleClose();
    }

    const handleChange = (event: any) => {
        setEmail(event.target.value);
    }

    const renderForgotPasswordContent = () => {
        return (
            <div>
                <DialogContentText>
                    Please enter your email address here. We will send updates.
                </DialogContentText>
                <TextField
                    autoFocus
                    name="email"
                    label="Email Address"
                    placeholder="Email"
                    type="email"
                    margin="dense"
                    fullWidth
                    value={email}
                    onChange={handleChange}
                />
            </div>
        )
    }

    return (
        <DynamicPopup
            open={open}
            title={'Forgot Password'}
            buttonLabel={'Send Email'}
            onClose={handleClose}
            onConfirm={handleSubmit}
        >
            {renderForgotPasswordContent()}
        </DynamicPopup>
    )
}