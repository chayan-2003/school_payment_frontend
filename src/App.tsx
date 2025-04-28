import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionList from './pages/TransactionPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<TransactionList />} />
      </Routes>
    </Router>
  );
};

export default App;
