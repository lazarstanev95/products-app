import React from 'react'
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { selectIsAuthenticated } from '../users/UsersSlice';

const PrivateRouteHandler = ({ component, ...rest }: any) => {

    let ComponentToRender = component;
    const isAuthenticated = useSelector(selectIsAuthenticated);
    if (!isAuthenticated) {
        return <p>Loading...</p>
    }
    return (
        <Route
            {...rest}
            render={(props: any) =>
                isAuthenticated ? (
                    <ComponentToRender {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRouteHandler