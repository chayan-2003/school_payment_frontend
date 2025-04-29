import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Dashboard</h1>
        <p className="text-gray-600 text-lg">
          Navigate to different sections to manage and review transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        {/* Transactions Overview */}
        <div
          onClick={() => navigate('/transactions')}
          className="cursor-pointer bg-indigo-600 text-white p-8 rounded-2xl shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-3">Transactions Overview</h2>
          <p className="text-sm opacity-90">View and manage all transactions with filters, sorting, and more.</p>
        </div>

        {/* Transactions by School */}
        <div
          onClick={() => navigate('/transactions-by-school')}
          className="cursor-pointer bg-emerald-600 text-white p-8 rounded-2xl shadow-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-3">Transactions by School</h2>
          <p className="text-sm opacity-90">Fetch and display transactions for a specific school.</p>
        </div>

        {/* Transaction Status Check */}
        <div
          onClick={() => navigate('/transaction-status')}
          className="cursor-pointer bg-yellow-500 text-white p-8 rounded-2xl shadow-lg hover:bg-yellow-600 transform hover:scale-105 transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-3">Transaction Status Check</h2>
          <p className="text-sm opacity-90">Check the status of a transaction using a custom order ID.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;