import React, { useState, useRef, useEffect, useContext } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import AuthContext from "../../store/auth-context";
import rates from "../Exchange/ExchangeForm/rates.json";
import styles from "./TransactionForm.module.css";

const isEmpty = (value) => value.trim().length === 0;

const TransacionForm = () => {
  const [formInputValidity, setFormInputsValidity] = useState({
    receiverEmail: true,
    iban: true,
    swift: true,
    amount: true,
    currency: true,
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
        return;
      }

      const data = await response.json();
      setSender(data.email);
    };

    fetchInfo().catch((error) => {
      alert(error.message);
    });

    if (sessionStorage.getItem("refresh") === "1") {
      setTimeout(() => {
        window.location.reload();
      }, 11000);
    }
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
        sessionStorage.setItem("refreshToken", "1");
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

    if (type === "bank") {
      enteredIban = ibanInputRef.current.value;
      enteredSwift = swiftInputRef.current.value;
    }

    const enteredAmount = amountInputRef.current.value;
    const enteredCurrency = currencyInputRef.current.value;

    const enteredReceiverIsValid =
      type === "online"
        ? !isEmpty(enteredReceiver) && enteredReceiver !== sender
        : true;
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

    if (!formIsValid) {
      alert(
        "Error with making transaction. Possible errors: some of fields are empty or you tried to send a transaction to yourself."
      );
    }

    let receiver;
    if (type === "online") {
      receiver = enteredReceiver;
    } else {
      receiver = enteredIban + "_" + enteredSwift;
    }

    const transactionData = {
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
          label={"Email: "}
          input={{ id: "receiver" }}
        />
      </div>
    );
  } else {
    inputContext = (
      <React.Fragment>
        <div className={ibanControlClasses}>
          <Input ref={ibanInputRef} label={"IBAN: "} input={{ id: "iban" }} />
        </div>
        <div className={swiftControlClasses}>
          <Input
            ref={swiftInputRef}
            label={"SWIFT: "}
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
          {inputContext}
          <div className={amountControlClasses}>
            <Input
              ref={amountInputRef}
              label={"Amount: "}
              input={{ id: "amount" }}
              type="number"
            />
          </div>
          <div className={styles.select}>
            <label>Currency: </label>
            <select ref={currencyInputRef}>
              {rates["rates"].map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <Button onClick={onChangeType}>
              {type === "online" ? "Bank" : "Online"}
            </Button>
          </div>
          <Button type={"submit"}>Make new transaction</Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default TransacionForm;
