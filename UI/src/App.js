import React, { useState, useContext, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header/Header.js";
import Home from "./components/Home/Home.js";
import LogIn from "./components/LogIn/LogIn.js";
import Register from "./components/Register/Register.js";
import UserInfo from "./components/UserInfo/UserInfo.js";
import AuthContext from "./store/auth-context.js";
import {set, server, setServer, isServerSet} from "./services/socketing";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [verified, setVerified] = useState(false);
  const authCtx = useContext(AuthContext);

  const logInHandler = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  useEffect(() => {
    if(authCtx.isLoggedIn) {
      setVerified(sessionStorage.getItem('verified') === '1')
      const isUserVerified = async () => {
        const response = await fetch(
          "http://localhost:5000/userProfile/" + authCtx.user
        );

        if (!response.ok) {
          throw new Error("Can't retrieve token, nobody is logged in..");
        }

        const data = await response.json();

        sessionStorage.setItem('verified', data.verified ? "1" : "0");
        setVerified(data.verified);
      };

      isUserVerified().catch((error) => {
        console.log(error.message);
      });
    }
  }, [authCtx.user, authCtx.isLoggedIn]);

  useEffect(() => {
    if(!isServerSet)
      set();
    });

  return (
    <React.Fragment>
      <Header
        onLogInClick={logInHandler}
        isLoggedIn={isLoggedIn}
        verified={verified}
      ></Header>
      <Routes>
        <Route
          path="/login"
          element={authCtx.isLoggedIn ? <Navigate to="/home" /> : <LogIn />}
        />
        <Route
          path="/register"
          element={authCtx.isLoggedIn ? <Navigate to="/home" /> : <Register />}
        />
        <Route
          path="/home"
          element={
            authCtx.isLoggedIn ? (
              <Home verified={verified} setVerified={setVerified} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/info"
          element={authCtx.isLoggedIn ? <UserInfo /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={
            authCtx.isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </React.Fragment>
  );
}

export default App;
