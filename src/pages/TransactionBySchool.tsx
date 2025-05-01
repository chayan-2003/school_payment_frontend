import { useEffect, useState } from 'react';
import { fetchTransactions } from '../services/transactionService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMoon, FaSun } from 'react-icons/fa';

const TransactionsBySchoolPage = () => {
  const navigate = useNavigate();
  const [schoolId, setSchoolId] = useState('');
  const [schoolOptions, setSchoolOptions] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<
    {
      collect_id: string;
      school_id: string;
      gateway_name: string;
      order_amount: number;
      transaction_amount: number;
      status: string;
      payment_time: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme-transactions-by-school');
    return storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme-transactions-by-school', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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

  useEffect(() => {
    const fetchSchoolIds = async () => {
      try {
        const res = await fetchTransactions({ page: 1, limit: 1000 });
        const uniqueSchoolIds = Array.from(
          new Set((res.data as { school_id: string }[]).map((t) => t.school_id))
        );
        setSchoolOptions(uniqueSchoolIds);
      } catch (err) {
        console.error('Error fetching school IDs:', err);
        setError('Failed to fetch school IDs.');
      }
    };

    fetchSchoolIds();
  }, []);

  const fetchTransactionsBySchool = async () => {
    setTransactions([]); // Clear previous transactions
    if (!schoolId) {
      setError('Please select a school.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/transactions/school/${schoolId}`, {
        withCredentials: true,
      });
      //first clear the previous transactions
      //setTransactions([]);
      setTransactions(res.data.transactions);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions.');
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // UI Classes
  const textColorClass = darkMode ? 'text-gray-100' : 'text-gray-700';
  const bgColorClass = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const headerBgClass = darkMode ? 'bg-indigo-600' : 'bg-indigo-500';
  const inputBorderClass = darkMode ? 'border-gray-600 bg-gray-600 text-gray-300' : 'border-gray-300';
  const buttonClass = `font-semibold py-3 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
    }`;
  const tableHeaderClass = darkMode ? 'bg-gray-600 text-gray-200 border-gray-500' : 'bg-gray-100 text-gray-700 border-gray-200';
  const tableRowClass = darkMode ? 'hover:bg-gray-600 border-gray-500' : 'hover:bg-gray-50 border-gray-200';
  const tableDataClass = darkMode ? 'border-gray-500' : 'border-gray-200';

  return (
    <motion.div
      className={`min-h-screen  ${bgColorClass} transition-colors duration-300 `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-screen-xl lg:rounded-lg overflow-hidden">
        <div className={`${headerBgClass} py-6 px-8 flex items-center justify-between`}>
          <h1 className={`text-2xl font-semibold text-white tracking-wide ${textColorClass}`}>
            School Transaction Data
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/dashboard')}
              className={`cursor-pointer px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-indigo-600 hover:bg-indigo-100'
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full shadow-md transition-colors duration-300 focus:outline-none"
              style={{
                backgroundColor: darkMode ? '#2d3748' : '#ffffff',
                color: darkMode ? '#fcd34d' : '#1e3a8a',
              }}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="p-4 md:p-8">
          <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="w-full md:w-1/2 space-y-4">

              {/* Dropdown */}
              <div className="relative">
                <label htmlFor="school" className={`block text-lg font-medium ${textColorClass} mb-2 mt-10`}>
                  Select School
                </label>
                <select
                  id="school"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className={`block w-full appearance-none px-4 py-3 pr-10 rounded-md shadow-sm border ${inputBorderClass} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${textColorClass}`}
                >
                  <option value="">-- Choose a School --</option>
                  {schoolOptions.map((id) => (
                    <option key={id} value={id} className={textColorClass}>
                      {id}
                    </option>
                  ))}
                </select>

                {/* Arrow icon */}
                <div className="absolute inset-y-0 top-8 right-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${textColorClass}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <button
              onClick={fetchTransactionsBySchool}
              className={`${buttonClass} md:ml-4 w-full md:w-auto md:mt-20 cursor-pointer `}
              disabled={loading || !schoolId}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 inline-block" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0c-4.477 0-8 3.523-8 8z"></path>
                </svg>
              ) : (
                'View Transactions'
              )}
            </button>
          </div>

          {error && (
            <motion.p
              className="text-red-500 mt-4 font-semibold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}

          {transactions.length > 0 && (
            <div className="mt-24 overflow-x-auto overflow-y-auto max-h-[600px] ">
              <h2 className={`text-xl font-semibold ${textColorClass} mb-4`}>Transaction Details</h2>
              <table className={`min-w-full leading-normal border rounded-md ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}>
                <thead>
                  <tr className={tableHeaderClass}>
                    <th className="px-3 md:px-5 py-3 border-b-2 text-left text-xs md:text-sm uppercase font-semibold">Collect ID</th>
                    <th className="px-3 md:px-5 py-3 border-b-2 text-left text-xs md:text-sm uppercase font-semibold">School ID</th>
                    <th className="px-3 md:px-5 py-3 border-b-2 text-left text-xs md:text-sm uppercase font-semibold">Gateway</th>
                    <th className="px-3 md:px-5 py-3 border-b-2 text-left text-xs md:text-sm uppercase font-semibold">Order Amount</th>
                    <th className="px-3 md:px-5 py-3 border-b-2 text-left text-xs md:text-sm uppercase font-semibold">Transaction Amount</th>
                    <th className="px-3 md:px-5 py-3 border-b-2 text-left text-xs md:text-sm uppercase font-semibold">Status</th>
                    <th className="px-3 md:px-5 py-3 border-b-2 text-left text-xs md:text-sm uppercase font-semibold">Payment Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.collect_id}
                      className={`${tableRowClass} transition-colors duration-200`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <td className={`px-3 md:px-5 py-3 border-b ${tableDataClass} text-xs md:text-sm ${textColorClass}`}>{transaction.collect_id}</td>
                      <td className={`px-3 md:px-5 py-3 border-b ${tableDataClass} text-xs md:text-sm ${textColorClass}`}>{transaction.school_id}</td>
                      <td className={`px-3 md:px-5 py-3 border-b ${tableDataClass} text-xs md:text-sm ${textColorClass}`}>{transaction.gateway_name}</td>
                      <td className={`px-3 md:px-5 py-3 border-b ${tableDataClass} text-xs md:text-sm ${textColorClass}`}>₹{transaction.order_amount}</td>
                      <td className={`px-3 md:px-5 py-3 border-b ${tableDataClass} text-xs md:text-sm ${textColorClass}`}>₹{transaction.transaction_amount}</td>
                      <td className={`px-5 py-3 border-b ${tableDataClass} text-sm`}>
                        <span
                          className={`inline-block py-1 px-2 rounded-full text-xs font-semibold ${transaction.status === 'Success'
                              ? darkMode
                                ? 'bg-green-600 text-green-100'
                                : 'bg-green-100 text-green-800'
                              : transaction.status === 'Failed'
                                ? darkMode
                                  ? 'bg-red-600 text-red-100'
                                  : 'bg-red-100 text-red-800'
                                : transaction.status === 'Pending'
                                  ? darkMode
                                    ? 'bg-yellow-600 text-yellow-100'
                                    : 'bg-yellow-100 text-yellow-800'
                                  : darkMode
                                    ? 'bg-gray-600 text-gray-100'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className={`px-3 md:px-5 py-3 border-b ${tableDataClass} text-xs md:text-sm ${textColorClass}`}>{new Date(transaction.payment_time).toLocaleString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionsBySchoolPage;