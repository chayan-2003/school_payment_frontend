import { fetchTransactions } from './transactionService';

const getDynamicMonthNames = (): string[] => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth(); // Get the current month (0 = January, 11 = December)
  return [...monthNames.slice(currentMonth), ...monthNames.slice(0, currentMonth)];
};

// Function 1: Fetch Line Data
export const fetchLineData = async ({
  school_id,
  startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(), // Default: Last 12 months
  endDate = new Date().toISOString(), // Default: Today
}: {
  school_id?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const { data } = await fetchTransactions({
      school_id,
      sortBy: 'payment_time',
      sortOrder: 'asc',
      startDate,
      endDate,
      limit: 1000,
    });

    const dynamicMonthNames = getDynamicMonthNames(); // Get dynamically ordered month names
    const monthlyData: { [key: string]: number } = {};

    data.forEach((transaction: { payment_time: string; transaction_amount: number }) => {
      const date = new Date(transaction.payment_time);
      const month = dynamicMonthNames[date.getMonth()];
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += transaction.transaction_amount;
    });

    const lineData = dynamicMonthNames.map((month) => ({
      month,
      amount: monthlyData[month] || 0,
    }));

    return lineData;
  } catch (error) {
    console.error('Failed to fetch line data:', error);
    throw new Error('Failed to fetch line data');
  }
};

// Function 2: Fetch Recent Transactions
export const fetchRecentTransactions = async ({
  school_id,
  startDate,
  endDate,
}: {
  school_id?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const { data } = await fetchTransactions({
      school_id,
      sortBy: 'payment_time',
      sortOrder: 'desc',
      startDate,
      endDate,
      limit: 6, // Fetch only the 6 most recent transactions
    });

    const recentTransactions = data.map((transaction: {
      school_id: string;
      payment_time: string;
      transaction_id: string;
      transaction_amount: number;
      custom_order_id: string;
    }) => ({
      date: new Date(transaction.payment_time).toLocaleString(), // Includes both date and time
      id: transaction.school_id,
      amount: transaction.transaction_amount,
    }));

    return recentTransactions;
  } catch (error) {
    console.error('Failed to fetch recent transactions:', error);
    throw new Error('Failed to fetch recent transactions');
  }
};
export const fetchTransactionSummary = async ({
  school_id,
  startDate,
  endDate,
}: {
  school_id?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const { data } = await fetchTransactions({
      school_id,
      sortBy: 'payment_time',
      sortOrder: 'desc',
      startDate,
      endDate,
      limit: 1000, // Fetch a large number of transactions
    });

    // Calculate total transaction amount
    const totalTransactionAmount = data.reduce(
      (sum: number, transaction: { transaction_amount: number }) => sum + transaction.transaction_amount,
      0
    );
    const totalOrderAmount = data.reduce(
      (sum: number, transaction: { order_amount: number }) => sum + transaction.order_amount,
      0
    );

    // Calculate total number of transactions
    const totalTransactions = data.length;

    // Calculate total number of registered schools
    const uniqueSchools = new Set(
      data.map((transaction: { school_id: string }) => transaction.school_id)
    );
    const totalRegisteredSchools = uniqueSchools.size;

    return {
      totalTransactionAmount,
      totalTransactions,
      totalRegisteredSchools,
      totalOrderAmount,
    };
  } catch (error) {
    console.error('Failed to fetch transaction summary:', error);
    throw new Error('Failed to fetch transaction summary');
  }
};
export const fetchTransactionStatusSummary = async ({
  school_id,
  startDate,
  endDate,
}: {
  school_id?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const { data } = await fetchTransactions({
      school_id,
      sortBy: 'payment_time',
      sortOrder: 'desc',
      startDate,
      endDate,
      limit: 1000, // Fetch a large number of transactions
    });

    // Calculate counts for each status
    const statusCounts = data.reduce(
      (counts: { Success: number; Pending: number; Failed: number }, transaction: { status: string }) => {
        if (transaction.status === 'Success') {
          counts.Success += 1;
        } else if (transaction.status === 'Pending') {
          counts.Pending += 1;
        } else if (transaction.status === 'Failed') {
          counts.Failed += 1;
        }
        return counts;
      },
      { Success: 0, Pending: 0, Failed: 0 } // Initial counts
    );

    // Format the data for the pie chart
    const pieData = [
      { name: 'Success', value: statusCounts.Success },
      { name: 'Pending', value: statusCounts.Pending },
      { name: 'Failed', value: statusCounts.Failed },
    ];

    return pieData;
  } catch (error) {
    console.error('Failed to fetch transaction status summary:', error);
    throw new Error('Failed to fetch transaction status summary');
  }
};