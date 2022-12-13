import React from "react";
import LogInForm from "./LogInForm/LogInForm";

const LogIn = (props) => {
    const saveLogInCredentials = (logInData) => {
        props.onSaveLogIn(logInData);
    }

    return(
        <LogInForm onLogInCredentials={saveLogInCredentials} />
    );
}

export default LogIn; 