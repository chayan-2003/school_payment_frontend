import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.success('Login successful!');
      navigate('/dashboard');
      console.log(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-50 md:min-h-screen">
      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-2xl shadow-2xl transform transition-all hover:scale-105 hover:shadow-3xl
      ">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-r from-[#3B2EF5] to-[#6A58F6] text-white flex flex-col justify-center items-center px-6     py-16   sm:py-36 relative text-center">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to Edviron 👋
            </h2>
            <p className="text-base md:text-lg opacity-90 leading-relaxed mb-6">
              Edviron Fintech is a technology-driven financial services company focusing on building innovative digital platforms
            </p>
          </div>

        </div>


        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-12">
          <div className="w-full max-w-sm space-y-4">
            <h2 className="text-2xl font-semibold mb-2 text-center ">Welcome Back!</h2>
            <p className="text-sm mb-6 text-gray-500 text-center md:text-left">
              Don’t have an account?{' '}
              <a href="/register" className="text-indigo-600 font-medium hover:underline">
                Create a new account now
              </a>

            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  'Login Now'
                )}
              </button>
            </form>

            <div className="mt-4 text-sm text-center text-gray-500">
              New User?{' '}
              <a href="/register" className="text-indigo-600 hover:underline">
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
