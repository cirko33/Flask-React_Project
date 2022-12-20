import React, {useState} from "react";
import Input from "../common/Input"

const ExchangeForm = (props) => {
    //Treba ubaciti check i onda change money
    const [isValidOldAmount, setOldAmount] = useState(false);
    const [isValidOldCurrency, setOldCurrency] = useState(false);
    const [isValidNewCurrency, setNewCurrency] = useState(false);
    const [newAmount, setNewAmount] = useState("");

    const oldAmountRef = useRef();
    const oldCurrencyRef = useRef();
    const newCurrencyRef = useRef();

    const authCtx = useContext(AuthContext);

    const submitHandler = (event) => {
        event.preventDefault();
        let isEmailValidBool = false;
        let isPasswordValidBool = false;
        setIsEmailValid(false);
        setIsPasswordValid(false);
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        if(!isEmpty(enteredEmail))
            isEmailValidBool = true;
            setIsEmailValid(true);
        if(!isEmpty(enteredPassword))
            isPasswordValidBool = true;    
            setIsPasswordValid(true);      

        if(isEmailValidBool && isPasswordValidBool) {
            const logInData = { email: enteredEmail, password: enteredPassword};
            authCtx.onLogin(logInData);
        }
        else
          return;
    }

    const oldAmountCC = `${styles.control} ${isValidOldAmount ? "" : styles.invalid}`;
    const oldCurrencyCC = `${styles.control} ${isValidOldCurrency ? "" : styles.invalid}`
    const newCurrencyCC = `${styles.control} ${isValidNewCurrency ? "" : styles.invalid}`

    return (
        <React.Fragment>
            <Input ref={oldAmountRef} label={"Amount to change:"} input={{ id: "oldAmount" }} type="number"/>
            <Input ref={oldCurrencyRef} label={"Currency to change:"} input={{ id: "oldCurrency" }}/>
            <label>{newAmount}</label>
            <Input ref={newCurrencyRef} label={"Currency to being changed:"} input={{ id: "newCurrency" }}/>
            <Button /> {/*CHECK*/} 
            <Button /> {/*CHANGE*/} 
        </React.Fragment>
    );
}

export default ExchangeForm;