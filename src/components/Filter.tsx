import  { useEffect, useState } from 'react';
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
    params.set('page', '1');
    navigate({ search: params.toString() });
  };

  return (
    <div
      className={`rounded-2xl p-4 shadow flex flex-col md:flex-row md:items-end md:gap-4 gap-6 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Selects */}
      <div className="flex flex-col md:flex-row gap-4 flex-grow">
        <div className="flex flex-col w-full md:w-1/3">
          <label className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            School ID
          </label>
          <Select
            options={schoolOptions}
            isMulti
            value={selectedSchools}
            onChange={setSelectedSchools}
            placeholder="Select school(s)…"
            className="text-sm"
            classNamePrefix="react-select"
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: darkMode ? '#374151' : 'white',
                borderColor: darkMode ? '#4B5563' : '#D1D5DB',
                color: darkMode ? 'white' : 'black',
              }),
              input: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
              singleValue: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
              multiValueLabel: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
            }}
          />
        </div>

        <div className="flex flex-col w-full md:w-1/3">
          <label className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Status
          </label>
          <Select
            options={statusOptions}
            isMulti
            value={selectedStatuses}
            onChange={setSelectedStatuses}
            placeholder="Select status(es)…"
            className="text-sm"
            classNamePrefix="react-select"
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: darkMode ? '#374151' : 'white',
                borderColor: darkMode ? '#4B5563' : '#D1D5DB',
                color: darkMode ? 'white' : 'black',
              }),
              input: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
              singleValue: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
              multiValueLabel: (provided) => ({
                ...provided,
                color: darkMode ? 'white' : 'black',
              }),
            }}
          />
        </div>

        <div className="flex flex-col w-full md:w-1/3">
          <label className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Start date"
            className={`block w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        <div className="flex flex-col w-full md:w-1/3">
          <label className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            End Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="End date"
            className={`block w-full rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
      </div>

      {/* Button */}
      <div className="w-full md:w-auto">
        <button
          onClick={applyFilters}
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium text-sm rounded-lg px-5 py-2.5"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;
