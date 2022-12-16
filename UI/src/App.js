import React, { useState } from 'react';
import Header from './components/header/Header.js'
import LogIn from './components/LogIn/LogIn.js';
import Register from './components/Register/Register.js';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    
    const logInHandler = () =>{
        setIsLoggedIn(!isLoggedIn);
    }

    const homeHandler = () =>{
        alert("HOME PAGE");
    }

    return (
        <React.Fragment>
            <Header onLogInClick = {logInHandler} onHomeClick={homeHandler} isLoggedIn={isLoggedIn}></Header>
            {isLoggedIn && <LogIn />}
            {!isLoggedIn && <Register />}
        </React.Fragment>
    );
}

export default App;
