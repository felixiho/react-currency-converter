import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Converter from './components/converter';
import Header from './components/header';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Converter />
      </div>
    );
  }
}

export default App;
