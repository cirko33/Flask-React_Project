import React from 'react';
import Verify from '../Verify/Verify'
import Balances from '../Balances/Balances';

const Home = (props) => {
    return (<React.Fragment>
        {!props.verified && <Verify />}
        {props.verified && <Balances/>}
    </React.Fragment>)
};

export default Home;
