import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password) {
      toast.error('Please fill in all fields.');
      setLoading(false);
      return;
    }
    if (password.length < 6 || password.length > 20) {
      toast.error('Password must be between 6 and 20 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
      toast.success('Registration successful!');
      navigate('/login');
      console.log(response.data);
    } catch (err: unknown) {
      console.error('Registration failed:', err);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-2xl shadow-2xl transform transition-all hover:scale-105 hover:shadow-3xl">
        {/* Left Panel with Gradient */}
        <div className="w-full md:w-1/2 bg-gradient-to-r from-[#3B2EF5] to-[#6A58F6] text-white flex flex-col justify-center items-center
        py-16 md:py-40 relative text-center">
          <div className="max-w-md ">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 ">
              Join <span className="text-white">Edviron</span> Today!{' '}
              <span className="text-[#FFD700]">👋</span>
            </h2>
            <p className="text-base md:text-lg opacity-90 leading-relaxed mb-6">
              Register with{' '}
              <span className="text-[#C0A6F7]">Edviron</span> and experience a smarter way to manage your
              <span className="text-[#FFD700]"> financial transactions</span>.
            </p>
          </div>
        </div>


        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-12">
          <div className="w-full max-w-sm space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-center ">Create an Account</h2>

            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
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
                  'Register Now'
                )}
              </button>
            </form>

            <div className="mt-4 text-sm text-center text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 hover:underline">
                Login here
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
