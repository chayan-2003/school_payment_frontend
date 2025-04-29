import  { useEffect, useState } from 'react';
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
    Legend,
} from 'recharts';

const COLORS = ['#4ade80', '#facc15', '#f87171', '#60a5fa', '#c084fc', '#f472b6', '#34d399'];

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const TransactionDashboard = () => {
    const [statusCount, setStatusCount] = useState<Record<string, number>>({});
    const [timeSeries, setTimeSeries] = useState<{ date: string; count: number }[]>([]);
    const [paymentModeCount, setPaymentModeCount] = useState<Record<string, number>>({});
    const [pendingBySchool, setPendingBySchool] = useState<Record<string, number>>({});

    useEffect(() => {
        const loadData = async () => {
            const result = await fetchTransactions({ limit: 100 });
            const transactions = result.data;

            const counts: Record<string, number> = {};
            const timeSeriesMap: Record<string, number> = {};
            const paymentModeMap: Record<string, number> = {};
            const pendingSchoolMap: Record<string, number> = {};

            transactions.forEach((tx: { status?: string; gateway_name?: string; payment_time: string; school_id?: string }) => {
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

    const pieDataStatus = Object.entries(statusCount).map(([status, value]) => ({
        name: capitalize(status),
        value,
    }));

    const barDataPayment = Object.entries(paymentModeCount).map(([mode, value]) => ({
        mode: capitalize(mode),
        count: value,
    }));

    const pieDataPendingSchools = Object.entries(pendingBySchool).map(([school, value]) => ({
        name: `${school}`,
        value,
    }));

    return (
        <div className="p-6 bg-gray-100 min-h-screen space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800">📊 Transaction Dashboard</h2>

            {/* Status Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.entries(statusCount).map(([status, count]) => (
                    <div key={status} className="bg-white shadow rounded-xl p-4 text-center">
                        <h4 className="text-xs text-gray-500 uppercase tracking-wide">{capitalize(status)}</h4>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{count}</p>
                    </div>
                ))}
            </div>

            {/* 2x2 Grid of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">📈 Transactions Over Time</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={timeSeries}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart - Status Distribution */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">🧩 Status Distribution</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieDataStatus}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label={({ name, value }) => `${name} (${value})`}
                            >
                                {pieDataStatus.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart - Payment Modes */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">💳 Payment Mode Usage</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barDataPayment}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mode" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" barSize={24}>
                                {barDataPayment.map((_, index) => (
                                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart - Pending by School */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">🏫 Pending Transactions by School</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieDataPendingSchools}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                               
                            >
                                {pieDataPendingSchools.map((_, index) => (
                                    <Cell key={`pending-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TransactionDashboard;
