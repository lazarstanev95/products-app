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
import Products from '../products/Products';
import AddProduct from '../products/AddProduct';
import NewPassword from '../users/NewPassword';
import Cart from '../cart/Cart';

export default function Routes() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    return (
        <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
            <PrivateRoute path='/products/add' component={AddProduct}/>
            <PrivateRoute path='/edit/:id' component={AddProduct}/>
            <PrivateRoute path='/users' /* isAuthenticated={true} */ component={Users}/>
            <PrivateRoute path='/editUser/:id' /* isAuthenticated={true} */ component={EditUser}/>
            <Route path='/products' component={Products}/>
            <Route path='/new-password/:token' component={NewPassword}/>
            <Route path='/cart' component={Cart} />
        </Switch>
    )
}
