import React from 'react';
import styles from './Transaction.module.css';

const Transaction = (props) => {
      return (
        <li className={styles.transaction}>
            <div>
                <div className={styles.sender}>{props.sender}</div>
                <div className={styles.amount}>{props.amount}</div>
                <div className={styles.currency}>{props.currency}</div>
                <div className={styles.state}>{props.state}</div>
            </div>
        </li>
      );
}

export default Transaction;