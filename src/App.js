import './App.css';
import React, { useState, useEffect } from 'react';
import CurrencyComponent from './components/CurrencyComponent';
import switchLogo from './assets/switch.svg';
import Header from './components/Header';

const CURR_URL = 'https://open.er-api.com/v6/latest/';

function App() {
  const [amount, setAmount] = useState(100);
  const [isAmountFrom, setIsAmountFrom] = useState(true);
  const [currencyList, setCurrencyList] = useState([]);
  const [convertFrom, setConvertFrom] = useState('USD');
  const [convertTo, setConvertTo] = useState('UAH');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState();
  const [headerExchangeRates, setHeaderExchangeRates] = useState({ USD: 0, EUR: 0 });

  // Логіка розрахунку amount для обох полів
  let amountTo = 0, amountFrom = 0;
  if (exchangeRate) {
    if (isAmountFrom) {
      amountFrom = amount;
      amountTo = (amount * exchangeRate).toFixed(3);
    } else {
      amountTo = amount;
      amountFrom = (amount / exchangeRate).toFixed(3);
    }
  }

  // Форматування дати
  function formatDate(dateStr) {
    const originalDate = new Date(dateStr);
  
    const year = originalDate.getUTCFullYear();
    const month = String(originalDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(originalDate.getUTCDate()).padStart(2, '0');
    const hours = String(originalDate.getUTCHours()).padStart(2, '0');
    const minutes = String(originalDate.getUTCMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
  }

  // Запит на перелік валют та курсів
  useEffect(() => {
    fetch(CURR_URL + convertFrom)
      .then(res => res.json())
      .then(data => {
        setCurrencyList(Object.keys(data.rates));
        setExchangeRate(data.rates[convertTo]);
        setLastUpdateTime(formatDate(data.time_last_update_utc));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [convertFrom, convertTo]);

  function handleAmountFromChange(e) {
    setAmount(e.target.value);
    setIsAmountFrom(true);
  }

  function handleAmountToChange(e) {
    setAmount(e.target.value);
    setIsAmountFrom(false);
  }

// Отримання курсів валют відносно UAH
  useEffect(() => {
    const fetchUSD = fetch(CURR_URL + 'USD')
      .then(res => res.json())
      .then(data => ({ USD: data.rates['UAH'] }));

    const fetchEUR = fetch(CURR_URL + 'EUR')
      .then(res => res.json())
      .then(data => ({ EUR: data.rates['UAH'] }));

    Promise.all([fetchUSD, fetchEUR])
      .then(([usdData, eurData]) => {
        setHeaderExchangeRates({
          USD: usdData.USD.toFixed(2),
          EUR: eurData.EUR.toFixed(2)
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Перемикання валют
  const [isRotated, setIsRotated] = useState(false);

  function handleSwitchCurrencies() {
    setConvertFrom(prev => {
      const newFrom = convertTo;
      setConvertTo(prev);
      return newFrom;
    });

    setIsRotated(prev => !prev);
  }

  return (
    <>
      <Header exchangeRates={headerExchangeRates} />
      <section className='converter-container'>
        <div className='converter-header'>
          <h1 className='converter-name'>Конвертер валют</h1>
          <div className='converter-info'>
            <p className='converter-source'>Джерело: <a href='https://open.er-api.com/'>open.er-api.com</a></p>
            <p className='converter-last-update'>Дата оновлення: {lastUpdateTime}</p>
          </div>
        </div>
        
        <div className='converter-body'>
          <CurrencyComponent
            amount={amountFrom}
            currencyList={currencyList}
            fromCurrency={convertFrom}
            toCurrency={convertTo}
            onChangeCurrency={e => setConvertFrom(e.target.value)}
            onChangeAmount={handleAmountFromChange}
            isCurrencyFrom={true}
            exchangeRate={exchangeRate}
          />
          <div className='switch-container'
          onClick={handleSwitchCurrencies}
          >
            <img src={switchLogo} alt="Switch Logo" 
            className={`switch-logo ${isRotated ? 'rotated' : ''}`}
            />
          </div>
          <CurrencyComponent
            amount={amountTo}
            currencyList={currencyList}
            fromCurrency={convertTo}
            toCurrency={convertFrom}
            onChangeCurrency={e => setConvertTo(e.target.value)}
            onChangeAmount={handleAmountToChange}
            isCurrencyFrom={false}
            exchangeRate={exchangeRate ? (1 / exchangeRate) : null}
          />
        </div>
      </section>
    </>
  );
}

export default App;