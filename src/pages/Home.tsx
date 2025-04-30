import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaEye,
  FaChartLine,
  FaCoins,
  FaArrowRight,
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaListAlt,
  FaMoon,
  FaSun,
} from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode === 'true' || (!storedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut", delayChildren: 0.1, staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <motion.div
      className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'} transition-colors duration-300`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="cursor-pointer fixed top-4 right-4 z-50 p-2 rounded-md shadow-md transition-colors duration-300 focus:outline-none"
        style={{ backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }}
      >
        {darkMode ? <FaSun className="text-yellow-400 text-lg" /> : <FaMoon className="text-gray-600 text-lg" />}
      </button>

      {/* Hero Section */}
      <section className={`py-28 md:py-36 relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-blue-50 via-sky-100 to-indigo-100'}`}>
        <div className="absolute inset-0 bg-opacity-20 dark:bg-opacity-40 backdrop-blur-sm"></div>
        <div className="container mx-auto text-center relative z-10 px-6">
          <motion.h1
            className={`mt-4 text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight ${darkMode ? 'text-blue-300' : 'text-indigo-800'}`}
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Unlock Clarity in {' '}
            <span className="bg-gradient-to-r from-blue-800 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              Your Financial Ecosystem
            </span>
          </motion.h1>
          <motion.p
            className={`text-lg lg:text-xl mt-6 leading-relaxed max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-indigo-500'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            Visualize complex financial transactions with our intuitive, real-time dashboard. Empowering institutions with actionable insights.
          </motion.p>
          <div className="mt-16 flex justify-center space-x-4">
            <motion.button
              onClick={() => navigate('/dashboard')}
              className={`relative bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 overflow-hidden`}
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeInOut" }}
              whileHover={{
                scale: 1.05,
                rotateY: 10,
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 cursor-pointer">
                Go to Dashboard <FaArrowRight className="inline-block ml-2 text-xl animate-bounce" />
              </span>
              {/* Subtle 3D Depth with a pseudo-element */}
              <motion.span
                className="absolute inset-0 bg-indigo-600 rounded-full transform translate-y-1 scale-95 opacity-0 z-0"
                animate={{ opacity: 0 }}
                whileHover={{ y: 0, scale: 1, opacity: 0.15 }}
                transition={{ duration: 0.2 }}
              />
              {/* Animated shine effect */}
              <motion.span
                className="absolute top-0 left-0 w-1/2 h-full bg-white opacity-0 transform skew-x-[-20deg]"
                animate={{ translateX: "-100%", opacity: 0 }}
                whileHover={{ translateX: "150%", opacity: [0.1, 0.4, 0.2, 0] }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          </div>
        </div>
        {/* Subtle visual elements - slowly moving circles */}
        <motion.div
          className={`absolute bottom-10 left-20 transform -translate-x-1/2 translate-y-1/4 w-48 h-48 rounded-full ${darkMode ? 'bg-indigo-700 bg-opacity-20' : 'bg-indigo-200 bg-opacity-30'}`}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -10, 10, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
        <motion.div
          className={`absolute top-1/6 right-1/3 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full ${darkMode ? 'bg-purple-600 bg-opacity-20' : 'bg-purple-200 bg-opacity-30'}`}
          animate={{
            x: [0, 10, -10, 0],
            y: [0, -8, 8, 0],
            scale: [1, 1.02, 0.98, 1],
          }}
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
        <motion.div
          className={`absolute bottom-24 right-1/6 transform translate-x-1/2 translate-y-1/2 w-48 h-48 rounded-full ${darkMode ? 'bg-blue-500 bg-opacity-20' : 'bg-blue-200 bg-opacity-30'}`}
          animate={{
            x: [0, -25, 25, 0],
            y: [0, 12, -12, 0],
            scale: [1, 0.96, 1.04, 1],
          }}
          transition={{
            duration: 9,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </section>

      {/* Features Section */}
      <motion.section
        className={`py-20 md:py-24 relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-indigo-100 via-white to-white'}`}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-opacity-20 dark:bg-opacity-40 backdrop-blur-sm"></div>
        <div className="container mx-auto text-center relative z-10 px-6">
          <motion.h2
            className={`text-3xl lg:text-4xl font-bold tracking-tight ${darkMode ? 'text-purple-300' : 'text-blue-900'} mb-20 mt-4`}
            variants={itemVariants}
          >
            Explore Key Capabilities
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-24">
            {[{
              icon: <FaTachometerAlt />,
              title: 'Real-time Insights',
              description: 'Live data updates for immediate understanding.',
              color: 'blue',
            },
            {
              icon: <FaChartLine />,
              title: 'Trend Analysis',
              description: 'Spot emerging patterns in your financial data.',
              color: 'green',
            },
            {
              icon: <FaCoins />,
              title: 'Payment Monitoring',
              description: 'Track inflows and outflows with ease.',
              color: 'amber',
            },
            {
              icon: <FaFileInvoiceDollar />,
              title: 'Detailed Reports',
              description: 'Generate insightful reports for better oversight.',
              color: 'purple',
            },
            {
              icon: <FaEye />,
              title: 'Intuitive Interface',
              description: 'Clean and simple design for all users.',
              color: 'indigo',
            },
            {
              icon: <FaListAlt />,
              title: 'Transaction History',
              description: 'Quick access to historical financial activities.',
              color: 'teal',
            }]
              .map((feature) => (
                <motion.div
                  key={feature.title}
                  className={`rounded-lg shadow-md p-6 transition-shadow duration-300 hover:shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700 text-purple-200' : 'bg-white border-gray-200 text-purple-700'}`}
                  variants={itemVariants}
                >
                  <div className={`text-${feature.color}-500 text-3xl mb-2`}>{feature.icon}</div>
                  <h3 className={`text-lg font-semibold tracking-tight ${darkMode ? 'text-purple-300' : 'text-gray-700'}`}>{feature.title}</h3>
                  <p className={`text-sm font-light ${darkMode ? 'text-purple-100' : 'text-gray-600'}`}>{feature.description}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.section>
   
      {/* Call to Action Section */}
      <motion.section
        className={`py-24 md:py-24 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-white to-indigo-100'}`}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center px-6">
          <motion.h2
            className={`text-4xl lg:text-5xl font-bold tracking-tight ${darkMode ? 'text-blue-300' : 'text-blue-800'} mb-8`}
            variants={itemVariants}
          >
            Ready to {' '}
            <span className="bg-gradient-to-r from-blue-800 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              Explore Financial Insights?
            </span>
          </motion.h2>
          <motion.p
            className={`text-lg lg:text-xl mt-6 font-light leading-relaxed max-w-3xl mx-auto ${darkMode ? 'text-blue-200' : 'text-gray-600'}`}
            variants={itemVariants}
          >
            Dive into your financial data with a clean and intuitive interface. Discover the clarity you've been searching for.
          </motion.p>
          <div className="mt-10 flex justify-center">
            <motion.button
              onClick={() => navigate('/dashboard')}
              className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeInOut" }}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.97 }}
            >
              Access Dashboard <FaArrowRight className="inline-block ml-2 text-xl animate-ping" />
            </motion.button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;
