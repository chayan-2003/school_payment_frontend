import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Select, { MultiValue, Options } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchTransactions } from '../services/transactionService';

import { toast } from 'sonner';
import { Search } from 'lucide-react';
const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'Failed', label: 'Failed' },
  { value: 'success', label: 'Success' },
];

interface Option {
  value: string;
  label: string;
}

const Filter = ({ darkMode }: { darkMode: boolean }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initStatuses = searchParams.getAll('status');
  const initSchools = searchParams.getAll('school_id');

  const [selectedStatuses, setSelectedStatuses] = useState<MultiValue<Option>>(
    statusOptions.filter((o) => initStatuses.includes(o.value))
  );
  const [schoolOptions, setSchoolOptions] = useState<Options<Option>>([]);
  const [selectedSchools, setSelectedSchools] = useState<MultiValue<Option>>(
    initSchools.map((id) => ({ value: id, label: id }))
  );

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [collectId, setCollectId] = useState(''); // Fix: define collectId

  const formatDate = (date: Date | null): string | null => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchTransactions({ page: 1, limit: 1000 });
        const ids = Array.from(
          new Set(res.data.map((t: { school_id: string | number }) => t.school_id))
        );
        setSchoolOptions(ids.map((id) => ({ value: String(id), label: String(id) })));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const isValidObjectId = (id: string): boolean => {
    // A valid ObjectId is a 24-character hexadecimal string
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;
    return objectIdRegex.test(id);
  };
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (collectId && !isValidObjectId(collectId)) {
      toast.error('Invalid Collect ID format. Please enter a valid Collect ID.');
      return;
    }
    selectedStatuses.forEach((o) => params.append('status', o.value));
    selectedSchools.forEach((o) => params.append('school_id', o.value));
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    if (formattedStartDate) params.set('startDate', formattedStartDate);
    if (formattedEndDate) params.set('endDate', formattedEndDate);
    if (searchTerm) params.set('search', searchTerm);
    if (collectId) params.set('collectId', collectId);
    params.set('page', '1');
    navigate({ search: params.toString() });
  };

  const clearFilters = () => {
    setSelectedSchools([]);
    setSelectedStatuses([]);
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
    setCollectId('');
    const params = new URLSearchParams();
    navigate({ search: params.toString() });
  };

  return (
    <div className={`rounded-lg p-6 shadow-md flex flex-col ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-700'}`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Filter Transactions Heading */}
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Filter Transactions
        </h3>

        {/* Search Bar */}
        <div className="w-full sm:w-1/3 lg:w-1/4 relative">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} />
            </span>
            <input
              type="text"
              value={collectId}
              onChange={(e) => setCollectId(e.target.value)}
              placeholder="Enter Collect ID"
              className={`block w-full pl-10 py-2 px-3 text-sm rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${darkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white text-gray-700'
                }`}
            />
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 mb-6">
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            School ID
          </label>
          <Select
            options={schoolOptions}
            isMulti
            value={selectedSchools}
            onChange={setSelectedSchools}
            placeholder="Select school(s)…"
            className="text-sm mt-1"
            classNamePrefix="react-select"
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: darkMode ? '#374151' : 'white',
                borderColor: state.isFocused ? '#6366f1' : darkMode ? '#4B5563' : '#D1D5DB',
                color: darkMode ? 'white' : 'black',
                boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(99, 102, 241, 0.25)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: '#6366f1',
                },
              }),
              input: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
              singleValue: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: darkMode ? '#4B5563' : '#F3F4F6',
                color: darkMode ? 'white' : 'black',
                borderRadius: '0.375rem',
              }),
              multiValueLabel: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                color: darkMode ? '#D1D5DB' : '#6B7280',
                ':hover': {
                  backgroundColor: darkMode ? '#6B7280' : '#E5E7EB',
                  color: darkMode ? 'white' : 'black',
                },
              }),
              placeholder: (provided) => ({
                ...provided,
                color: darkMode ? '#9CA3AF' : '#6B7280',
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: darkMode ? '#374151' : 'white',
                color: darkMode ? 'white' : 'black',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected
                  ? '#6366f1'
                  : state.isFocused
                    ? darkMode ? '#4A5568' : '#F9FAFB'
                    : darkMode ? '#374151' : 'white',
                color: state.isSelected ? 'white' : darkMode ? 'white' : 'black',
              }),
            }}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Status
          </label>
          <Select
            options={statusOptions}
            isMulti
            value={selectedStatuses}
            onChange={setSelectedStatuses}
            placeholder="Select status(es)…"
            className="text-sm mt-1"
            classNamePrefix="react-select"
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: darkMode ? '#374151' : 'white',
                borderColor: state.isFocused ? '#6366f1' : darkMode ? '#4B5563' : '#D1D5DB',
                color: darkMode ? 'white' : 'black',
                boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(99, 102, 241, 0.25)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: '#6366f1',
                },
              }),
              input: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
              singleValue: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: darkMode ? '#4B5563' : '#F3F4F6',
                color: darkMode ? 'white' : 'black',
                borderRadius: '0.375rem',
              }),
              multiValueLabel: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                color: darkMode ? '#D1D5DB' : '#6B7280',
                ':hover': {
                  backgroundColor: darkMode ? '#6B7280' : '#E5E7EB',
                  color: darkMode ? 'white' : 'black',
                },
              }),
              placeholder: (provided) => ({
                ...provided,
                color: darkMode ? '#9CA3AF' : '#6B7280',
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: darkMode ? '#374151' : 'white',
                color: darkMode ? 'white' : 'black',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected
                  ? '#6366f1'
                  : state.isFocused
                    ? darkMode ? '#4A5568' : '#F9FAFB'
                    : darkMode ? '#374151' : 'white',
                color: state.isSelected ? 'white' : darkMode ? 'white' : 'black',
              }),
            }}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Start Date
          </label>
          <div className={`mt-1 rounded-md shadow-sm ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="yyyy-mm-dd"
              className={`block w-full py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none ${darkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white text-gray-700'
                }`}
            />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            End Date
          </label>
          <div className={`mt-1 rounded-md shadow-sm ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="yyyy-mm-dd"
              className={`block w-full py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none ${darkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white text-gray-700'
                }`}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
        >
          Clear
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Filter;