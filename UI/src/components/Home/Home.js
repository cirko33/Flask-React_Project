import React, { useState } from 'react';
import Verify from '../Verify/Verify'
import Balances from '../Balances/Balances';
import Exchange from '../Exchange/Exchange';
import Transactions from '../Transactions/Transactions';
import Button from '../common/Button';

const Home = (props) => {
    const [mode, setMode] = useState(false); //if true exchange money, false transactions
    return (<React.Fragment>
        {!props.verified && <Verify setVerified={props.setVerified}/>}
        {props.verified && <Balances />}
        {props.verified && mode && <Exchange />}
        {props.verified && !mode && <Transactions />} 
        {props.verified && <Button onClick={(event) => {setMode(!mode)}}>{mode ? "View transactions" : "Exchange money"}</Button>}
    </React.Fragment>)
};

export default Home;
