import React, { useState } from "react";
import styles from "./Transactions.module.css";

const TransactionsOnline = (props) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTransactions = [...props.list];
  if (sortField) {
    sortedTransactions.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <React.Fragment>
      <h1>Your bank transactions:</h1>
      <table className={styles.transactionTable}>
        <thead>
          <tr>
            <th onClick={() => handleSortClick("iban")}>
              Iban
              {sortField === "iban" && (
                <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
            <th onClick={() => handleSortClick("swift")}>
              Swift
              {sortField === "swift" && (
                <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
            <th onClick={() => handleSortClick("amount")}>
              Amount
              {sortField === "amount" && (
                <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
            <th onClick={() => handleSortClick("currency")}>
              Currency
              {sortField === "currency" && (
                <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
            <th onClick={() => handleSortClick("state")}>
              State
              {sortField === "state" && (
                <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className={styles.iban}>{transaction.iban}</td>
              <td className={styles.swift}>{transaction.swift}</td>
              <td className={styles.amount}>{transaction.amount}</td>
              <td className={styles.currency}>{transaction.currency}</td>
              <td className={styles.state}>{transaction.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default TransactionsOnline;
