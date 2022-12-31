import React, { useState } from 'react';
import Verify from '../Verify/Verify'
import Balances from '../Balances/Balances';
import Exchange from '../Exchange/Exchange';
import Transactions from '../Transactions/Transactions';

const Home = (props) => {
    const [mode, setMode] = useState(false); //if true exchange money, false transactions
    return (<React.Fragment>
        {!props.verified && <Verify setVerified={props.setVerified}/>}
        {props.verified && <Balances />}
        {props.verified && mode && <Exchange />}
        {props.verified && !mode && <Transactions />} 
    </React.Fragment>)
};

export default Home;
