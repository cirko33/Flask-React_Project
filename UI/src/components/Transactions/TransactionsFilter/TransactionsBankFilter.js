import React, { useState } from "react";
import ratesData from '../../Exchange/ExchangeForm/rates.json';
import Button from "../../common/Button";
import styles from './TransactionsFilter.module.css';

const TransactionsBankFilter = (props) => {
    const [iban, setIban] = useState("");
    const [swift, setSwift] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [currency, setCurrency] = useState("");
    const [state, setState] = useState("");
  
    const rates = ratesData["rates"];
    
    function filterTransactions(transactions, iban, swift, minAmount, maxAmount, currency, state) {
      let filtered = transactions;
    
      if (iban) {
        filtered = filtered.filter(t => t.iban === iban);
      }
      if (swift) {
          filtered = filtered.filter(t => t.swift === swift);
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
      const filtered = filterTransactions(props.list, iban, swift, minAmount, maxAmount, currency, state);
      props.filterOnlineTransactions(filtered);
    }
      
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="sender">Iban:</label>
        <input
          type="text"
          id="iban"
          value={iban}
          onChange={(event) => setIban(event.target.value)}
        />
        <br />
        <label htmlFor="swift">Swift:</label>
        <input
          type="text"
          id="swift"
          value={swift}
          onChange={(event) => setSwift(event.target.value)}
        />
        <br />
        <label htmlFor="min-amount">Amount:</label>
        <input
          type="number"
          id="min-amount"
          value={minAmount}
          onChange={(event) => setMinAmount(event.target.value)}
        />─      
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
}

export default TransactionsBankFilter;