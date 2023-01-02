import React, { useState, useRef } from "react";
import Input from "../../common/Input";
import Button from "../../common/Button";
import ratesData from "./rates.json"
import styles from "./ExchangeForm.module.css"
import exchangeService from "../../../services/exchangeService"

const ExchangeForm = (props) => {
    const [isValidOldAmount, setValidOldAmount] = useState(false);
    const [isValidOldCurrency, setValidOldCurrency] = useState(false);
    const [isValidNewCurrency, setValidNewCurrency] = useState(false);

    const [oldCurrency, setOldCurrency] = useState("RSD");
    const [newCurrency, setNewCurrency] = useState("RSD");
    const [newAmount, setNewAmount] = useState("");

    const isEmpty = (value) => value.trim().length === 0;
    const oldAmountRef = useRef();
    const rates = ratesData["rates"];

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
                "newCurrency": newCurrency
            };

            await exchangeService.post(data);
        }
    }

    const checkHandler = async(event) => {
        event.preventDefault();
        if(checkValid()) {
            const oldAmount = oldAmountRef.current.value;
            const data = {
                "oldAmount": oldAmount,
                "oldCurrency": oldCurrency,
                "newCurrency": newCurrency
            };
            const response = await exchangeService.get(data);
            if(response != null) 
                setNewAmount(response);
        }
    }

    // const oldAmountCC = `${styles.control} ${isValidOldAmount ? "" : styles.invalid}`;
    // const oldCurrencyCC = `${styles.control} ${isValidOldCurrency ? "" : styles.invalid}`
    // const newCurrencyCC = `${styles.control} ${isValidNewCurrency ? "" : styles.invalid}`
    
    return (
        <div className={styles.form}>
            <Input  ref={oldAmountRef} label={"Amount to change:"} input={{ id: "oldAmount" }} type="number"/>
            <div className={styles.select}>
                <label>Currency for exchange:   </label>
                <select value={oldCurrency} onChange={e => setOldCurrency(e.target.value)}>
                    {
                        rates.map((key) => 
                            <option value={key}>{key}</option>
                        )
                    }
                </select>
            </div>
            <div className={styles.select}>
                <label>Currency to exchange:   </label>
                <select value={newCurrency} onChange={e => setNewCurrency(e.target.value)}>
                    {
                        rates.map((key) => 
                            <option value={key}>{key}</option>
                        )
                    }
                </select>
            </div>
            <label className={styles.label}>Iznos: {newAmount}</label>
            <br/>
            <Button className={styles.button} onClick={checkHandler}>Check exchange</Button> 
            <Button className={styles.button} onClick={changeHandler}>Exchange money</Button>
        </div>
    );
}

export default ExchangeForm;