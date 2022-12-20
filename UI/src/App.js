import React, { useState, useContext, useEffect } from 'react';
import Header from './components/Header/Header.js'
import LogIn from './components/LogIn/LogIn.js';
import Register from './components/Register/Register.js';
import Verify from './components/Verify/Verify.js';
import AuthContext from './store/auth-context.js';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [verified, setVerified] = useState(false);
    const authCtx = useContext(AuthContext);    
    
    const logInHandler = () =>{
        setIsLoggedIn(!isLoggedIn);
    }

    const homeHandler = () =>{
        alert("HOME PAGE");
    }

    useEffect(() => {
        const isUserVerified = async() => {
            const response = await fetch(
                "http://localhost:5000/userProfile/" + authCtx.user
            );
        
            if(!response.ok){
                throw new Error("Can't retrieve token, nobody is logged in..");
            }

            const data = await response.json();

            setTimeout(() => {
                setVerified(data.verified);
                console.log(data.verified)
            }, 100);
        }

        isUserVerified().catch((error) => {
            console.log(error.message);
        });

    }, [authCtx.user]);    

    return (
        <React.Fragment>
            <Header onLogInClick = {logInHandler} onHomeClick={homeHandler} isLoggedIn={isLoggedIn}></Header>            
            {(authCtx.isLoggedIn && !verified && <Verify/>) || (isLoggedIn && <LogIn />) || (!isLoggedIn && <Register />)}            
        </React.Fragment>
    );
}

export default App;
