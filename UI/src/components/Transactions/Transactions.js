import React, { useState, useEffect} from "react";
import Transaction from "./Transaction.js";
import styles from './Transactions.module.css'

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  const getTransactions = async () => {
    const response = await fetch(
      "http://localhost:5000/transaction/" + sessionStorage.getItem('user')
    );

    if (!response.ok) {
      throw new Error("Can't retrieve token, nobody is logged in..");
    }

    const data = await response.json();
    const loadedTransactions = [];
    for (const key in data) {
        loadedTransactions.push({
        id: key,
        pk: data[key].pk,
        currency: data[key].currency,
        amount: data[key].amount,
        state: data[key].state,
        sender: data[key].sender
      });
    }

    setTransactions(loadedTransactions);
  
  };

  useEffect(() => {
    getTransactions().catch((error) => {      
      console.log(error.message);
    });
  }, []);

  let content = (
    <React.Fragment>
    <h1>YOUR TRANSACTIONS:</h1>
    <ul>
        {transactions.map((transaction) => (
          <Transaction
            key={transaction.id}
            pk={transaction.id}
            sender={transaction.sender}
            amount={transaction.amount}
            currency={transaction.currency}
            state={transaction.state}
          />
        ))}
    </ul>
    </React.Fragment>
  );

  return <div className={styles.transactions}>{content}</div>
};

export default Transactions;
