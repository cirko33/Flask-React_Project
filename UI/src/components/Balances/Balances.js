import React, { useState, useEffect, useRef} from "react";
import Balance from "./Balance.js";
import styles from './Balances.module.css'
import Button from  '../common/Button.js'
import Input from '../common/Input.js'

const Balances = () => {
  const [balances, setBalances] = useState([]);
  const [isDepositValid, setIsDepositValid] = useState(false);
  const depositInputRef = useRef();

  useEffect(() => {
    const getBalances = async () => {
      const response = await fetch(
        "http://localhost:5000/accountBalance/" + sessionStorage.getItem('user')
      );

      if (!response.ok) {
        throw new Error("Can't retrieve token, nobody is logged in..");
      }

      const data = await response.json();
      const loadedBalances = [];
      for (const key in data) {
        loadedBalances.push({
          id: key,
          pk: data[key].pk,
          currency: data[key].currency,
          amount: data[key].amount
        });
      }

      setBalances(loadedBalances);
    
    };

    getBalances().catch((error) => {      
        console.log(error.message);
      });
  }, [balances]);

  const depositHandler = async (event) => {
    event.preventDefault();
    const enteredDeposit = depositInputRef.current.value;    
    if(enteredDeposit.trim().length === 0 || enteredDeposit <= 0) {
        setIsDepositValid(false);
        alert("ENTER VALID AMOUNT TO DEPOSIT")
    }
    else {
        setIsDepositValid(true);
        const depositData = {
            amount: enteredDeposit
        }
        const response = await fetch(
            "http://localhost:5000/accountBalance/" + sessionStorage.getItem('user'),
            {
              method: "POST",
              body: JSON.stringify(depositData),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (!response.ok) {
            alert(response.statusText)
        }
    }
  }

  const depositControlClasses = `${styles.control} ${isDepositValid ? "" : styles.invalid}`;

  let content = (
    <React.Fragment>
    <h1>YOUR CURRENT BALANCES:</h1>
    <ul>
        {balances.map((balance) => (
          <Balance
            key={balance.id}
            pk={balance.id}
            amount={balance.amount}
            currency={balance.currency}
          />
        ))}
    </ul>
    <form onSubmit={depositHandler} className={styles.form}>
    <div className={depositControlClasses}>
        <Input
            type="number"
            ref={depositInputRef}
            label={"Deposit (RSD)"}
            input={{ id: "deposit" }}
        />
        </div>            
        <Button type={"submit"}>Deposit</Button>
    </form>
    </React.Fragment>
  );

  return <div className={styles.balances}>{content}</div>
};

export default Balances;
