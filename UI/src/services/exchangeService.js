const get = async(oldAmount, oldCurrency, newCurrency) => {
    try {
        const response = await fetch(`http://localhost:5000/exchange/${sessionStorage.getItem("user")}?oldValue=${oldAmount}&oldCurrency=${oldCurrency}&newCurrency=${newCurrency}`, {
            method: "GET"
        });

        if(!response.ok) 
            throw new Error(await response.text());

        const data = await response.json();
        return data.value.toFixed(2);
    }
    catch(error) {
        alert(error);
        return null;
    }
} 

const post = async(data) => {
    try {
        const response = await fetch("http://localhost:5000/exchange/" + sessionStorage.getItem("user"), {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if(!response.ok) 
            throw new Error(await response.text());
        
        alert("Successfully changed money")
    }
    catch(error) {
        alert(error);
    }
}

export default {
    get,
    post
}