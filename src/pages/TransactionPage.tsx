import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import TransactionsTable from '../components/TransactionTable';
import { FaMoon, FaSun } from 'react-icons/fa';
import axios from 'axios';

const TransactionsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          withCredentials: true,
        });
        console.log('User is authenticated');
      } catch (err) {
        console.error('User not authenticated:', err);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-start ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'
        } transition-colors duration-300 ease-in-out font-sans`}
    >
      {/* Header with Background Color */}
      <header
        className={`w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-indigo-500 text-white shadow-md'
          }`}
      >
        <h1 className="text-lg sm:text-2xl md:text-4xl font-semibold tracking-tight">
          Transactions
        </h1>
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className={`cursor-pointer mr-4 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-white text-indigo-600 hover:bg-indigo-100'
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="focus:outline-none rounded-md p-2 transition-colors duration-300 ease-in-out"
            style={{
              backgroundColor: darkMode ? '#374151' : 'rgba(255, 255, 255, 0.2)',
              color: darkMode ? '#e5e7eb' : '#fff',
            }}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun className="cursor-pointer h-5 w-5" /> : <FaMoon className="cursor-pointer h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div
          className={`rounded-xl shadow-lg transition-colors duration-300 ease-in-out overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}
        >
          {/* Filter */}
          <div
            className="px-4 sm:px-6 py-5 border-b"
            style={{ borderColor: darkMode ? '#4b5563' : '#e2e8f0' }}
          >
            <Filter darkMode={darkMode} />
          </div>

          {/* Table */}
          <div className="p-4 overflow-x-auto">
            <div className="min-w-full">
              <TransactionsTable darkMode={darkMode} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransactionsPage;