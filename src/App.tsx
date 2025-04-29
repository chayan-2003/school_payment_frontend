import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionList from './pages/TransactionPage';
import Login from  './components/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TransactionsBySchoolPage from './pages/TransactionBySchool';
import TransactionStatusPage from './pages/TransactionStatus';
import TransactionDashboard from './pages/TransactionDashboard';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>

        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions-by-school" element={<TransactionsBySchoolPage />} />
        <Route path="/transaction-status" element={<TransactionStatusPage />} />
        <Route path="/transaction-dashboard" element={<TransactionDashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
