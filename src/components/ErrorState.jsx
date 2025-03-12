import React from 'react';
import ConfigWidget from './ConfigWidget';

const ErrorState = ({ error, debugInfo, config, onApplyConfig, isValidating }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{debugInfo}</p>
        </div>
        
        <div className="border-t dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Try updating the repository settings to recover:
          </p>
          <ConfigWidget 
            config={config}
            onApplyConfig={onApplyConfig}
            isValidating={isValidating}
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
