import React, { useState, useRef, useContext } from "react";
import AuthContext from "../../store/auth-context.js";
import Button from "../common/Button.js";
import Input from "../common/Input.js";
import styles from "./Verify.module.css";

const isEmpty = (value) => value.trim().length === 0;
const isCvcLongEnough = (value) => value.trim().length === 3;
const isCreditCardLongEnough = (value) => value.trim().length === 16;

const Verify = (props) => {
  const [formInputValidity, setFormInputsValidity] = useState({
    cardNumber: false,
    expirationDate: false,
    cvc: false,
    userName: false,
  });

  const cardNumberInputRef = useRef();
  const expirationDateInputRef = useRef();
  const cvcInputRef = useRef();
  const userNameInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const saveVerify = async (verifyData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/card/" + sessionStorage.getItem("user"),
        {
          method: "POST",
          body: JSON.stringify(verifyData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        props.setVerified(true);
        // alert("Verification successful. Please login again!");
        // authCtx.onLogout();
        return;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredCardNumber = cardNumberInputRef.current.value;
    const enteredExpirationDate = expirationDateInputRef.current.value;
    const enteredCVC = cvcInputRef.current.value;
    const enteredUserName = userNameInputRef.current.value;

    const enteredCardNumberIsValid =
      !isEmpty(enteredCardNumber) && isCreditCardLongEnough(enteredCardNumber);
    const enteredExpirationDateIsValid = !isEmpty(enteredExpirationDate);
    const enteredCVCIsValid =
      !isEmpty(enteredCVC) && isCvcLongEnough(enteredCVC);
    const enteredUserNameIsValid = !isEmpty(enteredUserName);

    setFormInputsValidity({
      cardNumber: enteredCardNumberIsValid,
      expirationDate: enteredExpirationDateIsValid,
      cvc: enteredCVCIsValid,
      userName: enteredUserNameIsValid,
    });

    const formIsValid =
      enteredCardNumberIsValid &&
      enteredExpirationDateIsValid &&
      enteredCVCIsValid &&
      enteredUserNameIsValid;

    if (!formIsValid) return;

    const verifyData = {
      cardNumber: enteredCardNumber,
      expirationDate: enteredExpirationDate,
      cvc: enteredCVC,
      userName: enteredUserName,
      USDInRSD: 111,
    };

    saveVerify(verifyData);
  };

  const cardNumberControlClasses = `${styles.control} ${
    formInputValidity.cardNumber ? "" : styles.invalid
  }`;
  const expirationDateControlClasses = `${styles.control} ${
    formInputValidity.expirationDate ? "" : styles.invalid
  }`;
  const cvcControlClasses = `${styles.control} ${
    formInputValidity.cvc ? "" : styles.invalid
  }`;
  const userNameControlClasses = `${styles.control} ${
    formInputValidity.userName ? "" : styles.invalid
  }`;

  return (
    <React.Fragment>
      <div className={styles.div}>
        <form className={styles.form} onSubmit={submitHandler}>
          <div className={cardNumberControlClasses}>
            <Input
              ref={cardNumberInputRef}
              label={"Card Number"}
              input={{ id: "cardNumber" }}
            />
          </div>
          <div className={expirationDateControlClasses}>
            <Input
              ref={expirationDateInputRef}
              label={"Expiration Date"}
              input={{ id: "expirationDate" }}
            />
          </div>
          <div className={cvcControlClasses}>
            <Input ref={cvcInputRef} label={"CVC"} input={{ id: "cvc" }} />
          </div>
          <div className={userNameControlClasses}>
            <Input
              ref={userNameInputRef}
              label={"Username:"}
              input={{ id: "userName" }}
            />
          </div>
          <Button type={"submit"}>Verify</Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Verify;
