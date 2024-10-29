import React from 'react';
import EntryPageVisual from "./components/EntryPage";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminTable from './components/AdminTable';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<EntryPageVisual />} />
        <Route path="/admin-panel" element={<AdminTable/>} /> {/* Главная страница */}
        <Route path="/" element={<Navigate to="/login" />} />
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
