import React, { useState, useRef, useEffect, useContext } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import AuthContext from "../../store/auth-context";
import styles from "./TransactionForm.module.css";

const isEmpty = (value) => value.trim().length === 0;

const TransacionForm = () => {
  const [formInputValidity, setFormInputsValidity] = useState({
    receiverEmail: false,
    iban: false,
    swift: false,
    amount: false,
    currency: false,
  });

  const [sender, setSender] = useState(null);
  const [type, setType] = useState("online");

  const receiverEmailInputRef = useRef();
  const ibanInputRef = useRef();
  const swiftInputRef = useRef();
  const amountInputRef = useRef();
  const currencyInputRef = useRef();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await fetch(
        "http://localhost:5000/userProfile/" + authCtx.user
      );

      if (!response.ok) {
        throw new Error("Can't retrieve token, nobody is logged in..");
      }

      const data = await response.json();
      setSender(data.email);
    };

    fetchInfo().catch((error) => {
      alert(error.message);
    });
  }, []);

  const makeNewTransaction = async (transactionData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/transaction/" + authCtx.user,
        {
          method: "POST",
          body: JSON.stringify(transactionData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        window.location.reload();
        return;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();

    let enteredReceiver = "";
    let enteredIban = "";
    let enteredSwift = "";
    if (type === "online") {
        enteredReceiver = receiverEmailInputRef.current.value;
    }
    
    if (type === "online") {
      enteredIban = receiverEmailInputRef.current.value;
      enteredSwift = receiverEmailInputRef.current.value;
    }
    
    const enteredAmount = amountInputRef.current.value;
    const enteredCurrency = currencyInputRef.current.value;

    const enteredReceiverIsValid =
      type === "online" ? !isEmpty(enteredReceiver) : true;
    const enteredIbanIsValid = type === "bank" ? !isEmpty(enteredIban) : true;
    const enteredSwiftIsValid = type === "bank" ? !isEmpty(enteredSwift) : true;
    const enteredAmountIsValid = !isEmpty(enteredAmount);
    const enteredCurrencyIsValid = !isEmpty(enteredCurrency);

    setFormInputsValidity({
      receiverEmail: enteredReceiverIsValid,
      iban: enteredIbanIsValid,
      swift: enteredSwiftIsValid,
      amount: enteredAmountIsValid,
      currency: enteredCurrencyIsValid,
    });

    const formIsValid =
      enteredReceiverIsValid &&
      enteredIbanIsValid &&
      enteredSwiftIsValid &&
      enteredAmountIsValid &&
      enteredCurrencyIsValid;

    if (!formIsValid) return;

    let receiver;
    if (type === "online") {
      receiver = enteredReceiver;
    } else {
      receiver = enteredIban + "_" + enteredSwift;
    }

    const transactionData = {
      sender: sender,
      receiver: receiver,
      amount: enteredAmount,
      currency: enteredCurrency,
      type: type,
    };

    makeNewTransaction(transactionData);
  };

  const receiverControlClasses = `${styles.control} ${
    formInputValidity.receiverEmail ? "" : styles.invalid
  }`;
  const ibanControlClasses = `${styles.control} ${
    formInputValidity.iban ? "" : styles.invalid
  }`;
  const swiftControlClasses = `${styles.control} ${
    formInputValidity.swift ? "" : styles.invalid
  }`;
  const amountControlClasses = `${styles.control} ${
    formInputValidity.amount ? "" : styles.invalid
  }`;
  const currencyControlClasses = `${styles.control} ${
    formInputValidity.currency ? "" : styles.invalid
  }`;

  const onChangeType = () => {
    if (type === "online") {
      setType("bank");
    } else {
      setType("online");
    }
  };

  let inputContext;
  if (type === "online") {
    inputContext = (
      <div className={receiverControlClasses}>
        <Input
          ref={receiverEmailInputRef}
          label={"Email"}
          input={{ id: "receiver" }}
        />
      </div>
    );
  } else {
    inputContext = (
      <React.Fragment>
        <div className={ibanControlClasses}>
          <Input
            ref={ibanInputRef}
            label={"IBAN"}
            input={{ id: "iban" }}
          />
        </div>
        <div className={swiftControlClasses}>
          <Input
            ref={swiftInputRef}
            label={"SWIFT"}
            input={{ id: "swift" }}
          />
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className={styles.div}>
        <form className={styles.form} onSubmit={submitHandler}>
          <Button onClick={onChangeType}>
            {type === "online" ? "Bank" : "Online"}
          </Button>
          <br/><br/>
          {inputContext}
          <div className={amountControlClasses}>
            <Input
              ref={amountInputRef}
              label={"Amount"}
              input={{ id: "amount" }}
            />
          </div>
          <div className={currencyControlClasses}>
            <Input
              ref={currencyInputRef}
              label={"Currency"}
              input={{ id: "currency" }}
            />
          </div>
          <Button type={"submit"}>Make new transaction</Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default TransacionForm;
