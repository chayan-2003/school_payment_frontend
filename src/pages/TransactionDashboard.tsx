import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTransactions } from '../services/transactionService';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    //Legend,
} from 'recharts';
import { FaArrowLeft, FaMoon, FaSun } from 'react-icons/fa';

const COLORS = ['#4ade80', '#facc15', '#f87171', '#60a5fa', '#c084fc', '#f472b6', '#34d399'];

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface Transaction {
    status?: string;
    gateway_name?: string;
    payment_time: string;
    school_id?: string;
}

interface TimeSeriesData {
    date: string;
    count: number;
}

interface PieChartData {
    name: string;
    value: number;
}

interface BarChartData {
    mode: string;
    count: number;
}

interface TransactionDashboardProps {
    darkMode: boolean;
    toggleTheme: () => void;
}
const TransactionDashboard: React.FC<TransactionDashboardProps> = ({ darkMode, toggleTheme }) => {
    const navigate = useNavigate();
    const [statusCount, setStatusCount] = useState<Record<string, number>>({});
    const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
    const [paymentModeCount, setPaymentModeCount] = useState<Record<string, number>>({});
    const [pendingBySchool, setPendingBySchool] = useState<Record<string, number>>({});

    useEffect(() => {
        const loadData = async () => {
            const result = await fetchTransactions({ limit: 100 });
            const transactions: Transaction[] = result.data;

            const counts: Record<string, number> = {};
            const timeSeriesMap: Record<string, number> = {};
            const paymentModeMap: Record<string, number> = {};
            const pendingSchoolMap: Record<string, number> = {};

            transactions.forEach((tx) => {
                const status = tx.status?.toLowerCase();
                const paymentMode = tx.gateway_name?.toLowerCase();
                const date = new Date(tx.payment_time).toISOString().split('T')[0];
                const schoolId = tx.school_id?.toString() || 'Unknown';

                if (status) counts[status] = (counts[status] || 0) + 1;
                if (paymentMode) paymentModeMap[paymentMode] = (paymentModeMap[paymentMode] || 0) + 1;
                if (date) timeSeriesMap[date] = (timeSeriesMap[date] || 0) + 1;

                if (status === 'pending') {
                    pendingSchoolMap[schoolId] = (pendingSchoolMap[schoolId] || 0) + 1;
                }
            });

            setStatusCount(counts);
            setTimeSeries(Object.entries(timeSeriesMap).map(([date, count]) => ({ date, count })));
            setPaymentModeCount(paymentModeMap);
            setPendingBySchool(pendingSchoolMap);
        };

        loadData();
    }, []);

    const pieDataStatus: PieChartData[] = Object.entries(statusCount).map(([status, value]) => ({
        name: capitalize(status),
        value,
    }));

    const barDataPayment: BarChartData[] = Object.entries(paymentModeCount).map(([mode, value]) => ({
        mode: capitalize(mode),
        count: value,
    }));

    const pieDataPendingSchools: PieChartData[] = Object.entries(pendingBySchool).map(([school, value]) => ({
        name: `${school}`,
        value,
    }));

    const textColor = darkMode ? 'text-gray-300' : 'text-gray-700';
    const headingTextColor = darkMode ? 'text-white' : 'text-gray-700';
    const cardBgColor = darkMode ? 'bg-gray-800' : 'bg-white';
    const cardBorderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
    const chartGridStroke = darkMode ? '#4a5568' : '#e5e7eb';
    const tooltipBgColor = darkMode ? 'bg-gray-700' : 'bg-white';
    const tooltipTextColor = darkMode ? '#cbd5e0' : '#374151';
    const tooltipItemColor = darkMode ? '#64b5f6' : '#3b82f6'; // Keep blue for emphasis
    const lineColor = '#3b82f6'; // Keep blue for the line chart
    const axisTickColor = darkMode ? '#fff' : '#6b7280';

    return (
        <div className={`p-6 min-h-screen space-y-12 pb-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Theme Toggle Button */}
            <div className="absolute top-4 right-4">
                <button onClick={toggleTheme} className="cursor-pointer p-2 rounded-full shadow-md transition-colors duration-300 ease-in-out"
                    style={{
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        color: darkMode ? '#fcd34d' : '#1e3a8a',
                    }}
                    aria-label="Toggle Dark Mode"
                >
                    {darkMode ? <FaSun className="h-5 w-5 motion-reduce:transform-none" /> : <FaMoon className="h-5 w-5 motion-reduce:transform-none" />}
                </button>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className={`cursor-pointer px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-indigo-600 text-indigo-100 hover:bg-indigo-500'
                }`}
            >
                <FaArrowLeft className="inline-block mr-1 animate-bounce" />
                Go to Dashboard
            </button>
            <h2 className={`text-4xl font-extrabold ${headingTextColor} text-center flex items-center justify-center gap-2`}>
                <span className="text-blue-500">📊</span>
                Transaction Insights
            </h2>
            {/* Status Cards */}
            <div className="flex justify-center ">
                <div className="flex gap-6 flex-wrap justify-center max-w-4xl">
                    {Object.entries(statusCount).map(([status, count]) => {
                        const isMiddleThree = ['success', 'pending', 'failed'].includes(status.toLowerCase());
                        const specialCardBg = darkMode ? 'bg-indigo-800 border-indigo-600' : 'bg-indigo-50 border-indigo-500';
                        const specialCardText = darkMode ? 'text-indigo-200' : 'text-indigo-700';
                        const defaultCardText = darkMode ? 'text-gray-400' : 'text-gray-600';
                        const defaultCardValue = darkMode ? 'text-white' : 'text-gray-800';

                        return (
                            <div
                                key={status}
                                className={`rounded-lg p-6 w-40 text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105
                                    ${isMiddleThree ? specialCardBg : cardBgColor}
                                    ${isMiddleThree ? `border-2 ${darkMode ? 'border-indigo-600' : 'border-indigo-500'}` : `border ${cardBorderColor}`}
                                `}
                            >
                                <h4 className={`text-sm font-medium uppercase tracking-wider mb-2 ${isMiddleThree ? specialCardText : defaultCardText}`}>{capitalize(status)}</h4>
                                <p className={`text-2xl font-semibold ${isMiddleThree ? 'text-black' : defaultCardValue}`}>{count}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Line Chart */}
                <div className={`${cardBgColor} rounded-2xl shadow-xl p-6`}>
                    <h4 className={`text-lg font-semibold ${textColor} mb-6 text-center`}>
                        📈 Transactions Over Time
                    </h4>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={timeSeries} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                            <CartesianGrid stroke={chartGridStroke} strokeDasharray="5 5" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12, fill: axisTickColor }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: axisTickColor }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '10px', fontSize: '14px', backgroundColor: tooltipBgColor, color: tooltipTextColor }}
                                labelStyle={{ color: tooltipTextColor }}
                                itemStyle={{ color: tooltipItemColor }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke={lineColor}
                                strokeWidth={3}
                                dot={{ r: 4, stroke: lineColor, strokeWidth: 2, fill: darkMode ? '#2d3748' : 'white' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart - Status Distribution */}
                <div className={`${cardBgColor} rounded-2xl shadow-xl p-6`}>
                    <h4 className={`text-lg font-semibold ${textColor} text-center`}>
                        🧩 Status Distribution
                    </h4>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={pieDataStatus}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={85}
                                innerRadius={50}
                                paddingAngle={4}
                                isAnimationActive={true}
                            >
                                {pieDataStatus.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '10px', fontSize: '14px', backgroundColor: tooltipBgColor, color: tooltipTextColor }}
                                itemStyle={{ color: tooltipTextColor }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Clean, inline legend */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        {pieDataStatus.map((item, index) => (
                            <div key={item.name} className={`flex items-center space-x-2 ${textColor}`}>
                                <span
                                    className="inline-block w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></span>
                                <span>{item.name} ({item.value})</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bar Chart - Payment Modes */}
                <div className={`${cardBgColor} rounded-2xl shadow-xl p-6`}>
                    <h4 className={`text-lg font-semibold ${textColor} mb-6 text-center`}>
                        💳 Payment Mode Usage
                    </h4>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            data={barDataPayment}
                            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
                            <XAxis
                                dataKey="mode"
                                tick={{ fontSize: 12, fill: axisTickColor }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: axisTickColor }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '10px', fontSize: '14px', backgroundColor: tooltipBgColor, color: tooltipTextColor }}
                                itemStyle={{ color: tooltipTextColor }}
                            />
                            <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={36}>
                                {barDataPayment.map((_, index) => (
                                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Optional clean legend below */}
                    <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                        {barDataPayment.map((item, index) => (
                            <div key={item.mode} className={`flex items-center space-x-2 ${textColor}`}>
                                <span
                                    className="inline-block w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></span>
                                <span>{item.mode}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pie Chart - Pending by School */}
                <div className={`${cardBgColor} rounded-2xl shadow-xl p-6`}>
                    <h4 className={`text-lg font-semibold ${textColor} text-center`}>
                        🏫 Pending Transactions by School
                    </h4>
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie
                                data={pieDataPendingSchools}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={false} // No labels at all
                            >
                                {pieDataPendingSchools.map((_, index) => (
                                    <Cell
                                        key={`pending-cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '10px', fontSize: '14px', backgroundColor: tooltipBgColor, color: tooltipTextColor }}
                                itemStyle={{ color: tooltipTextColor }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Beautiful, responsive legend below */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 text-sm">
                        {pieDataPendingSchools.map((item, index) => (
                            <div key={item.name} className={`flex items-center space-x-2 ${textColor}`}>
                                <span
                                    className="inline-block w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></span>
                                <span className="truncate">{item.name} ({item.value})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDashboard;