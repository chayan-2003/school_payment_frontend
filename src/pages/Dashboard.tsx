import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaListAlt, FaChartBar, FaSearch, FaChartPie } from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion';
// Fonts
const primaryFont =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const secondaryFont =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const iconVariants = {
  hover: { rotate: 6, scale: 1.1 },
};

const badgeVariants = {
  hover: { backgroundColor: 'rgba(99, 102, 241, 0.2)' }, // Indigo 500
};

const transition = {
  duration: 0.3,
  ease: 'easeInOut',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          withCredentials: true,
        });
        console.log('User is authenticated');
      } catch (err) {
        console.error('User not authenticated:', err);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // UI Classes
  const textColorClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const subtleTextColorClass = darkMode ? 'text-gray-400' : 'text-gray-600';
  const accentColorClass = darkMode ? 'text-indigo-300' : 'text-indigo-600';

  const cardGradientClass = darkMode
    ? 'bg-gradient-to-br from-[#1e293b] to-[#334155]'
    : 'bg-gradient-to-br from-white to-gray-100';
  const cardShadowClass = darkMode
    ? 'shadow-md shadow-black/30'
    : 'shadow-md shadow-gray-300';
  const buttonHoverEffect = 'transition-all duration-300 ease-in-out hover:scale-105';

  const cardBaseClass = `rounded-2xl ${cardGradientClass} ${cardShadowClass} p-6 md:p-8 ${buttonHoverEffect} cursor-pointer hover:ring-2 hover:ring-indigo-500`;

  const iconWrapperClass = `inline-flex items-center justify-center p-3 rounded-full bg-indigo-100 bg-opacity-20 ${accentColorClass}`;

  return (
    <div
      className={` transition-all duration-500 ease-in-out px-6 sm:px-12 lg:px-20 py-32 ${darkMode ? 'bg-gradient-to-t from-gray-600 via-zinc-700 to-zinc-800 text-gray-100' : 'bg-gradient-to-b from-cyan-50 via-indigo-100 to-blue-200 text-gray-900'
        }`}
      style={{ fontFamily: primaryFont }}
    >
      {/* Theme Toggle */}
      <div className="flex items-center justify-end absolute top-6 right-6">
        <button
          onClick={() => navigate('/')}
          className={`cursor-pointer mr-4 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${darkMode
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-white text-indigo-600 hover:bg-indigo-100'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
          Home
        </button>
        <motion.button
          onClick={toggleTheme}
          className="cursor-pointer p-2 rounded-full shadow-md transition-colors duration-300 ease-in-out"
          style={{
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#fcd34d' : '#1e3a8a',
          }}
          aria-label="Toggle Dark Mode"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? <FaSun className="h-5 w-5 motion-reduce:transform-none" /> : <FaMoon className="h-5 w-5 motion-reduce:transform-none" />}
        </motion.button>
      </div>
      {/* Header */}
      <header className="mb-12 text-center">
        <motion.h1
          className={`text-6xl font-extrabold tracking-tight ${textColorClass}`}
          style={{ fontFamily: secondaryFont }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.1 }}
        >
          <span className={accentColorClass}>Dash</span>Board
        </motion.h1>
        <motion.p
          className={`mt-3 text-lg ${subtleTextColorClass}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.2 }}
        >
          Visualize and manage your transactional data with a modern interface.
        </motion.p>
      </header>

      {/* Dashboard Grid */}
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl  mx-auto">
        {/* Top Row: Three Cards */}
        <motion.div
          onClick={() => navigate('/transaction-dashboard')}
          className={cardBaseClass}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ...transition, delay: 0.3 }}
        >
          <motion.div className={iconWrapperClass} variants={iconVariants} whileHover="hover">
            <FaChartPie className="h-6 w-6" />
          </motion.div>
          <h3 className={`mt-4 text-xl font-semibold ${textColorClass}`}>Transaction Stats</h3>
          <p className={`mt-2 text-sm ${subtleTextColorClass}`}>Explore visual statistics of your transaction data.</p>
          <motion.div className="mt-6">
            <motion.span
              className={`inline-block py-1 px-2 rounded-full text-xs font-semibold ${accentColorClass} bg-indigo-500/10`}
              variants={badgeVariants}
              whileHover="hover"
            >
              View Stats
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          onClick={() => navigate('/transactions')}
          className={cardBaseClass}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ...transition, delay: 0.3 }}
        >
          <motion.div className={iconWrapperClass} variants={iconVariants} whileHover="hover">
            <FaListAlt className="h-6 w-6" />
          </motion.div>
          <h3 className={`mt-4 text-xl font-semibold ${textColorClass}`}>Transaction Insights</h3>
          <p className={`mt-2 text-sm ${subtleTextColorClass}`}>Comprehensive view of all transaction records.</p>
          <motion.div className="mt-6">
            <motion.span
              className={`inline-block py-1 px-2 rounded-full text-xs font-semibold ${accentColorClass} bg-indigo-500/10`}
              variants={badgeVariants}
              whileHover="hover"
            >
              Explore Details
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          onClick={() => navigate('/transactions-by-school')}
          className={cardBaseClass}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ...transition, delay: 0.4 }}
        >
          <motion.div className={iconWrapperClass} variants={iconVariants} whileHover="hover">
            <FaChartBar className="h-6 w-6" />
          </motion.div>
          <h3 className={`mt-4 text-xl font-semibold ${textColorClass}`}>School Performance</h3>
          <p className={`mt-2 text-sm ${subtleTextColorClass}`}>In-depth analytics of transactions categorized by school.</p>
          <motion.div className="mt-6">
            <motion.span
              className={`inline-block py-1 px-2 rounded-full text-xs font-semibold ${accentColorClass} bg-indigo-500/10`}
              variants={badgeVariants}
              whileHover="hover"
            >
              Dive Deeper
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl 
       md:max-w-3xl   mx-auto mt-8">
        {/* Bottom Row: Two Cards */}
        <motion.div
          onClick={() => navigate('/transaction-status')}
          className={cardBaseClass}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ...transition, delay: 0.5 }}
        >
          <motion.div className={iconWrapperClass} variants={iconVariants} whileHover="hover">
            <FaSearch className="h-6 w-6" />
          </motion.div>
          <h3 className={`mt-4 text-xl font-semibold ${textColorClass}`}>Transaction Lookup</h3>
          <p className={`mt-2 text-sm ${subtleTextColorClass}`}>Quickly check the status of individual transactions.</p>
          <motion.div className="mt-6">
            <motion.span
              className={`inline-block py-1 px-2 rounded-full text-xs font-semibold ${accentColorClass} bg-indigo-500/10`}
              variants={badgeVariants}
              whileHover="hover"
            >
              Check Status
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          onClick={() => navigate('/payment')}
          className={cardBaseClass}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ...transition, delay: 0.6 }}
        >
          <motion.div className={iconWrapperClass} variants={iconVariants} whileHover="hover">
            <FaChartPie className="h-6 w-6" />
          </motion.div>
          <h3 className={`mt-4 text-xl font-semibold ${textColorClass}`}>Payment Overview</h3>
          <p className={`mt-2 text-sm ${subtleTextColorClass}`}>Manage and track all payment-related activities.</p>
          <motion.div className="mt-6">
            <motion.span
              className={`inline-block py-1 px-2 rounded-full text-xs font-semibold ${accentColorClass} bg-indigo-500/10`}
              variants={badgeVariants}
              whileHover="hover"
            >
              View Payments
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;