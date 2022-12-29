import React, { useState, useContext, useRef } from "react";
import Input from "../../common/Input";
import Button from "../../common/Button";
import RatesContext from "../../../store/rates-context";

const ExchangeForm = (props) => {
    const [isValidOldAmount, setValidOldAmount] = useState(false);
    const [isValidOldCurrency, setValidOldCurrency] = useState(false);
    const [isValidNewCurrency, setValidNewCurrency] = useState(false);

    const [oldCurrency, setOldCurrency] = useState("RSD");
    const [newCurrency, setNewCurrency] = useState("RSD");
    const [newAmount, setNewAmount] = useState(-1);

    const isEmpty = (value) => value.trim().length === 0;
    const oldAmountRef = useRef();

    const rates = useContext(RatesContext);
    const checkValid = () => {
        const oldAmount = oldAmountRef.current.value;
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
            const oldAmount = oldAmountRef.current.value;
            const data = {
                "oldAmount": oldAmount,
                "oldCurrency": oldCurrency,
                "newAmount":  oldAmount / rates[oldCurrency] * rates[newCurrency],
                "newCurrency": newCurrency
            };

            const response = await fetch("http://localhost:5000/exchange/" + sessionStorage.getItem("token"), {
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
            const oldAmount = oldAmountRef.current.value;
            const amount = oldAmount / rates[oldCurrency] * rates[newCurrency];
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
                {
                    Object.keys(rates).forEach((key) => {
                        <option value={key}>{key}</option>
                    })
                }
            </select>
            <label>{newAmount}</label>
            <select value={newCurrency} onChange={e => setNewCurrency(e.target.value)}>
                {
                    Object.keys(rates).forEach((key) => {
                        <option value={key}>{key}</option>
                    })
                }
            </select>
            <Button type={'submit'} onClick={checkHandler} /> 
            <Button type={'submit'} onClick={changeHandler}/>
        </React.Fragment>
    );
}

export default ExchangeForm;