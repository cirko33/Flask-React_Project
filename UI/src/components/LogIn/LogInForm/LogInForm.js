import React, {useRef, useState, useContext } from "react";
import Input from "../../common/Input.js";
import styles from './LogInForm.module.css';
import Button from '../../common/Button.js';
import AuthContext from "../../../store/auth-context.js";
const isEmpty = (value) => value.trim().length === 0;

const LogInForm = () => {
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const authCtx = useContext(AuthContext);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const submitHandler = (event) => {
        event.preventDefault();
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        if(isEmpty(enteredEmail))
            setIsEmailValid(false);
        else
            setIsEmailValid(true);
        
        if(isEmpty(enteredPassword))
            setIsPasswordValid(false);
        else
            setIsPasswordValid(true);           

        if(isEmailValid && isPasswordValid) {
            const logInData = { email: enteredEmail, password: enteredPassword};
            authCtx.onLogin(logInData);
        }
        else
          return;
    }

    const emailControlClasses = `${styles.control} ${isEmailValid ? "" : styles.invalid}`;
    const passwordControlClasses = `${styles.control} ${isPasswordValid ? "" : styles.invalid}`

    return (
      <React.Fragment>
        <div className={styles.div}>
          <form className={styles.form} onSubmit={submitHandler}>
            <div className={emailControlClasses}>
              <Input
                ref={emailInputRef}
                label={"Email"}
                input={{ id: "email" }}
              />
            </div>
            <div className={passwordControlClasses}>
              <Input
                type={'password'}
                ref={passwordInputRef}
                label={"Password"}
                input={{ id: "password" }}
              />
            </div>
            <Button type={"submit"}>Log In</Button>
          </form>
        </div>
      </React.Fragment>
    );
}

export default LogInForm;