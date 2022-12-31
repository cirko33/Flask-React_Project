import React from "react";
import styles from "./Transaction.module.css";

const Transaction = (props) => {
  return (
    <li className={styles.transaction}>
      <span className={styles.sender}>{props.sender}</span>
      <span className={styles.amount}>{props.amount}</span>
      <span className={styles.currency}>{props.currency}</span>
      <span className={styles.state}>{props.state}</span>
    </li>
  );
};

export default Transaction;
