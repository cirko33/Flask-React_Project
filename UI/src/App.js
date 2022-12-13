import React, { useState } from 'react';
import Header from './components/header/Header.js'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    
    const logInHanlder = () =>{
        setIsLoggedIn(true);
    }

    const homeHandler = () =>{
        alert("HOME PAGE");
    }

    return (
        <React.Fragment>
            <Header onLogInClick = {logInHanlder} onHomeClick={homeHandler}></Header>
            {isLoggedIn && <h1>LOGGOVAN SAM</h1>}
        </React.Fragment>
    );
}

export default App;
