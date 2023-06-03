import React from 'react';
import logo from './logo.svg';
import './App.css';
import Landing from './landing/Landing';
import { ResumeListProvider } from './context/ResumeListContextProvider';

function App() {
  return (
    <ResumeListProvider>
      <ResumeContextProvider>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Landing />
          </header>
        </div>
      </ResumeContextProvider>
    </ResumeListProvider>
  );
}

export default App;
