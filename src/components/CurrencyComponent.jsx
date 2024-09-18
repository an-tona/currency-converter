import React, { useState } from 'react';
import currencyToCountryMapping from '../data/currencyToCountryMapping.jsx'

const FLAG_URL = 'https://flagsapi.com/';

function CurrencyComponent(props) {

    const {
        currencyList,
        fromCurrency,
        toCurrency,
        isCurrencyFrom,
        onChangeCurrency,
        onChangeAmount,
        amount,
        exchangeRate
      } = props

      const [isInputFocused, setIsInputFocused] = useState(false);

      const handleFocus = () => setIsInputFocused(true);
      const handleBlur = () => setIsInputFocused(false);

    return (
      <div className={`currency-container ${isInputFocused ? 'focused' : ''}`}>
        <p className='currency-header'>{isCurrencyFrom ? 'Я маю' : 'Я отримаю'}</p>

        <div className='currency-row'>
          <input 
            type='number' 
            value={amount} 
            onChange={onChangeAmount}         
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {fromCurrency && (
              <img
                  src={`${FLAG_URL}/${currencyToCountryMapping[fromCurrency]}/flat/32.png`}
                  alt={fromCurrency}
                  className='currency-flag'
              />
          )}
          <select
            value={fromCurrency}
            onChange={onChangeCurrency}
          >
            <option value="" disabled>Select a currency</option>
            {currencyList.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        {exchangeRate && (
          <p className='exchange-rate'>
            {`1 ${fromCurrency} = ${exchangeRate.toFixed(3)} ${toCurrency}`}
          </p>
        )}
      </div>
    );
  }

export default CurrencyComponent;