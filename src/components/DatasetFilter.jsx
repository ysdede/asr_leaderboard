import React from 'react';

const DatasetFilter = ({ selectedDataset, datasets, onChange }) => {
  return (
    <div className="mb-4 dark:bg-dark-100 bg-white p-3 rounded-lg shadow-md">
      <label htmlFor="dataset-filter" className="mr-2 text-sm font-medium dark:text-gray-300 text-gray-700">
        Filter by Dataset:
      </label>
      <select 
        id="dataset-filter"
        value={selectedDataset}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded py-1 px-2 text-sm dark:bg-gray-700 bg-gray-50 dark:border-gray-600 border-gray-300 dark:text-gray-200 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">All Datasets</option>
        {datasets.map((dataset, index) => (
          <option key={index} value={dataset}>{dataset}</option>
        ))}
      </select>
    </div>
  );
};

export default DatasetFilter;
