import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaSpinner, FaSun, FaMoon, FaCheckCircle, FaTimesCircle, FaClock, FaArrowLeft } from 'react-icons/fa';

const TransactionStatusPage = () => {
  const [customOrderId, setCustomOrderId] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  interface Transaction {
    collect_id: string;
    school_id: string;
    gateway_name: string;
    order_amount: number;
    transaction_amount: number;
    status: string;
    payment_time: string;
    customOrderId: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(''); // Clears the error after 5 seconds
      }, 4000);
    }
  }, [error]);

  const fetchTransactionStatus = async () => {
    if (!customOrderId) {
      setError('Please enter your Order ID.');
      return;
    }

    setLoading(true);
    setError('');
    setTransactions([]);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/transaction-status/${customOrderId}`,
        { withCredentials: true }
      );
      setTransactions(response.data);
      if (response.data.length === 0) {
        setError('No transaction found for this Order ID.');
      }
    } catch (err) {
      console.error('Error fetching transaction status:', err);
      setError('Failed to retrieve transaction details. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError('');
      }, 4000);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Pending') return <FaClock className="inline-block mr-2 text-yellow-500" />;
    if (status === 'Failed') return <FaTimesCircle className="inline-block mr-2 text-red-500" />;
    return <FaCheckCircle className="inline-block mr-2 text-green-500" />;
  };

  return (
    <div
      className={`${
        darkMode ? 'bg-zinc-800 text-zinc-200' : 'bg-gray-100 text-zinc-700'
      } min-h-screen  items-center py-8 px-4 sm:px-8 lg:px-16 font-sans transition-all duration-300`}
    >
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">
          Transaction <span className="text-indigo-600 dark:text-indigo-600">Tracker</span>
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-zinc-700 text-white hover:bg-zinc-600'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
          >
            <FaArrowLeft className="inline-block mr-2 animate-bounce" />
            Dashboard
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full focus:outline-none transition-colors duration-200 ${
              darkMode
                ? 'bg-zinc-700 text-yellow-400 hover:bg-zinc-600'
                : 'bg-gray-200 text-yellow-600 hover:bg-gray-300'
            }`}
            aria-label="Toggle Theme"
          >
            {darkMode ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Input Section */}
      <section
        className={`${
          darkMode ? 'bg-zinc-700 text-zinc-200' : 'bg-white text-zinc-700'
        } shadow-md rounded-lg p-6 mb-8`}
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Track Your Order</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <input
              type="text"
              id="customOrderId"
              className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-base leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? 'bg-zinc-800 border-zinc-600 text-zinc-200' : 'bg-white border-gray-300 text-zinc-700'
              }`}
              placeholder="Enter your Order ID"
              value={customOrderId}
              onChange={(e) => setCustomOrderId(e.target.value)}
            />
            <button
              onClick={fetchTransactionStatus}
              className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
              aria-label="Search"
            >
              <FaSearch className={`cursor-pointer h-5 w-5 ${darkMode ? 'text-zinc-400' : 'text-gray-400'}`} />
            </button>
          </div>
          <button
            onClick={fetchTransactionStatus}
            className={`bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-semibold rounded-md py-3 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors duration-200 ${
              loading ? 'cursor-wait' : ''
            }`}
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin mr-2 inline-block" /> : 'Track'}
          </button>
        </div>
        {error && (
          <div
            className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg z-50 animate-slide-in ${
              darkMode ? 'text-yellow-400' : 'text-green-600'
            } border-l-4 ${darkMode ? 'border-yellow-400' : 'border-green-600'}`}
            role="alert"
          >
            <strong className="font-semibold">Error!</strong>
            <span className="block sm:inline ml-1">{error}</span>
          </div>
        )}
      </section>

      {/* Transactions Table */}
      {transactions.length > 0 && (
        <section
          className={`${
            darkMode ? 'bg-zinc-700 text-zinc-200' : 'bg-white text-zinc-700'
          } shadow-md rounded-lg p-6`}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Transaction Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead className={`${darkMode ? 'bg-zinc-600 text-zinc-300' : 'bg-gray-200 text-zinc-700'}`}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Payment Mode</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Date & Time</th>
                  {transactions[0]?.school_id && (
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">School ID</th>
                  )}
                  {transactions[0]?.collect_id && (
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Collect ID</th>
                  )}
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-zinc-800 text-zinc-200' : 'bg-white text-zinc-700'}`}>
                {transactions.map((tx) => (
                  <tr key={tx.collect_id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{tx.customOrderId}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === 'Pending'
                            ? 'bg-yellow-200 text-yellow-800'
                            : tx.status === 'Failed'
                            ? 'bg-red-200 text-red-800'
                            : 'bg-green-200 text-green-800'
                        }`}
                      >
                        {getStatusIcon(tx.status)}
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">₹{tx.transaction_amount}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{tx.gateway_name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {new Date(tx.payment_time).toLocaleString()}
                    </td>
                    {tx.school_id && <td className="px-4 py-4 whitespace-nowrap text-sm">{tx.school_id}</td>}
                    {tx.collect_id && <td className="px-4 py-4 whitespace-nowrap text-sm">{tx.collect_id}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default TransactionStatusPage;