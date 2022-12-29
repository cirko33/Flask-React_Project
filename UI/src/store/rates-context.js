import React, { useEffect, useState } from "react";

const RatesContext = React.createContext({
    rates: {}
});

export const RatesContextProvider = (props) => {
    const [rates, setRates] = useState({});
    const URL = 'http://api.exchangeratesapi.io/v1/latest?access_key=57d102e76d357aaaab5dba8955ffa5a8';

    useEffect(() => {
        const getRates = async() => {
            try {
                console.log('RERENDERED RATES');
                const response = await fetch(URL, { method: "POST" });
                if(!response.ok) 
                    console.log("Cant get API for currency");
                
                const data = await response.json();
                setRates(data.rates); //Rates in amount of 1 eur
            }
            catch (e) {
                console.log(e);
            }
        }
        
        getRates();
    }, [])

    return (
        <RatesContext.Provider
            value={{rates: rates}}>
                {props.children}
        </RatesContext.Provider>
    )
}

export default RatesContext;

