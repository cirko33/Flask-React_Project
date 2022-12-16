import React, { useEffect, useState } from "react";

const AuthContext = React.createContext({
    isLoggedIn: false,
    user: null,
    onLogout: (token) => {},
    onLogin: (logInData) => {}
});

export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedIn = sessionStorage.getItem('isLoggedIn');
        const currentUser = sessionStorage.getItem('user');

        if(loggedIn === '1') {
            setIsLoggedIn(true);
            setUser(currentUser);
        }
    }, []);

    const logInHandler = async(logInData) => {
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
            setUser(data.token);
            setIsLoggedIn(true);
            sessionStorage.setItem('isLoggedIn', '1');
            sessionStorage.setItem('user', data.token);           
        } catch (error){
            alert(error.message);
        }
    };

    const logOutHandler = async() => {
        const token = sessionStorage.getItem('user');
        try {
            const response = await fetch(
                "http://localhost:5000/logout/" + token,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            setUser(null);
            setIsLoggedIn(false);
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('user');           
        } catch (error){
            alert(error.message);
        }
    };

    return (
        <AuthContext.Provider
        value={{
            isLoggedIn: isLoggedIn,
            user: user,
            onLogout: logOutHandler,
            onLogIn: logInHandler
        }}>
            {props.children}       
        </AuthContext.Provider>
    );
};

export default AuthContext;