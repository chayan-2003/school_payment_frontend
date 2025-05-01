import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use environment variable or fallback to localhost
  withCredentials: true,
});

export const fetchTransactions = async ({
  status,
  school_id,
  sortBy = 'payment_time',
  sortOrder = 'asc',
  page = 1,       // Default page number
  limit = 10,     // Default items per page
  startDate,      // Start date filter
  endDate,        // End date filter
}: {
  status?: string | string[];
  school_id?: string | string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;  // Accept page as a parameter
  limit?: number; // Accept limit as a parameter
  startDate?: string; // Start date as a string (e.g., '2025-04-01')
  endDate?: string;   // End date as a string (e.g., '2025-04-30')
}) => {
  const params = new URLSearchParams();

  // Handle 'status' parameter
  if (status) {
    if (Array.isArray(status)) {
      status.forEach((s) => params.append('status', s));
    } else {
      params.append('status', status);
    }
  }

  // Handle 'school_id' parameter
  if (school_id) {
    if (Array.isArray(school_id)) {
      school_id.forEach((id) => params.append('school_id', id));
    } else {
      params.append('school_id', school_id);
    }
  }

  // Append sorting parameters
  params.append('sortBy', sortBy);
  params.append('sortOrder', sortOrder);

  // Add pagination parameters
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  // Add date filters
  if (startDate) {
    params.append('startDate', startDate);
  }
  if (endDate) {
    params.append('endDate', endDate);
  }

  try {
    const response = await api.get(`/transactions?${params.toString()}`);
    const { data, meta } = response.data; // Extract data and meta from the response
    return { data, meta }; // Return both data and meta
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
};
