import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useEffect, useState } from 'react';
import DataService from '../../services/DataService';
import { openSnackbar } from '../shared/dynamicSnackbar/DynamicSnackbarSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function NewPassword(props: any) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [password, setPassword] = useState('');
    const [user, setUser] = useState({userId: '', passwordToken: ''})

    useEffect(() => {
        getNewPassword();
    }, [])

    const getNewPassword = () => {
        DataService.get('/user/users/getNewPassword/' + props.match.params.token)
            .then((response: any) => {
                setUser(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleChange = (event: any) => {
        setPassword(event.target.value);
    }

    const sendNewPassword = () => {
        const { userId, passwordToken } = user;
        const data = {
            userId,
            passwordToken,
            password
        }
        DataService.post('/user/users/postNewPassword', data)
            .then((response: any) => {
                dispatch(openSnackbar({
                    message: response.data.message,
                    severity: 'success'
                }))
                history.push('/');
            })
            .catch(error => {
                console.log(error);
            });
    }
    
    return (
        <div style={{ width: 440, margin: 'auto' }}>
            <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                autoFocus
                name="password"
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
            />
            <Button onClick={sendNewPassword} color="primary" variant="contained">
                Update Password
            </Button>
        </div>
    )
}