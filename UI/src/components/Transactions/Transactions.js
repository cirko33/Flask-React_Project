import React, { useState, useEffect } from "react";
import TransactionsOnline from "./TransactionsOnline";
import TransactionsBank from './TransactionsBank';
import TransactionForm from "./TransactionForm";
import TransactionsOnlineFilter from "./TransactionsFilter/TransactionsOnlineFilter";
import TransactionsBankFilter from "./TransactionsFilter/TransactionsBankFilter";

const Transactions = () => {
  const [transactionsOnline, setTransactionsOnline] = useState([]);
  const [transactionsBank, setTransactionsBank] = useState([]);
  const [filteredTransactionsOnline, setFilteredTransactionsOnline] = useState([]);
  const [filteredTransactionsBank, setFilteredTransactionsBank] = useState([]);

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
    setFilteredTransactionsOnline(loadedOnlineTransactions);
    setTransactionsBank(loadedBankTransactions); 
    setFilteredTransactionsBank(loadedBankTransactions);
  };

  const filterOnlineTransactionsHandler = (filteredTransactions) => {
    setFilteredTransactionsOnline(filteredTransactions);
  }

  const filterBankTransactionsHandler = (filteredTransactions) => {
    setFilteredTransactionsBank(filteredTransactions);
  }

  useEffect(() => {
    getTransactions().catch((error) => {
      console.log(error.message);
    });
  }, []);

  return (
    <React.Fragment>
      <TransactionForm />
      <TransactionsOnline list={filteredTransactionsOnline}/><br />
      <TransactionsOnlineFilter list={transactionsOnline} filterOnlineTransactions={filterOnlineTransactionsHandler}/><br /><br />
      <TransactionsBank list={filteredTransactionsBank}/><br />
      <TransactionsBankFilter list={transactionsBank} filterBankTransactions={filterBankTransactionsHandler}/>
    </React.Fragment>
  );
};

export default Transactions;
