import React, { useState, useEffect } from "react";
import TransactionsOnline from "./TransactionsOnline";
import TransactionsBank from './TransactionsBank';
import TransactionForm from "./TransactionForm";

const Transactions = () => {
  const [transactionsOnline, setTransactionsOnline] = useState([]);
  const [transactionsBank, setTransactionsBank] = useState([]);

  const getTransactions = async () => {
    const response = await fetch(
      "http://localhost:5000/transaction/" + sessionStorage.getItem("user")
    );

    if (!response.ok) {
      throw new Error("Can't retrieve token, nobody is logged in..");
    }

    const data = await response.json();
    const loadedOnlineTransactions = [];
    const loadedBankTransactions = [];

    for (const key in data) {
      if(data[key].type === 'online') {
        loadedOnlineTransactions.push({
          id: key,
          pk: data[key].pk,
          currency: data[key].currency,
          amount: data[key].amount,
          state: data[key].state,
          sender: data[key].sender,
          receiver: data[key].receiver
        });
      }
      else {
        const ibanTemp = data[key].receiver.split('_')[0];
        const swiftTemp = data[key].receiver.split('_')[1];

        loadedBankTransactions.push({
          id: key,
          pk: data[key].pk,
          currency: data[key].currency,
          amount: data[key].amount,
          state: data[key].state,
          iban: ibanTemp,
          swift: swiftTemp
        });
      }
    }

    setTransactionsOnline(loadedOnlineTransactions);
    setTransactionsBank(loadedBankTransactions);
  };

  useEffect(() => {
    getTransactions().catch((error) => {
      console.log(error.message);
    });
  }, []);

  return (
    <React.Fragment>
      <TransactionForm />
      <TransactionsOnline list={transactionsOnline}/>
      <TransactionsBank list={transactionsBank}/>
    </React.Fragment>
  );
};

export default Transactions;
