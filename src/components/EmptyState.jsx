import React from 'react';
import ThemeToggle from './ThemeToggle';
import DatasetFilter from './DatasetFilter';

const EmptyState = ({ darkMode, toggleTheme, selectedDataset, datasets, onDatasetChange }) => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold dark:text-gray-100 text-gray-800">ASR Benchmark Comparison</h1>
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      </div>
      
      <DatasetFilter 
        selectedDataset={selectedDataset} 
        datasets={datasets} 
        onChange={onDatasetChange} 
      />
      
      <div className="dark:bg-dark-100 bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 dark:text-gray-400 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="dark:text-gray-300 text-gray-600">No results found for the selected dataset</p>
      </div>
    </div>
  );
};

export default EmptyState;
