import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";

const PrivateRoute = (props) => {
    const authCtx = useContext(AuthContext);
    let element;

    if (authCtx.isLoggedIn)
    {
        element = props.element;
    }
    else
    {
        element = <Navigate to="/login" />
    }


    return (
        <Route path={props.path} element={element} />
    )
}

export default PrivateRoute;