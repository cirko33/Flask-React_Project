import React, { useState } from "react";
import "./TransactionsOnline.module.css"

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
      <h1 className="h1-transactionOnline">Your online transactions:</h1>
      <table className="transaction-table">
        <thead>
          <tr>
            <th onClick={() => handleSortClick("sender")}>
              Sender
              {sortField === "sender" && (
                <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
            <th onClick={() => handleSortClick("receiver")}>
              Receiver
              {sortField === "receiver" && (
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
            <tr>
              <td className="sender">{transaction.sender}</td>
              <td className="receiver">{transaction.receiver}</td>
              <td className="amount">{transaction.amount}</td>
              <td className="currency">{transaction.currency}</td>
              <td className="state">{transaction.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default TransactionsOnline;
