import React, { useState, useContext, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header/Header.js";
import Home from "./components/Home/Home.js";
import LogIn from "./components/LogIn/LogIn.js";
import Register from "./components/Register/Register.js";
import UserInfo from "./components/UserInfo/UserInfo.js";
import AuthContext from "./store/auth-context.js";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [verified, setVerified] = useState(false);
  const authCtx = useContext(AuthContext);

  const logInHandler = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  useEffect(() => {
    const isUserVerified = async () => {
      const response = await fetch(
        "http://localhost:5000/userProfile/" + authCtx.user
      );

      if (!response.ok) {
        throw new Error("Can't retrieve token, nobody is logged in..");
      }

      const data = await response.json();

      setVerified(data.verified);
    };

    isUserVerified().catch((error) => {
      console.log(error.message);
    });
  }, [authCtx.user]);


  return (
    <React.Fragment>
      <Header
        onLogInClick={logInHandler}
        isLoggedIn={isLoggedIn}
        verified={verified}
      ></Header>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <PrivateRoute path="/home" element={<Home verified={verified} setVerified={setVerified}/>} />
        <PrivateRoute path="/info" element={<UserInfo />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
