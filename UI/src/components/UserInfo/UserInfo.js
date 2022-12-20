import React, { useState, useRef, useEffect, useContext } from "react";
import Button from "../common/Button";
import Input from "../common/Input.js";
import AuthContext from "../../store/auth-context.js";
import styles from "../Register/Register.module.css";
import { useNavigate } from "react-router-dom";
const isEmpty = (value) => value.trim().length === 0;

const UserInfo = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const [formInputValidity, setFormInputsValidity] = useState({
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    phoneNumber: false,
    email: false,
  });

  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const addressRef = useRef();
  const cityRef = useRef();
  const phoneRef = useRef();

  const authCtx = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await fetch(
        "http://localhost:5000/userProfile/" + authCtx.user
      );

      if (!response.ok) {
        throw new Error("Can't retrieve token, nobody is logged in..");
      }

      const data = await response.json();
      setEmail(data.email);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setAddress(data.address);
      setCity(data.city);
      setPhone(data.phoneNumber);
    };

    fetchInfo().catch((error) => {
      alert(error.message);
    });
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredFirstName = firstNameRef.current.value;
    const enteredLastName = lastNameRef.current.value;
    const enteredAddress = addressRef.current.value;
    const enteredCity = cityRef.current.value;
    const enteredPhoneNumber = phoneRef.current.value;
    const enteredEmail = emailRef.current.value;

    const enteredFirstNameIsValid = !isEmpty(enteredFirstName);
    const enteredLastNameIsValid = !isEmpty(enteredLastName);
    const enteredAddressIsValid = !isEmpty(enteredAddress);
    const enteredCityIsValid = !isEmpty(enteredCity);
    const enteredPhoneNumberIsValid = !isEmpty(enteredPhoneNumber);
    const enteredEmailIsValid = !isEmpty(enteredEmail);

    setFormInputsValidity({
      firstName: enteredFirstNameIsValid,
      lastName: enteredLastNameIsValid,
      address: enteredAddressIsValid,
      city: enteredCityIsValid,
      phoneNumber: enteredPhoneNumberIsValid,
      email: enteredEmailIsValid,
    });

    const formIsValid =
      enteredFirstName &&
      enteredLastName &&
      enteredAddress &&
      enteredCity &&
      enteredPhoneNumber &&
      enteredEmail;

    if (!formIsValid) return;

    const newData = {
      firstName: enteredFirstName,
      lastName: enteredLastName,
      address: enteredAddress,
      city: enteredCity,
      phoneNumber: enteredPhoneNumber,
      email: enteredEmail,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/userProfile/" + sessionStorage.getItem("user"),
        {
          method: "PATCH",
          body: JSON.stringify(newData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        navigate("/home");
      }
    } catch (error) {
      alert(error.message);
    }
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

  const onChangeFirstName = (event) => {
    setFirstName(event.target.value);
  };
  const onChangeLastName = (event) => {
    setLastName(event.target.value);
  }
  const onChangeAddress = (event) => {
    setAddress(event.target.value);
  }
  const onChangeCity = (event) => {
    setCity(event.target.value);
  }
  const onChangePhoneNumber = (event) => {
    setPhone(event.target.value);
  }
  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  }

  return (
    <React.Fragment>
      <div className={styles.div}>
        <form className={styles.form} onSubmit={submitHandler}>
          <div className={firstNameControlClasses}>
            <Input
              ref={firstNameRef}
              label={"First name"}
              input={{ id: "firstName", value: firstName, onChange: onChangeFirstName }}
            />
          </div>
          <div className={lastNameControlClasses}>
            <Input
              ref={lastNameRef}
              label={"Last name"}
              input={{ id: "lastName", value: lastName, onChange: onChangeLastName }}
            />
          </div>
          <div className={addressControlClasses}>
            <Input
              ref={addressRef}
              label={"Address"}
              input={{ id: "address", value: address, onChange: onChangeAddress }}
            />
          </div>
          <div className={cityControlClasses}>
            <Input
              ref={cityRef}
              label={"City"}
              input={{ id: "city", value: city, onChange: onChangeCity }}
            />
          </div>
          <div className={phoneNumberControlClasses}>
            <Input
              ref={phoneRef}
              label={"Phone number"}
              input={{ id: "phoneNumber", value: phone, onChange: onChangePhoneNumber }}
            />
          </div>
          <div className={emailControlClasses}>
            <Input
              ref={emailRef}
              label={"Email"}
              input={{ id: "email", value: email, onChange: onChangeEmail }}
            />
          </div>
          <Button type={"submit"}>Save</Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default UserInfo;
