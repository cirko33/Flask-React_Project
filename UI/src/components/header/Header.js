import React from 'react';
import style from './Header.module.css';
import Button from '../common/Button.js';

const Header = (props) => {
    let text = "Image cannot be found!";
    
    let name = props.isLoggedIn ? "Register" : "Log In";

    return(
        <React.Fragment>
            <header className={style.header}>
                <Button onClick = {props.onHomeClick}>Home</Button>
                <h1>Welcome to online banking!</h1>
                <Button onClick = {props.onLogInClick}>{name}</Button>
            </header>
            <div className={style["image"]}>
                <img src={"https://static01.nyt.com/images/2018/08/26/business/26VIEW.illo/26VIEW.illo-superJumbo.jpg"} alt={text}/>
            </div>
        </React.Fragment>
    )
}

export default Header;