import React from "react";
import RegisterForm from "./RegisterForm/RegisterForm";

const Register = (props) => {
    const saveRegisterCredentials = (registerData) => {
        props.onSaveRegister(registerData);
    }

    return(
        <RegisterForm onRegisterCredentials={saveRegisterCredentials}/>
    );
}

export default Register;