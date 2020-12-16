import React, {useEffect, useState} from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

// Call to the currency exchange API
// This URL can be changed to include exchange rates from 1999 to present. 
const BASE_URL = 'https://api.exchangeratesapi.io/latest'  // replace latest with yyyy-mm-dd format and it gives you the rates at that time

function App() {

const [currencyOptions, setCurrencyOptions] = useState([])
const [fromCurrency, setFromCurrency] = useState()
const [toCurrency, setToCurrency] = useState()
const [exchangeRate, setExchangeRate] = useState()
const [amount, setAmount] = useState(1)
const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

let toAmount, fromAmount
if(amountInFromCurrency){
  fromAmount = amount
  toAmount = amount * exchangeRate
} else {
  toAmount = amount
  fromAmount = amount/exchangeRate
}

//console.log(exchangeRate);
//console.log(currencyOptions);


// A function we want to call when starting the application. We call an annoymous function and pass in an 
// empty array because since an empty array never changes this function will only be called once
useEffect(() =>{
  fetch(BASE_URL) // fetches the API
  .then(res => res.json()) //turns the response to JSON format
  .then(data => {
    //console.log(data);

    const baseCurrency = Object.keys(data.rates)[26]
    setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
    setToCurrency(Object.keys(data.rates)[26])
    setFromCurrency(data.base)
    setExchangeRate(data.rates[baseCurrency])
  })
}, [])

useEffect(() => {
  if(fromCurrency != null && toCurrency != null)
  fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
  .then(res => res.json())
  .then(data => setExchangeRate(data.rates[toCurrency]))

}, [fromCurrency, toCurrency])


function handleFromAmountChange(e){
  setAmount(e.target.value)
  setAmountInFromCurrency(true)
}

function handleToAmountChange(e){
  setAmount(e.target.value)
  setAmountInFromCurrency(false)
}

  return (
    <>
      <h1>Currency Converter </h1>
      <h2>Simply choose the two currencies and change either value and the conversion happens </h2>

      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        amount={fromAmount}
        onChangeAmount={handleFromAmountChange}
      />
      
      <div className="equal">=</div>
      
      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        amount={toAmount}
        onChangeAmount={handleToAmountChange}
      />
    </>
  );
}

export default App;
