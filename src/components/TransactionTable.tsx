import { useEffect, useState, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchTransactions } from '../services/transactionService.ts';

type Txn = {
  customOrderId: ReactNode;
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
      .then(({ data, meta }) => {
        setTransactions(data);
        setTotalEntries(meta.totalEntries);
        setTotalPages(meta.totalPages);
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

  // const sortIndicator = (field: string) => {
  //   if (sortBy !== field) return null;
  //   return sortOrder === 'asc' ? ' ⬆' : ' ⬇';
  // };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage), limit: String(pageSize) });
  };

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return darkMode ? 'text-emerald-400' : 'text-emerald-600';
      case 'pending':
        return darkMode ? 'text-amber-400' : 'text-amber-500';
      case 'failed':
        return darkMode ? 'text-rose-400' : 'text-rose-600';
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatSerialNumber = (currentPage: number, pageSize: number, index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div
      className={
        darkMode
          ? 'bg-gray-900 text-gray-200 min-h-screen flex flex-col font-sans'
          : 'bg-white text-gray-800 min-h-screen flex flex-col font-sans'
      }
      style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
    >
      <style>
        {`
          .shadow-md-dark {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
          }
          .loading-spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: ${darkMode ? '#6366f1' : '#3b82f6'}; /* Indigo/Blue */
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto; /* Center the spinner */
            margin-bottom: 8px; /* Add some space below */
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div className="relative py-14">
        {/* Rows Per Page Selector */}
        <div className="absolute top-2 right-2 flex items-center gap-2 ">
          <label htmlFor="rowsPerPage" className={`text-md ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={pageSize}
            onChange={(e) => {
              const newPageSize = parseInt(e.target.value, 10);
              setPageSize(newPageSize);
              updateParams({ page: '1', limit: String(newPageSize) }); // Reset to page 1 when changing page size
            }}
            className={`px-3 py-1.5 rounded-md text-md focus:outline-none cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-lg shadow-md  overflow-auto transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700  md:overflow-hidden">
          <table className={`min-w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <thead className={darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}>
              <tr>
                <th className="px-5 py-4 text-left text-md font-medium tracking-wider ">S No.</th>
                <th className="px-5 py-4 text-left text-md font-medium tracking-wider">School ID</th>
                <th className="px-5 py-4 text-left text-md font-medium tracking-wider">Date</th>
                <th className="px-5 py-4 text-left text-md font-medium tracking-wider">Time</th>
                <th
                  onClick={() => handleSort('order_amount')}
                  className="px-5 py-4 text-left text-sm font-medium tracking-wider cursor-pointer select-none"
                >
                  Order Amt
                  {sortBy === 'order_amount' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
                <th
                  onClick={() => handleSort('transaction_amount')}
                  className="px-5 py-4 text-left text-sm font-medium tracking-wider cursor-pointer select-none"
                >
                  Transaction Amt
                  {sortBy === 'transaction_amount' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
                <th className="px-5 py-4 text-left text-md font-medium tracking-wider">Payment Method</th>
                <th className="px-5 py-4 text-left text-md font-medium tracking-wider">Status</th>
                <th className="px-5 py-4 text-left text-md font-medium tracking-wider">CustomOrderID</th>
              </tr>
            </thead>
            <tbody className={darkMode ? 'bg-gray-900 tbody-dark' : 'bg-white'}>
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-5 py-10 text-center">
                    <div className="loading-spinner"></div>
                    Loading Transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-5 py-10 text-center">
                    No Transactions Found
                  </td>
                </tr>
              ) : (
                transactions.map((txn, idx) => (
                  <tr
                    key={`${txn.collect_id}-${txn.payment_time}-${idx}`}
                    className="transition-transform duration-150 ease-in-out hover:shadow-md transform hover:scale-101 hover:bg-gray-100 dark:hover:bg-gray-800 "
                    style={{ transform: 'translateZ(0)' }}
                  >
                    <td className="px-3 py-4 sm:px-5 sm:py-6 whitespace-nowrap text-sm">{formatSerialNumber(currentPage, pageSize, idx)}</td>
                    <td className="px-3 py-4 sm:px-5 sm:py-6 whitespace-nowrap text-sm">{txn.school_id}</td>
                    <td className="px-3 py-4 sm:px-5 sm:py-6 whitespace-nowrap text-sm">{formatDate(txn.payment_time)}</td>
                    <td className="px-3 py-4 sm:px-5 sm:py-6 whitespace-nowrap text-sm">{formatTime(txn.payment_time)}</td>
                    <td className="px-3 py-4 sm:px-5 sm:py-6 whitespace-nowrap text-sm">₹{txn.order_amount}</td>
                    <td className="px-3 py-4 sm:px-5 sm:py-6 whitespace-nowrap text-sm">₹{txn.transaction_amount}</td>
                    <td className="px-3 py-4 sm:px-5 sm:py-6 whitespace-nowrap text-sm">{txn.gateway_name}</td>
                    <td className={`px-3 py-4 sm:px-5 sm:py-6 whitespace-nowrap text-sm ${statusColor(txn.status)}`}>{txn.status}</td>
                    <td className="px-3 py-4 sm:px-5 sm:py-6 whitespace-nowrap text-sm">{txn.custom_order_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Beautiful Number Pagination */}
      <div className="p-4 flex justify-center items-center gap-2 flex-wrap">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1.5 rounded-md text-sm focus:outline-none cursor-pointer ${currentPage === page
              ? darkMode
                ? 'bg-indigo-500 text-white shadow'
                : 'bg-blue-600 text-white shadow'
              : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransactionsTable;