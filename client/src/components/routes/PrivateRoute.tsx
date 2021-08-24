import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom';

const PrivateRouteHandler = ({ component, isAuthenticated, ...rest }: any) => {

    let ComponentToRender = component;

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