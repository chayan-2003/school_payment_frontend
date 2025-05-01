import { useState, useEffect } from 'react';
import {
    XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    Area,
    AreaChart
} from 'recharts';
import {
    FaWallet, FaExchangeAlt, FaSchool, FaMoneyBillAlt, FaMoon, FaSun
} from 'react-icons/fa';
import {
    fetchLineData, fetchRecentTransactions,
    fetchTransactionSummary, fetchTransactionStatusSummary
} from '../services/analyticService';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#3B82F6', '#A78BFA', '#9CA3AF'];

export default function Dashboard() {
    const [lineData, setLineData] = useState<{ month: string; amount: number }[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<{ date: string; id: string; amount: string }[]>([]);
    const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
    const [summary, setSummary] = useState<{
        totalTransactionAmount: number;
        totalTransactions: number;
        totalRegisteredSchools: number;
        totalOrderAmount: number;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTheme = localStorage.getItem('darkMode');
        if (storedTheme === 'true') setDarkMode(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [lineDataResult, recentTransactionsResult, summaryResult, statusResult] = await Promise.all([
                    fetchLineData({}),
                    fetchRecentTransactions({}),
                    fetchTransactionSummary({}),
                    fetchTransactionStatusSummary({}),
                ]);
                setLineData(lineDataResult);
                setRecentTransactions(recentTransactionsResult);
                setSummary(summaryResult);
                setStatusData(statusResult);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newValue = !prev;
            localStorage.setItem('darkMode', newValue.toString());
            return newValue;
        });
    };

    return (
        <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'} min-h-screen`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold">
                        <span className={`${darkMode ? 'text-white' : 'text-black'}`}>Transaction</span>{' '}
                        <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Analytics</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition text-sm"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={toggleDarkMode}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow border text-sm ${darkMode
                                ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
                                : 'bg-white text-black border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            {darkMode ? <FaSun /> : <FaMoon />}
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            label: 'Transaction Amount',
                            value: `₹${summary?.totalTransactionAmount.toLocaleString() || '0'}`,
                            icon: <FaWallet size={24} />,
                        },
                        {
                            label: 'Number of Transactions',
                            value: summary?.totalTransactions.toLocaleString() || '0',
                            icon: <FaExchangeAlt size={24} />,
                        },
                        {
                            label: 'Total Registered Schools',
                            value: summary?.totalRegisteredSchools.toLocaleString() || '0',
                            icon: <FaSchool size={24} />,
                        },
                        {
                            label: 'Total Order Amount',
                            value: `₹${summary?.totalOrderAmount.toLocaleString() || '0'}`,
                            icon: <FaMoneyBillAlt size={24} />,
                        },
                    ].map(({ label, value, icon }, i) => (
                        <div
                            key={i}
                            className={`rounded-xl p-4 text-center shadow border transition duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'
                                }`}
                        >
                            <div className="text-2xl text-blue-500 mb-1">{icon}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">{label}</div>
                            <div className="text-lg font-semibold mt-1">{value}</div>
                        </div>
                    ))}
                </div>

                {/* Pie & Table */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div className={`rounded-xl p-6 shadow border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-4">  <span className={`${darkMode ? 'text-white' : 'text-black'}`}>Status</span>{' '}
                            <span className="text-blue-500">Report</span>{' '}</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    innerRadius={60}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {statusData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="text-right text-sm text-gray-500 mt-2">
                            Total schools: {summary?.totalRegisteredSchools.toLocaleString()}
                        </div>
                    </div>

                    {/* Table */}
                    <div className={`rounded-xl p-6 shadow border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-4">  <span className={`${darkMode ? 'text-white' : 'text-black'}`}>Recent</span>{' '}
                            <span className="text-blue-500">Transactions</span>{' '}</h3>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                        <th className="px-4 py-2 border-b">Date</th>
                                        <th className="px-4 py-2 border-b">School ID</th>

                                        <th className="px-4 py-2 border-b text-right">Amount (INR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((tx, idx) => (
                                        <tr
                                            key={idx}
                                            className={`text-sm transition duration-200 ${idx % 2 === 0
                                                ? darkMode ? 'bg-gray-900' : 'bg-white'
                                                : darkMode ? 'bg-gray-800' : 'bg-gray-50'
                                                }`}
                                        >
                                            <td className="px-4 py-2 border-b">{tx.date}</td>
                                            <td className="px-4 py-2 border-b text-blue-400 truncate">{tx.id}</td>
                                            <td className="px-4 py-2 border-b text-right">{tx.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Line Chart */}
                <div className={`rounded-xl p-6 shadow border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className="text-lg font-semibold mb-4">
                        <span className={`${darkMode ? 'text-white' : 'text-black'}`}>Transaction</span>{' '}
                        <span className="text-blue-500">Report</span>{' '}
                        <span className="text-gray-500 text-sm">for the past 1 year</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
                        ) : (
                            <AreaChart data={lineData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke={darkMode ? '#ddd' : '#333'} />
                                <YAxis stroke={darkMode ? '#ddd' : '#333'} tickFormatter={(v) => `${v} ₹`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: darkMode ? '#1f2937' : '#fff',
                                        borderColor: darkMode ? '#374151' : '#ccc',
                                        color: darkMode ? '#fff' : '#000'
                                    }}
                                    formatter={(value) => `${value} ₹`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#colorAmount)"
                                />
                            </AreaChart>

                        )}
                    </ResponsiveContainer>

                </div>
            </div>
        </div>
    );
}
