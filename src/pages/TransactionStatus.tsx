import { useState } from 'react';
import axios from 'axios';

const TransactionStatusPage = () => {
  const [customOrderId, setCustomOrderId] = useState('');
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

  const fetchTransactionStatus = async () => {
    if (!customOrderId) {
      setError('Please enter a valid Custom Order ID.');
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
    } catch (err) {
      console.error('Error fetching transaction status:', err);
      setError('Failed to fetch transaction status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Transaction Status</h1>

        <div className="mb-4">
          <label htmlFor="customOrderId" className="block text-sm font-medium text-gray-700">
            Custom Order ID
          </label>
          <input
            type="text"
            id="customOrderId"
            value={customOrderId}
            onChange={(e) => setCustomOrderId(e.target.value)}
            placeholder="Enter Custom Order ID"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={fetchTransactionStatus}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Fetch Transactions
          </button>
        </div>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {loading && <p className="text-gray-500 mt-4 text-center">Loading transactions...</p>}

        {transactions.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Transaction Details</h2>
            <div>
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm text-gray-700">
              <thead className="bg-indigo-100 text-indigo-800 font-semibold">
                <tr>
                  <th className="px-4 py-2 border">Collect ID</th>
                  <th className="px-4 py-2 border">School ID</th>
                  <th className="px-4 py-2 border">Gateway Name</th>
                  <th className="px-4 py-2 border">Order Amount</th>
                  <th className="px-4 py-2 border">Transaction Amount</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Payment Time</th>
                  <th className="px-4 py-2 border">Custom Order ID</th>
                </tr>
              </thead>

              
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={`${transaction.collect_id}-${transaction.payment_time}-${index}`} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border text-center">{transaction.collect_id}</td>
                    <td className="px-4 py-2 border text-center">{transaction.school_id}</td>
                    <td className="px-4 py-2 border text-center">{transaction.gateway_name}</td>
                    <td className="px-4 py-2 border text-center">{transaction.order_amount}</td>
                    <td className="px-4 py-2 border text-center">{transaction.transaction_amount}</td>
                    <td className="px-4 py-2 border text-center">{transaction.status}</td>
                    <td className="px-4 py-2 border text-center">
                      {new Date(transaction.payment_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border text-center">{transaction.customOrderId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionStatusPage;
