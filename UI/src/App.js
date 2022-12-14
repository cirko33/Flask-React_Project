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

    const saveLogIn = async(logInData) => {
        try {
            const response = await fetch(
                "http://localhost:5000/login",
                {
                    method: "POST",
                    body: JSON.stringify(logInData),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = response.json();
            console.log(data);
        } catch (error){
            alert(error.message);
        }
    }

    const saveRegister = async(registerData) => {
         try {
            const response = await fetch(
                "http://localhost:5000/register",
                {
                    method: "POST",
                    body: JSON.stringify(registerData),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = response.json();
            console.log(data);
        } catch (error){
            alert(error.message);
        }
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
