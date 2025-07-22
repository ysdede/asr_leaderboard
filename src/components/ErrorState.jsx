import React from 'react';

const ErrorState = ({ error, debugInfo }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-red-500 dark:text-red-400 p-6 max-w-md text-center bg-white dark:bg-gray-900 rounded-lg shadow-md border border-red-200 dark:border-red-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-semibold mb-2">Error Loading Data</p>
        <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">{error}</p>
        {debugInfo && (
          <span className="text-xs dark:text-gray-400 text-gray-500 block break-words">{debugInfo}</span>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
