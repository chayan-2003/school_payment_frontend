import { useEffect, useState, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchTransactions } from '../services/transactionService.ts';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

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

    const collectId = searchParams.get('collectId') || '';
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
      collectId,

    })
      .then(({ data, meta }) => {
        setTransactions(data);
        setTotalEntries(meta.totalEntries);
        setTotalPages(meta.totalPages);
      })
      .finally(() => setLoading(false));
  }, [searchParams, sortBy, sortOrder]);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);

    // Preserve existing multi-value parameters like 'status'
    if (updates.status) {
      const existingStatuses = params.getAll('status');
      params.delete('status'); // Remove existing 'status' entries
      [...existingStatuses, updates.status].forEach((status) => params.append('status', status));
    }

    // Update other parameters
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'status') params.set(key, value);
    });

    setSearchParams(params);
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
  const handleSort = (field: string) => {
    let newOrder: 'asc' | 'desc' = 'asc';

    // Toggle sort order if the same column is clicked
    if (sortBy === field && sortOrder === 'asc') {
      newOrder = 'desc';
    }

    // Update the query parameters with the new sortBy and sortOrder
    updateParams({ sortBy: field, sortOrder: newOrder });
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
          ? 'bg-gray-900 text-gray-200 min-h-screen flex flex-col font-sans max-w-full'
          : 'bg-white text-gray-800 min-h-screen flex flex-col font-sans max-w-full'
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
            border-left-color: ${darkMode ? '#6366f1' : '#3b82f6'};
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
            margin-bottom: 8px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .table-sm td, .table-sm th {
      font-size: 0.8rem;
      padding: 1.5rem 0.75rem; /* Increased row height */
    }
        `}
      </style>

      <div className="relative py-10">
        {/* Rows Per Page Selector */}
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <label htmlFor="rowsPerPage" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={pageSize}
            onChange={(e) => {
              const newPageSize = parseInt(e.target.value, 10);
              setPageSize(newPageSize);
              updateParams({ page: '1', limit: String(newPageSize) });
            }}
            className={`px-2 py-1 rounded text-sm focus:outline-none cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        {/* Table */}
        <div
          className={`rounded-lg shadow-md overflow-x-auto md:overflow-x-hidden overflow-y-auto transition-colors duration-300 ease-in-out border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <table className={`min-w-full table-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ tableLayout: 'fixed' }}>
            <thead className={darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}>
              <tr>
                <th>S No.</th>
                <th>Collect Id</th>
                <th>School ID</th>
                <th>Date</th>
                <th>Time</th>
                <th onClick={() => handleSort('order_amount')} className="cursor-pointer select-none">
                  Order Amt {sortBy === 'order_amount' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('transaction_amount')} className="cursor-pointer select-none">
                  Transaction Amt {sortBy === 'transaction_amount' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Order ID</th>
              </tr>
            </thead>
            <tbody className={darkMode ? 'bg-gray-900 tbody-dark' : 'bg-white'}>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-6">
                    <div className="loading-spinner"></div>
                    Loading Transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-6">
                    No Transactions Found
                  </td>
                </tr>
              ) : (
                transactions.map((txn, idx) => (
                  <tr
                    key={`${txn.collect_id}-${txn.payment_time}-${idx}`}
                    className={`transition-transform duration-150 ease-in-out hover:shadow-md transform hover:scale-101 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    style={{ transform: 'translateZ(0)' }}
                  >
                    <td>{formatSerialNumber(currentPage, pageSize, idx)}</td>
                    <td className="flex items-center gap-1">
                      <span>{txn.collect_id}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(txn.collect_id);
                          toast.success('Collect ID copied');
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-300 cursor-pointer rounded transition"
                        title="Copy Collect ID"
                      >
                        <Copy size={14} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                      </button>
                    </td>
                    <td>{txn.school_id}</td>
                    <td>{formatDate(txn.payment_time)}</td>
                    <td>{formatTime(txn.payment_time)}</td>
                    <td>₹{txn.order_amount}</td>
                    <td>₹{txn.transaction_amount}</td>
                    <td>{txn.gateway_name}</td>
                    <td className={`${statusColor(txn.status)}`}>{txn.status}</td>
                    <td>{txn.custom_order_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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