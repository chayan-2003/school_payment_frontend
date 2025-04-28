import { fetchTransactions } from './transactionService';

export const getUniqueSchoolIds = async (): Promise<string[]> => {
  try {
    const transactions = await fetchTransactions({
      sortBy: 'payment_time',
      sortOrder: 'asc',
      page: 1,
      limit: 10,
    });

    // Extract unique school IDs
    const uniqueSchoolIds = Array.from(
      new Set(transactions.map((transaction: { school_id: string }) => transaction.school_id))
    ) as string[];

    return uniqueSchoolIds;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};