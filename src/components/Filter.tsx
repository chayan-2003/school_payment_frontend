import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Select, { MultiValue, Options } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchTransactions } from '../services/transactionService';

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
        const ids = Array.from(new Set(res.data.map((t: { school_id: string | number }) => t.school_id)));
        setSchoolOptions(ids.map((id) => ({ value: id as string, label: id as string })));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const applyFilters = () => {
    const params = new URLSearchParams();
    selectedStatuses.forEach((o) => params.append('status', o.value));
    selectedSchools.forEach((o) => params.append('school_id', o.value));
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    if (formattedStartDate) params.set('startDate', formattedStartDate);
    if (formattedEndDate) params.set('endDate', formattedEndDate);
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', '1');
    navigate({ search: params.toString() });
  };

  const clearFilters = () => {
    setSelectedSchools([]);
    setSelectedStatuses([]);
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
    const params = new URLSearchParams();
    navigate({ search: params.toString() });
  };

  return (
    <div
      className={`rounded-lg p-6 shadow-md flex flex-col ${
        darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-700'
      }`}
    >
      {/* Header with Title and Search */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Filter Transactions
        </h3>
        {/* You can add a search input here if needed */}
      </div>

      {/* Filters - Modern Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 mb-6">
        {/* School ID */}
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

        {/* Status */}
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

        {/* Start Date */}
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
              className={`block w-full py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none ${
                darkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white text-gray-700'
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
              className={`block w-full py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none ${
                darkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white text-gray-700'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Actions - Modern Alignment */}
      <div className="flex justify-end gap-x-3">
        <button
          type="button"
          className={`cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white ' : ''
          }`}
          onClick={clearFilters}
        >
          Clear
        </button>
        <button
          onClick={applyFilters}
          className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium text-sm rounded-md px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Filter;