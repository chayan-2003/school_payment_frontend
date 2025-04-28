import React, { useState } from 'react';
import Filter from '../components/Filter';
import TransactionsTable from '../components/TransactionTable';
import { FaMoon } from 'react-icons/fa'; // Import a moon icon from react-icons

const TransactionsPage = () => {
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}>
      {/* Header Section */}
      <div className="flex justify-center items-center p-4 space-x-4">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: darkMode ? '#f3f4f6' : '#1f2937',
            color: darkMode ? '#1f2937' : '#f3f4f6',
          }}
        >
          <FaMoon className="mr-2" /> {/* Half-moon icon */}
  
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Group Filter and Table closely */}
        <div
          className={`shadow p-4 space-y-4 shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <Filter darkMode={darkMode} />
          <TransactionsTable darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;