import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './UsersSlice';
import { useHistory } from 'react-router';

export default function UserItem(props: any) {
    const history = useHistory();
    const currentUser = useSelector(selectCurrentUser);

    const onEdit = () => {
        history.push('/editUser/' + props.users.id)
    }

    const disabledUser = props.users.id === currentUser?.id;
    return (
        <div style={{ display: 'flex', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.26)', height: 40, alignItems: 'center', maxWidth: 1000, margin: 'auto', marginTop: 20 }}>
            <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 400 }}>{props.users.name}</div>
            <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 400 }}>{props.users.lastName}</div>
            <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 400 }}>{props.users.email}</div>
            <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 400 }}>{props.users.isAdmin ? 'yes' : 'no'}</div>
            <Tooltip arrow disableHoverListener={!disabledUser} title="Cannot edit the current user">
                <span>
                    <Button variant="contained" size="small" disabled={disabledUser} color="secondary" onClick={onEdit} >
                        Edit
                    </Button>
                </span>
            </Tooltip>
        </div>
    )
}