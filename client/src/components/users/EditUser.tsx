import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserById, selectUserById } from './UsersSlice';
import UserService from '../../services/userService';
import { useHistory } from 'react-router';

export default function EditUser(props: any) {
    const dispatch = useDispatch();
    const selectedUserById = useSelector(selectUserById);
    const history = useHistory();
    console.log('params', props.match.params.id)
    console.log('user', selectedUserById)
    const [user, setUser] = useState({ 
        name: '',
        lastName: '',
        email: '',
        isAdmin: false,
    });

    useEffect(() => {
        if (props.match.params.id) {
            UserService.getUserById(props.match.params.id)
                .then((response: any) => {
                    console.log('response', response)
                    setUser(response)
                })
                .catch((err: any) => {
                    console.log('error', err);
                })
        }
    }, [props.match.params.id])

    const handleChange = (event: any) => {
        const { name, value, type, checked } = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSave = (event: any) => {
        event.preventDefault();
        if (props.match.params.id) {
            dispatch(saveUserById(props.match.params.id, user, history));
        }
    }

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <div /* className={classes.paper} */>
                    <h1>Update User</h1>
                    <form /* className={classes.form} */ >
                        <TextField
                            name="name"
                            label="name"
                            placeholder="Name"
                            value={user?.name}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                        />
                        <br />
                        <TextField
                            name="lastName"
                            label="Last Name"
                            placeholder="Last Name"
                            value={user?.lastName}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                        />
                        <br />
                        <TextField
                            name="email"
                            label="email"
                            placeholder="Email"
                            value={user?.email}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                        />
                        <br />
                        <FormControlLabel
                            value={user?.isAdmin}
                            control={<Checkbox color="primary"
                                name="isAdmin"
                                checked={user?.isAdmin}
                                onChange={handleChange} />
                            }
                            label="Is Admin"
                            labelPlacement="start"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        //className={classes.submit}
                        >
                            Update
                            </Button>
                    </form>
                </div>
            </Container>
        </div>
    )
}