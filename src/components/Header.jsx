import React from 'react';

function Header({ exchangeRates }) {
  return (
    <header className="header">
      <div className="logo">
        <h1>Converter</h1>
      </div>
      <div className='header-rates'>
        <p>{`$ ${exchangeRates.USD}`}</p>
        <span className="vertical-line"></span>
        <p>{`€ ${exchangeRates.EUR}`}</p>
      </div>
    </header>
  );
}

export default Header;