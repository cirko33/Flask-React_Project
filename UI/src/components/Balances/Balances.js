import React, { useState, useEffect} from "react";
import Balance from "./Balance.js";
import styles from './Balances.module.css'

const Balances = () => {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const getBalances = async () => {
      const response = await fetch(
        "http://localhost:5000/accountBalance/" + sessionStorage("user")
      );

      if (!response.ok) {
        throw new Error("Can't retrieve token, nobody is logged in..");
      }

      const data = await response.json();
      const loadedBalances = [];
      for (const key in data) {
        loadedBalances.push({
          pk: data[key].pk,
          currency: data[key].currency,
          amount: data[key].amount
        });
      }
      setTimeout(() => {
        setBalances(loadedBalances);        
      }, 1000);
    };
    getBalances().catch((error) => {      
        console.log(error.message);
      });
  }, []);

  let content = (
    <ul>
        {balances.map((balance) => (
          <Balance
            pk={balance.id}
            amount={balance.amount}
            currency={balance.currency}
          />
        ))}
    </ul>
  );

  return <div className={styles.balances}>{content}</div>
};

export default Balances;
