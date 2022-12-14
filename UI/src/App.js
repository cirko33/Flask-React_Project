import React, { useState } from 'react';
import Header from './components/Header/Header.js'
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

    const saveLogIn = (logInData) => {
        console.log(logInData);
    }

    const saveRegister = (registerData) => {
        console.log(registerData);
    }

    return (
        <React.Fragment>
            <Header onLogInClick = {logInHandler} onHomeClick={homeHandler} isLoggedIn={isLoggedIn}></Header>
            {isLoggedIn && <LogIn onSaveLogIn={saveLogIn}/>}
            {!isLoggedIn && <Register onSaveRegister={saveRegister}/>}
        </React.Fragment>
    );
}

export default App;
