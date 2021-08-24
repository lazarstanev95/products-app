import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from '../Home';
import Users from '../users/Users';
import Login from '../users/Login';
import Register from '../users/Register';

export default function Routes() {
    return (
        <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
            <PrivateRoute path='/users' isAuthenticated={true} component={Users}/>
        </Switch>
    )
}

/* const Routes = () => (
    <Switch>
        <Route path='/' exact component={Home}/>
        <PrivateRoute path='/users' isAuthenticated={true} component={Users}/>
    </Switch>
) */

//export default Routes