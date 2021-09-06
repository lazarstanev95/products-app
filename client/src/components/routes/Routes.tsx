import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from '../Home';
import Users from '../users/Users';
import Login from '../users/Login';
import Register from '../users/Register';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../users/UsersSlice';
import EditUser from '../users/EditUser';

export default function Routes() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    return (
        <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
            <PrivateRoute path='/users' /* isAuthenticated={true} */ component={Users}/>
            <PrivateRoute path='/editUser/:id' /* isAuthenticated={true} */ component={EditUser}/>
        </Switch>
    )
}
