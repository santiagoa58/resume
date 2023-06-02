import React from 'react';
import logo from './logo.svg';
import './App.css';
import Landing from './landing/Landing';
import { ResumeListProvider } from './services/ResumeListContextProvider';

function App() {
  return (
    <ResumeListProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Landing />
        </header>
      </div>
    </ResumeListProvider>
  );
}

export default App;
