// App.js
import React from 'react';
import './App.css';
import RazorpayCheckout from './Components/RazorpayCheckout.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Store</h1>
      </header>
      <RazorpayCheckout />
    </div>
  );
}

export default App;
