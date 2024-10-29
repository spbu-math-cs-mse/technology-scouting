import React from 'react';
import EntryPageVisual from "./components/EntryPage";
import HomePageVisual from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<EntryPageVisual />} />
        <Route path="/home-page" element={<HomePageVisual/>} /> {/* Главная страница */}
      </Routes>
    </Router>
  );
}

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
