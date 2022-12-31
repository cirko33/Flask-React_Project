#gets currency rates from API once a day
import json, sys, datetime, urllib.request

path = "./Engine/Configuration/rates.json"
def getRatesFromAPI():
    url = 'http://api.exchangeratesapi.io/v1/latest?access_key=57d102e76d357aaaab5dba8955ffa5a8'
    data = urllib.request.urlopen(url).read()
    return json.loads(data)["rates"]

def getDataToSave():
    with open(path, "w+") as file:
        date = datetime.datetime.now().strftime("%d/%m/%Y")
        rates = getRatesFromAPI()
        file.write(json.dumps({"date":date, "rates":rates}))
    return rates

def getRates():
    text = ""
    with open(path, "w+") as file:
        text = file.read()

    try:
        if(text == ""):
            return getDataToSave()

        data = json.loads(text)
        if(["date", "rates"] not in data.keys()):
            return getDataToSave()

        if(data["date"] != datetime.datetime.now().strftime("%d/%m/%Y")):
            return getDataToSave()
        
        return data["rates"]
    except Exception as e:
        print(str(e), sys.stderr)
        return getDataToSave(file)

def exchangeMoney(value, curr1, curr2):
    rates = getRates()
    if(curr1 not in rates.keys()):
        raise Exception(curr1 + " doesn't exist in our system.")

    if(curr2 not in rates.keys()):
        raise Exception(curr2 + " doesn't exist in our system.")

    if(curr1 == "EUR"):
        return value * float(rates[curr2])
    
    if(curr2 == "EUR"):
        return value / float(rates[curr1])

    return value / float(rates[curr1]) * float(rates[curr2])