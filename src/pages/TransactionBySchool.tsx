import { useEffect, useState } from 'react';
import { fetchTransactions } from '../services/transactionService'; // Import the fetchTransactions function
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
const TransactionsBySchoolPage = () => {
  const [schoolId, setSchoolId] = useState(''); // Selected school ID
  const [schoolOptions, setSchoolOptions] = useState<string[]>([]); // List of unique school IDs
  const [transactions, setTransactions] = useState<{ collect_id: string; school_id: string; gateway_name: string; order_amount: number; transaction_amount: number; status: string; payment_time: string; }[]>([]); // Transactions for the selected school
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  // Fetch all transactions and extract unique school IDs
  const navigate= useNavigate(); // Initialize useNavigate for redirection
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call the /users/me endpoint to verify authentication
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          withCredentials: true, // Ensures cookies are sent
        });
        console.log('User is authenticated');
      } catch (err) {
        console.error('User not authenticated:', err);
        navigate('/login'); // Redirect to login if authentication fails
      }
    };

    checkAuth();
  }, [navigate]);
  useEffect(() => {
    const fetchSchoolIds = async () => {
      try {
        const res = await fetchTransactions({ page: 1, limit: 1000 }); // Fetch all transactions
        const uniqueSchoolIds = Array.from(
          new Set((res.data as { school_id: string }[]).map((t) => t.school_id))
        ); // Extract unique school IDs
        setSchoolOptions(uniqueSchoolIds); // Set school options
      } catch (err) {
        console.error('Error fetching school IDs:', err);
        setError('Failed to fetch school IDs.');
      }
    };

    fetchSchoolIds();
  }, []);

  // Fetch transactions for the selected school
  const fetchTransactionsBySchool = async () => {
    if (!schoolId) {
      setError('Please select a school.');
      return;
    }

    setLoading(true);
    setError('');
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/transactions/school/${schoolId}`, {
          withCredentials: true, // Ensures cookies are sent
        });
        setTransactions(res.data.transactions); // Set transactions
        setLoading(false); // Stop loading
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to fetch transactions.');
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Transactions by School</h1>

        {/* Dropdown to select school */}
        <div className="mb-4">
          <label htmlFor="school" className="block text-sm font-medium text-gray-700">
            Select School
          </label>
          <select
            id="school"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Select a School --</option>
            {schoolOptions.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        {/* Fetch Transactions Button */}
        <button
          onClick={fetchTransactionsBySchool}
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
            <h2 className="text-lg font-semibold mb-4">Transactions</h2>
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
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.collect_id}>
                    <td className="px-4 py-2 border-b">{transaction.collect_id}</td>
                    <td className="px-4 py-2 border-b">{transaction.school_id}</td>
                    <td className="px-4 py-2 border-b">{transaction.gateway_name}</td>
                    <td className="px-4 py-2 border-b">{transaction.order_amount}</td>
                    <td className="px-4 py-2 border-b">{transaction.transaction_amount}</td>
                    <td className="px-4 py-2 border-b">{transaction.status}</td>
                    <td className="px-4 py-2 border-b">{transaction.payment_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsBySchoolPage;