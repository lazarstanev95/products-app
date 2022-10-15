import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { registerUSer } from './UsersSlice';
import styles from './Register.module.css';

export default function Register() {
    const [user, setUser] = useState({ name: '', email: '', password: ''});
    const history = useHistory();
    const dispatch = useDispatch();

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSave = (event: any) => {
        event.preventDefault();
        dispatch(registerUSer(user, history));
    }

    const goToLogin = () => {
        history.push('/login');
    }

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <div className={styles.paper}>
                    <Avatar className={styles.lockIcon}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <h1>Sign up</h1>
                    <form className={styles.form} >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            name="name"
                            label="name"
                            placeholder="Name"
                            value={user.name}
                            onChange={handleChange}
                        />
                        <br />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            name="email"
                            label="Email"
                            placeholder="Email"
                            value={user.email}
                            onChange={handleChange}
                        />
                        <br />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            name="password"
                            label="Password"
                            placeholder="password"
                            value={user.password}
                            onChange={handleChange}
                            type="password"
                            autoComplete="current-password"
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
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link onClick={goToLogin} style={{ cursor: 'pointer' }} variant="body2">
                                    Already have an account? Sign in
                                    </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        </div>
    )
}