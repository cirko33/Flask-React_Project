import React, {useEffect, useState} from "react";
import Input from "../common/Input"

const ExchangeForm = (props) => {
    //Treba ubaciti check i onda change money
    const [rates, setRates] = useState({});
    const URL = 'http://api.exchangeratesapi.io/v1/latest?access_key=57d102e76d357aaaab5dba8955ffa5a8';
    const [isValidOldAmount, setValidOldAmount] = useState(false);
    const [isValidOldCurrency, setValidOldCurrency] = useState(false);
    const [isValidNewCurrency, setValidNewCurrency] = useState(false);
    const [oldCurrency, setOldCurrency] = useState("RSD");
    const [newCurrency, setNewCurrency] = useState("RSD");
    const [newAmount, setNewAmount] = useState(-1);

    const oldAmountRef = useRef();
    const authCtx = useContext(AuthContext);

    useEffect(async () => {
        if(rates != {}) return;
        try {
            const response = await fetch(URL, { method: "POST" });
            if(!response.ok) 
                console.log("Cant get API for currency");
            
            const data = await response.json();
            setRates(data.rates); //Rates in amount of 1 eur
            console.log(rates);
        }
        catch (e) {
            console.log(e);
        }
    }, []);

    const checkValid = () => {
        oldAmount = oldAmountRef.current.value;
        setValidOldAmount(false);
        setValidOldCurrency(false);
        setValidNewCurrency(false);

        if(!isEmpty(oldAmount))
            setValidOldAmount(true);
        if(!isEmpty(oldCurrency) && oldCurrency.length === 3)
            setValidOldCurrency(true);
        if(!isEmpty(newCurrency) && newCurrency.length === 3)
            setValidNewCurrency(true);

        if(newCurrency === oldCurrency) {
            alert("Can't change same currency");
            setValidOldCurrency(false);
            setValidNewCurrency(false);
        }

        if(!rates.includes(oldCurrency)) {
            alert("Old currency doesn't exist in API")
            setValidOldCurrency(false);
        }

        if(!rates.includes(newCurrency)) {
            alert("New currency doesn't exist in API")
            setValidNewCurrency(false);
        }

        return isValidNewCurrency && isValidOldCurrency && isValidOldAmount;
    }

    const changeHandler = async(event) => {
        event.preventDefault();
        if(checkValid()) {
            const data = {
                "oldAmount": oldAmount,
                "oldCurrency": oldCurrency,
                "newAmount":  oldAmount / rates[oldCurrency] * rates[newCurrency],
                "newCurrency": newCurrency
            };
            const response = await fetch("http://localhost:5000/exchange/" + authCtx.token, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if(!response.ok) 
                throw new Error("Can't exchange money");
            
            alert("Successfully changed money");
        }
    }

    const checkHandler = (event) => {
        event.preventDefault();
        if(checkValid()) {
            amount = oldAmount / rates[oldCurrency] * rates[newCurrency];
            setNewAmount(amount);
        }
    }

    // const oldAmountCC = `${styles.control} ${isValidOldAmount ? "" : styles.invalid}`;
    // const oldCurrencyCC = `${styles.control} ${isValidOldCurrency ? "" : styles.invalid}`
    // const newCurrencyCC = `${styles.control} ${isValidNewCurrency ? "" : styles.invalid}`

    return (
        <React.Fragment>
            <Input ref={oldAmountRef} label={"Amount to change:"} input={{ id: "oldAmount" }} type="number"/>
            <select value={oldCurrency} onChange={e => setOldCurrency(e.target.value)}>
                {Object.keys(rates).forEach(element => {
                    <option value={element}>{element}</option>
                })}
            </select>
            <label>{newAmount}</label>
            <select value={newCurrency} onChange={e => setNewCurrency(e.target.value)}>
                {Object.keys(rates).forEach(element => {
                    <option value={element}>{element}</option>
                })}
            </select>
            <Button type={'submit'} onClick={checkHandler} /> 
            <Button type={'submit'} onClick={changeHandler}/>
        </React.Fragment>
    );
}

export default ExchangeForm;