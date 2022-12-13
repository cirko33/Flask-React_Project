import React, { useState } from 'react';
import Header from './components/Header/Header.js'
import LogIn from './components/LogIn/LogIn.js';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    
    const logInHanlder = () =>{
        setIsLoggedIn(true);
    }

    const homeHandler = () =>{
        alert("HOME PAGE");
    }

    const saveLogIn = (logInData) => {
        console.log(logInData);
    }

    return (
        <React.Fragment>
            <Header onLogInClick = {logInHanlder} onHomeClick={homeHandler}></Header>
            {isLoggedIn && <LogIn onSaveLogIn={saveLogIn}/>}
        </React.Fragment>
    );
}

export default App;
