import React, { useContext } from 'react';
import style from './Header.module.css';
import Button from '../common/Button.js';
import AuthContext from '../../store/auth-context';

const Header = (props) => {
    let text = "Image cannot be found!";
    const authCtx = useContext(AuthContext);
    
    let name = props.isLoggedIn ? "Register" : "Log In";

    const buttonHandler = () => {
        authCtx.onLogout();
        console.log("Completed logout");
    }

    return(
        <React.Fragment>
            <header className={style.header}>
                <Button onClick = {props.onHomeClick}>Home</Button>
                <h1>Welcome to online banking!</h1>
                {!authCtx.isLoggedIn && <Button onClick = {props.onLogInClick}>{name}</Button>}
                {authCtx.isLoggedIn && <Button onClick = {buttonHandler}>Logout</Button>}
            </header>
            <div className={style["image"]}>
                <img src={"https://static01.nyt.com/images/2018/08/26/business/26VIEW.illo/26VIEW.illo-superJumbo.jpg"} alt={text}/>
            </div>
        </React.Fragment>
    )
}

export default Header;