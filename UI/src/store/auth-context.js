import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext({
    isLoggedIn: false,
    user: null,
    onLogout: () => {},
    onLogin: (logInData) => {},
});

export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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
                throw new Error("Invalid email or password!!!");
            }

            const data = await response.json();
            console.log(data.token);
            setUser(data.token);
            setIsLoggedIn(true);
            sessionStorage.setItem('isLoggedIn', '1');
            sessionStorage.setItem('user', data.token);   
            navigate("/home");  
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
                throw new Error("Error with Logout!!!");
            }

            setUser(null);
            setIsLoggedIn(false);
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('user');    
            sessionStorage.removeItem('verified');
            navigate("/login");       
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
            onLogin: logInHandler
        }}>
            {props.children}       
        </AuthContext.Provider>
    );
};

export default AuthContext;