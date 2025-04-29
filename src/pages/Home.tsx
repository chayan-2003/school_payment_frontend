import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
          Welcome to the Transactions Dashboard
        </h1>
        <p className="text-gray-600 text-lg mb-10">
          Manage and review your transactions effortlessly. Click "Get Started" to log in and begin exploring features like transaction overviews, school-specific details, and status checks.
        </p>
        <button
          onClick={() => navigate('/dashboard')} // Navigate to the login page
          className="bg-indigo-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 text-lg font-semibold"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;