import React, { useState, useEffect} from "react";
import styles from './Transactions.module.css'

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

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
    console.log(loadedTransactions);
  
  };

  useEffect(() => {
    getTransactions().catch((error) => {      
      console.log(error.message);
    });
  }, []);

  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = [...transactions];
  if (sortField) {
    sortedTransactions.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
      

  let content = (
    <React.Fragment>
    <h1>YOUR TRANSACTIONS:</h1>
    <table>
  <thead>
    <tr>
      <th onClick={() => handleSortClick('sender')}>
        Sender
        {sortField === 'sender' && (
          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
        )}
      </th>
      <th onClick={() => handleSortClick('amount')}>
        Amount
        {sortField === 'amount' && (
          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
        )}
      </th>
      <th onClick={() => handleSortClick('currency')}>
        Currency
        {sortField === 'currency' && (
          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
        )}
      </th>
      <th onClick={() => handleSortClick('state')}>
        State
        {sortField === 'state' && (
          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
        )}
      </th>
    </tr>
  </thead>
  <tbody>
    {sortedTransactions.map((transaction) => (
      <tr>
        <td>{transaction.sender}</td>
        <td>{transaction.amount}</td>
        <td>{transaction.currency}</td>
        <td>{transaction.state}</td>
      </tr>
    ))}
  </tbody>
</table>

    </React.Fragment>
  );

  return <div className={styles.transactions}>{content}</div>
};

export default Transactions;
