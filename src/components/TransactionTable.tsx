import React, { useEffect, useState, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchTransactions } from '../services/transactionService.ts';

type Txn = {
  custom_order_id: ReactNode;
  collect_id: string;
  school_id: string;
  gateway_name: string;
  order_amount: number;
  transaction_amount: number;
  status: string;
  payment_time: string;
  student_name?: string;
  phone_number?: string;
  vendor_amount?: number;
};

const TransactionsTable = ({ darkMode }: { darkMode: boolean }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Txn[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalEntries] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const sortBy = searchParams.get('sortBy') || 'payment_time';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';

  useEffect(() => {
    const statusArray = searchParams.getAll('status');
    const schoolIdArray = searchParams.getAll('school_id');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    setCurrentPage(page);
    setPageSize(limit);
    setLoading(true);

    fetchTransactions({
      status: statusArray.length ? statusArray : undefined,
      school_id: schoolIdArray.length ? schoolIdArray : undefined,
      sortBy,
      sortOrder,
      page,
      limit,
      startDate,
      endDate,
    })
      .then(({ data, totalEntries, totalPages }) => {
        setTransactions(data);
        setTotalEntries(totalEntries);
        setTotalPages(totalPages);
      })
      .finally(() => setLoading(false));
  }, [searchParams, sortBy, sortOrder]);

  const updateParams = (updates: Record<string, string>) => {
    const params = Object.fromEntries(searchParams);
    Object.assign(params, updates);
    setSearchParams(params);
  };

  const handleSort = (field: string) => {
    let newOrder: 'asc' | 'desc' = 'asc';
    if (sortBy === field && sortOrder === 'asc') newOrder = 'desc';
    updateParams({ sortBy: field, sortOrder: newOrder });
  };

  const sortIndicator = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage), limit: String(pageSize) });
  };

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return darkMode ? 'text-green-400' : 'text-green-600';
      case 'pending':
        return darkMode ? 'text-orange-400' : 'text-orange-500';
      case 'failed':
        return darkMode ? 'text-red-400' : 'text-red-500';
      default:
        return darkMode ? 'text-gray-300' : 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className={darkMode ? 'bg-gray-900 text-white min-h-screen' : 'bg-white text-gray-900 min-h-screen'}>
      <div className="p-6">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className={`min-w-full border rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <thead className={darkMode ? 'bg-gray-700 text-white text-sm font-semibold' : 'bg-gray-50 text-gray-700 text-sm font-semibold'}>
              <tr>
                <th className="py-3 px-4 text-left">S No.</th>
                <th className="py-3 px-4 text-left">School_Id</th>
                <th className="py-3 px-4 text-left">Date & Time</th>
                <th className="py-3 px-4 text-left">Collect_Id</th>
                <th
                  onClick={() => handleSort('order_amount')}
                  className="py-3 px-4 text-left cursor-pointer select-none"
                >
                  Order Amt{sortIndicator('order_amount')}
                </th>
                <th
                  onClick={() => handleSort('transaction_amount')}
                  className="py-3 px-4 text-left cursor-pointer select-none"
                >
                  Transaction Amt{sortIndicator('transaction_amount')}
                </th>
                <th className="py-3 px-4 text-left">Payment Method</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Custom_Order_ID</th>
              </tr>
            </thead>
            <tbody className={darkMode ? 'text-white divide-y divide-gray-700' : 'text-gray-900 divide-y divide-gray-200'}>
              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-8">
                    No Transactions Found
                  </td>
                </tr>
              ) : (
                transactions.map((txn, idx) => (
                  <tr key={txn.collect_id}>
                    <td className="py-3 px-4">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="py-3 px-4">{txn.school_id}</td>
                    <td className="py-3 px-4">{formatDate(txn.payment_time)}</td>
                    <td className="py-3 px-4">{txn.collect_id}</td>
                    <td className="py-3 px-4">₹{txn.order_amount}</td>
                    <td className="py-3 px-4">₹{txn.transaction_amount}</td>
                    <td className="py-3 px-4">{txn.gateway_name}</td>
                    <td className={`py-3 px-4 font-semibold ${statusColor(txn.status)}`}>{txn.status}</td>
                    <td className="py-3 px-4">{txn.custom_order_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 ${darkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white' : ''}`}
          >
            Previous
          </button>
          <span className="text-sm py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 ${darkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
