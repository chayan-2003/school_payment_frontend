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
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const errorMessage = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(', ') 
          : err.response.data.message;
        toast.error(errorMessage); 
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-blue-800 via-blue-100 to-blue-600">
      {/* Wrapper Div to separate Left and Right Panels */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-4xl shadow-2xl transform transition-all hover:scale-105 hover:shadow-3xl bg-white">

        {/* Left Panel */}
        <div className="relative w-full md:w-2/3 flex items-center justify-center rounded-sm overflow-hidden">
          {/* Main Circular Background */}
          <div className="w-[600px] h-[550px] bg-gradient-to-tl from-blue-800 via-blue-500 to-blue-800 rounded-br-full flex flex-col items-center justify-center text-center text-white px-6 z-10 -translate-y-8">
            <div className="-translate-y-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 ">Welcome to Edviron 👋</h2>
              <p className="text-base md:text-lg opacity-90 leading-relaxed mb-6">
                Join Edviron today and experience a smarter way to manage your financial transactions.
              </p>
            </div>
          </div>

          {/* Bottom-left Decorative Circle (half inside box) */}
          <div className="absolute bottom-0 -left-40 w-60 h-60 bg-gradient-to-bl from-blue-800 to-blue-400 rounded-full z-20 shadow-2xl translate-x-1/3 translate-y-1/3" />

          {/* Bottom-right Decorative Circle */}
          <div className="absolute bottom-8 right-4 w-60 h-60 bg-gradient-to-tl from-blue-800 via-blue-700 to-blue-400 rounded-full z-20 shadow-2xl" />
        </div>

        {/* Right Panel */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center rounded-4xl overflow-hidden bg-white p-6 md:p-12">
          <div className="relative w-full max-w-sm space-y-4 z-10">
            <h2 className="text-2xl text-blue-900 md:text-3xl font-semibold text-center mb-4 pt-10">Create an Account</h2>
            <p className="text-sm text-gray-500 text-center md:text-left mb-10">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 font-medium hover:underline">
                Login here
              </a>
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  'Register Now'
                )}
              </button>
            </form>

            <div className="mt-4 text-sm text-center text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 hover:underline">
                Login
              </a>
            </div>
          </div>

          {/* Decorative Circle - contained inside the panel */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-800 via-blue-400 to-blue-600 rounded-full z-0 translate-x-1/2 translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;