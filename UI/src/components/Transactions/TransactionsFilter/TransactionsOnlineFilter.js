import React, { useState } from "react";
import ratesData from '../../Exchange/ExchangeForm/rates.json';
import Button from "../../common/Button";
import styles from './TransactionsFilter.module.css';

const TransactionsOnlineFilter = (props) => {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [state, setState] = useState("");

  const rates = ratesData["rates"];
  
  function filterTransactions(transactions, sender, receiver, minAmount, maxAmount, currency, state) {
    let filtered = transactions;
  
    if (sender) {
      filtered = filtered.filter(t => t.sender === sender);
    }
    if (receiver) {
        filtered = filtered.filter(t => t.receiver === receiver);
      }
    if (minAmount) {
      filtered = filtered.filter(t => t.amount >= minAmount);
    }
    if (maxAmount) {
      filtered = filtered.filter(t => t.amount <= maxAmount);
    }
    if (currency) {
      if(currency !== 'All')
      filtered = filtered.filter(t => t.currency === currency);
    }
    if (state) {
      if(state !== 'All')
        filtered = filtered.filter(t => t.state === state);
    }
  
    return filtered;
  }

  
  function handleSubmit(event) {
    event.preventDefault();
    const filtered = filterTransactions(props.list, sender, receiver, minAmount, maxAmount, currency, state);
    props.filterOnlineTransactions(filtered);
  }
  

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="sender">Sender:</label>
      <input
        type="text"
        id="sender"
        value={sender}
        onChange={(event) => setSender(event.target.value)}
      />
      <br />
      <label htmlFor="receiver">Receiver:</label>
      <input
        type="text"
        id="receiver"
        value={receiver}
        onChange={(event) => setReceiver(event.target.value)}
      />
      <br />
      <label htmlFor="min-amount">Min amount:</label>
      <input
        type="number"
        id="min-amount"
        value={minAmount}
        onChange={(event) => setMinAmount(event.target.value)}
      />
      <label htmlFor="max-amount">Max amount:</label>
      <input
        type="number"
        id="max-amount"
        value={maxAmount}
        onChange={(event) => setMaxAmount(event.target.value)}
      />
      <br />
      <label htmlFor="currency">Currency:</label>
      <select
        id="currency"
        value={currency}
        onChange={(event) => setCurrency(event.target.value)}
      >
        <option value="All">All currencies</option>
        {rates.map((key) => (
          <option value={key} key={key}>{key}</option>
        ))}
      </select>
      <br />
      <label htmlFor="state">State:</label>
      <select
        id="state"
        value={state}
        onChange={(event) => setState(event.target.value)}
      >
        <option value="All">All</option>
        <option value="Accepted">Accepted</option>
        <option value="Denied">Denied</option>
      </select>
      <br />
      <Button type={"submit"}>Filter</Button>
    </form>
  );
};

export default TransactionsOnlineFilter;
