import React from 'react';
import Verify from '../Verify/Verify'

const Home = (props) => {
    return (<React.Fragment>
        {!props.verified && <Verify />}
        {props.verified && <h1>HOME CONTENT</h1>}
    </React.Fragment>)
};

export default Home;
