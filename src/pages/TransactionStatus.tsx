import { useState} from 'react';
import axios from 'axios';
import {
  FaSearch,
  FaSpinner,
  FaSun,
  FaMoon,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowLeft,
} from 'react-icons/fa';
import {toast} from 'sonner';
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




  const fetchTransactionStatus = async () => {
    if (!customOrderId) {
      toast.error('Please enter a Custom Order ID to track.');
      return;
    }

    setLoading(true);
   
    setTransactions([]);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/transaction-status/${customOrderId}`,
        { withCredentials: true }
      );
      setTransactions(response.data);
      if (response.data.length === 0) {
        toast.error('No transactions found for the provided Custom Order ID.');
      }
    } catch (err) {
      console.error('Error fetching transaction status:', err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to fetch transaction status. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Pending') return <FaClock className="inline-block mr-2 text-yellow-500" />;
    if (status === 'Failed') return <FaTimesCircle className="inline-block mr-2 text-red-500" />;
    return <FaCheckCircle className="inline-block mr-2 text-green-500" />;
  };

  return (
    <div className={`${darkMode ? 'bg-zinc-800 text-zinc-200' : 'bg-gray-100 text-zinc-700'} min-h-screen`}>
      <div className="max-w-screen-xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">
            Transaction <span className="text-indigo-600 dark:text-indigo-600">Tracker</span>
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => (window.location.href = '/dashboard')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                darkMode ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              <FaArrowLeft className="mr-2 animate-bounce" />
              Dashboard
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors duration-200 ${
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
          className={`mb-8 p-6 rounded-lg shadow-md ${
            darkMode ? 'bg-zinc-700 text-zinc-200' : 'bg-white text-zinc-700'
          }`}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Track Your Order</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                className={`w-full py-3 px-4 rounded-md border shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-zinc-800 border-zinc-600 text-zinc-200' : 'bg-white border-gray-300'
                }`}
                placeholder="Enter your Custom Order ID (ORD-1002,0RD-1003)"
                value={customOrderId}
                onChange={(e) => setCustomOrderId(e.target.value)}
              />
              <button
                onClick={fetchTransactionStatus}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label="Search"
              >
                <FaSearch className={`h-5 w-5 ${darkMode ? 'text-zinc-400' : 'text-gray-400'}`} />
              </button>
            </div>
            <button
              onClick={fetchTransactionStatus}
              className={`w-full sm:w-auto py-3 px-6 rounded-md text-white font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                loading ? 'cursor-wait bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin mr-2 inline-block" /> : 'Track'}
            </button>
          </div>
          
        </section>

        {/* Transactions Table */}
        {transactions.length > 0 && (
          <section className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-zinc-700' : 'bg-white'}`}>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Transaction Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm leading-normal">
                <thead className={`${darkMode ? 'bg-zinc-600 text-zinc-300' : 'bg-gray-200 text-zinc-700'}`}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold uppercase">Order ID</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase">Payment Mode</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase">Date & Time</th>
                    {transactions[0]?.school_id && (
                      <th className="px-4 py-3 text-left font-semibold uppercase">School ID</th>
                    )}
                    {transactions[0]?.collect_id && (
                      <th className="px-4 py-3 text-left font-semibold uppercase">Collect ID</th>
                    )}
                  </tr>
                </thead>
                <tbody className={darkMode ? 'bg-zinc-800 text-zinc-200' : 'bg-white'}>
                  {transactions.map((tx) => (
                    <tr key={tx.collect_id}>
                      <td className="px-4 py-4 whitespace-nowrap">{tx.customOrderId}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
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
                      <td className="px-4 py-4 whitespace-nowrap">₹{tx.transaction_amount}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{tx.gateway_name}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {new Date(tx.payment_time).toLocaleString()}
                      </td>
                      {tx.school_id && <td className="px-4 py-4 whitespace-nowrap">{tx.school_id}</td>}
                      {tx.collect_id && <td className="px-4 py-4 whitespace-nowrap">{tx.collect_id}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TransactionStatusPage;
