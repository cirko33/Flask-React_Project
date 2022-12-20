import React, { useContext } from 'react';
import style from './Header.module.css';
import Button from '../common/Button.js';
import AuthContext from '../../store/auth-context';

const Header = (props) => {
    const authCtx = useContext(AuthContext);
    
    let name = props.isLoggedIn ? "Register" : "Log In";

    const buttonHandler = () => {
        authCtx.onLogout();
        console.log("Completed logout");
    }

    return(
        <React.Fragment>
            <header className={style.header}>
                <h1>Welcome to online banking!</h1>
                {!authCtx.isLoggedIn && <Button onClick = {props.onLogInClick}>{name}</Button>}
                {authCtx.isLoggedIn && <Button onClick = {buttonHandler}>Logout</Button>}
            </header>           
        </React.Fragment>
    )
}

export default Header;