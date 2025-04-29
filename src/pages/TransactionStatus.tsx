import React, { useState } from 'react';
import axios from 'axios';

const TransactionStatusPage = () => {
  const [customOrderId, setCustomOrderId] = useState(''); // Input for customOrderId
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

  const [transactions, setTransactions] = useState<Transaction[]>([]); // Array of transactions
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  // Function to fetch transaction status
  const fetchTransactionStatus = async () => {
    if (!customOrderId) {
      setError('Please enter a valid Custom Order ID.');
      return;
    }

    setLoading(true);
    setError('');
    setTransactions([]); // Clear previous data
    try {
      const response = await axios.get(
        `http://localhost:3000/transaction-status/${customOrderId}`,
        { withCredentials: true } // Ensures cookies are sent
      );
      setTransactions(response.data); // Assuming the backend returns an array
    } catch (err) {
      console.error('Error fetching transaction status:', err);
      setError('Failed to fetch transaction status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Transaction Status</h1>

        {/* Input for Custom Order ID */}
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Fetch Transaction Button */}
        <button
          onClick={fetchTransactionStatus}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Fetch Transactions
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Loading Spinner */}
        {loading && <p className="text-gray-500 mt-4">Loading transactions...</p>}

        {/* Transactions Table */}
        {transactions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Transaction Details</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Collect ID</th>
                  <th className="px-4 py-2 border-b">School ID</th>
                  <th className="px-4 py-2 border-b">Gateway Name</th>
                  <th className="px-4 py-2 border-b">Order Amount</th>
                  <th className="px-4 py-2 border-b">Transaction Amount</th>
                  <th className="px-4 py-2 border-b">Status</th>
                  <th className="px-4 py-2 border-b">Payment Time</th>
                  <th className="px-4 py-2 border-b">Custom Order ID</th>
                </tr>
              </thead>
              <tbody>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={`${transaction.collect_id}-${transaction.payment_time}-${index}`}>
                      <td className="px-4 py-2 border-b">{transaction.collect_id}</td>
                      <td className="px-4 py-2 border-b">{transaction.school_id}</td>
                      <td className="px-4 py-2 border-b">{transaction.gateway_name}</td>
                      <td className="px-4 py-2 border-b">{transaction.order_amount}</td>
                      <td className="px-4 py-2 border-b">{transaction.transaction_amount}</td>
                      <td className="px-4 py-2 border-b">{transaction.status}</td>
                      <td className="px-4 py-2 border-b">{new Date(transaction.payment_time).toLocaleString()}</td>
                      <td className="px-4 py-2 border-b">{transaction.customOrderId}</td>
                    </tr>
                  ))}
                </tbody>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionStatusPage;