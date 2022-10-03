import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { loginUser, forgotPassword } from './UsersSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styles from './Login.module.css'
import ForgotPassword from './ForgotPassword';

export default function Login() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [user, setUser] = useState({ email: '', password: ''});
    const [open, setOpen] = useState(false);
    let [errorEmail, setErrorEmail] = useState('');
    let [errorPassword, setErrorPassword] = useState('');

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSave = (event: any) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }
        dispatch(loginUser(user, history));
    }

    const validateForm = () => {
        const validateUser = user;
        let formIsValid = true;
        if (validateUser.email === '') {
            errorEmail = "email is empty!";
            formIsValid = false; 
        }
        if (user.password === '') {
            errorPassword = "password is empty!";
            formIsValid = false;
        }
        setErrorEmail(errorEmail);
        setErrorPassword(errorPassword);
        return formIsValid;
    }

    const goToRegister = () => {
        history.push('/register')
    }

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleConfirm = ({email}: any) => {
        dispatch(forgotPassword({email}));
    }

    return (
        <>
        <Container component="main" maxWidth="xs">

                <div className={styles.paper}>
                    <Avatar /* className={classes.avatar} */>
                        <LockOutlinedIcon />
                    </Avatar>
                    <h1>Sign in</h1>
                    <form className={styles.form}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            autoFocus
                            name="email"
                            label="Email"
                            placeholder="Email"
                            value={user.email}
                            onChange={handleChange}
                            error={Boolean(errorEmail)}
                            helperText={errorEmail}
                        />
                        <br />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="password"
                            fullWidth
                            value={user.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            error={Boolean(errorPassword)}
                            helperText={errorPassword}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            //className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link onClick={handleClickOpen} variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link onClick={goToRegister} style={{ cursor: 'pointer' }} variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
            <ForgotPassword 
                open={open}
                onClose={handleClose}
                onConfirm={handleConfirm}
            />
        </>
    )
}