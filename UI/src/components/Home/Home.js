import React, { useState } from 'react';
import Verify from '../Verify/Verify'
import Balances from '../Balances/Balances';
import Exchange from '../Exchange/Exchange'

const Home = (props) => {
    const [mode, setMode] = useState(true); //if true exchange money, false transactions
    return (<React.Fragment>
        {!props.verified && <Verify setVerified={props.setVerified}/>}
        {props.verified && <Balances />}
        {props.verified && mode && <Exchange />}
        {props.verified && !mode && <h1>Transactions</h1>/* Transaction */} 
    </React.Fragment>)
};

export default Home;
