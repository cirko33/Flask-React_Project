import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import style from './Header.module.css';
import Button from '../common/Button.js';
import AuthContext from '../../store/auth-context';

const Header = (props) => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const buttonHandler = () => {
        authCtx.onLogout();
        console.log("Completed logout");
        navigate('/login');
    }

    return (
      <React.Fragment>
        <header className={style.header}>
          <h1>Welcome to online banking!</h1>
          {authCtx.isLoggedIn && props.verified && (
            <nav>
              <ul>
                <li>
                  <NavLink to="/home">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/info">
                    Info
                  </NavLink>
                </li>
              </ul>
            </nav>
          )}
          {authCtx.isLoggedIn && (
            <Button onClick={buttonHandler}>Logout</Button>
          )}
        </header>
      </React.Fragment>
    );
}

export default Header;