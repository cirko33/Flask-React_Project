import React, { useState } from 'react';
import Verify from '../Verify/Verify'
import Balances from '../Balances/Balances';
import Exchange from '../Exchange/Exchange';
import Transactions from '../Transactions/Transactions';
import Button from '../common/Button';
import styles from './Home.module.css'

const Home = (props) => {
    const [mode, setMode] = useState(false); //if true exchange money, false transactions
    return (<React.Fragment>
        {!props.verified && <Verify setVerified={props.setVerified}/>}
        {props.verified && mode && <Exchange />}
        {props.verified && <Button onClick={(event) => {setMode(!mode)}}>{mode ? "View transactions" : "Exchange money"}</Button>}
        <div className={styles.parent}>
            <div className={styles.leftContent}>{props.verified && !mode && <Transactions />} </div>
            <div className={styles.rightContent}>{props.verified && <Balances />}</div>
        </div>
    </React.Fragment>)
};

export default Home;
