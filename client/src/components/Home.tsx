import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import { selectCurrentUser } from './users/UsersSlice';

export default function Home() {
    const currentUser = useSelector(selectCurrentUser);

    const capitalize = (str: string) => {
        if(str === undefined){
            return;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const regularUser = (
        <div>
            <h1>Welcome {capitalize(currentUser?.name)} </h1>
            <Link to='/products' className='navbarLink'>Products</Link>
        </div>
    );
    const adminUser = (
        <div>
            <h1>Welcome {capitalize(currentUser?.name) + ', ' + currentUser?.id} </h1>
            <Link to='/products' className='navbarLink'>Products</Link>
            <Link to='/products/add' className='navbarLink'>Add product</Link>
            <Link to='/users' className='navbarLink'>Users</Link>
        </div>
    )
    return (
        <div>
            {currentUser?.isAdmin ? adminUser : regularUser}
        </div>
    )
}