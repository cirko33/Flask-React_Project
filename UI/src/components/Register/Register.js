import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../common/Button.js";
import Input from "../common/Input.js";
import styles from "./Register.module.css";
const isEmpty = (value) => value.trim().length === 0;

const Register = () => {
  const [formInputValidity, setFormInputsValidity] = useState({
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    phoneNumber: false,
    email: false,
    password: false,
  });

  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const addressInputRef = useRef();
  const cityInputRef = useRef();
  const phoneNumberInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const navigate = useNavigate();

  const saveRegister = async (registerData) => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: JSON.stringify(registerData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        navigate("/login");
        return;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredFirstName = firstNameInputRef.current.value;
    const enteredLastName = lastNameInputRef.current.value;
    const enteredAddress = addressInputRef.current.value;
    const enteredCity = cityInputRef.current.value;
    const enteredPhoneNumber = phoneNumberInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const enteredFirstNameIsValid = !isEmpty(enteredFirstName);
    const enteredLastNameIsValid = !isEmpty(enteredLastName);
    const enteredAddressIsValid = !isEmpty(enteredAddress);
    const enteredCityIsValid = !isEmpty(enteredCity);
    const enteredPhoneNumberIsValid = !isEmpty(enteredPhoneNumber);
    const enteredEmailIsValid = !isEmpty(enteredEmail);
    const enteredPasswordIsValid = !isEmpty(enteredPassword);

    setFormInputsValidity({
      firstName: enteredFirstNameIsValid,
      lastName: enteredLastNameIsValid,
      address: enteredAddressIsValid,
      city: enteredCityIsValid,
      phoneNumber: enteredPhoneNumberIsValid,
      email: enteredEmailIsValid,
      password: enteredPasswordIsValid,
    });

    const formIsValid =
      enteredFirstName &&
      enteredLastName &&
      enteredAddress &&
      enteredCity &&
      enteredPhoneNumber &&
      enteredEmail &&
      enteredPassword;

    if (!formIsValid) return;

    const registerData = {
      firstName: enteredFirstName,
      lastName: enteredLastName,
      address: enteredAddress,
      city: enteredCity,
      phoneNumber: enteredPhoneNumber,
      email: enteredEmail,
      password: enteredPassword,
    };

    saveRegister(registerData);
  };

  const firstNameControlClasses = `${styles.control} ${
    formInputValidity.firstName ? "" : styles.invalid
  }`;
  const lastNameControlClasses = `${styles.control} ${
    formInputValidity.lastName ? "" : styles.invalid
  }`;
  const addressControlClasses = `${styles.control} ${
    formInputValidity.address ? "" : styles.invalid
  }`;
  const cityControlClasses = `${styles.control} ${
    formInputValidity.city ? "" : styles.invalid
  }`;
  const phoneNumberControlClasses = `${styles.control} ${
    formInputValidity.phoneNumber ? "" : styles.invalid
  }`;
  const emailControlClasses = `${styles.control} ${
    formInputValidity.email ? "" : styles.invalid
  }`;
  const passwordControlClasses = `${styles.control} ${
    formInputValidity.password ? "" : styles.invalid
  }`;

  return (
    <React.Fragment>
      <div className={styles.div}>
        <form className={styles.form} onSubmit={submitHandler}>
          <div className={firstNameControlClasses}>
            <Input
              ref={firstNameInputRef}
              label={"First name"}
              input={{ id: "firstName" }}
            />
          </div>
          <div className={lastNameControlClasses}>
            <Input
              ref={lastNameInputRef}
              label={"Last name"}
              input={{ id: "lastName" }}
            />
          </div>
          <div className={addressControlClasses}>
            <Input
              ref={addressInputRef}
              label={"Address"}
              input={{ id: "address" }}
            />
          </div>
          <div className={cityControlClasses}>
            <Input ref={cityInputRef} label={"City"} input={{ id: "city" }} />
          </div>
          <div className={phoneNumberControlClasses}>
            <Input
              ref={phoneNumberInputRef}
              label={"Phone number"}
              input={{ id: "phoneNumber" }}
            />
          </div>
          <div className={emailControlClasses}>
            <Input
              ref={emailInputRef}
              label={"Email"}
              input={{ id: "email" }}
            />
          </div>
          <div className={passwordControlClasses}>
            <Input
              type={"password"}
              ref={passwordInputRef}
              label={"Password"}
              input={{ id: "password" }}
            />
          </div>
          <Button type={"submit"}>Register</Button>
          <br />
          <Link to="/login">You already have an account? Login</Link>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Register;
