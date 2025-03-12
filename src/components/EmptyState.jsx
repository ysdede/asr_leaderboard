import React from 'react';
import ConfigWidget from './ConfigWidget';

const EmptyState = ({ 
  selectedDataset, 
  datasets, 
  onDatasetChange,
  config,
  onApplyConfig,
  isValidating,
  debugInfo 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No benchmark data available
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {debugInfo}
          </p>
        </div>

        <div className="border-t dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Try updating the repository settings:
          </p>
          <ConfigWidget 
            config={config}
            onApplyConfig={onApplyConfig}
            isValidating={isValidating}
          />
        </div>

        {datasets.length > 0 && (
          <div className="mt-6 border-t dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Or select a different dataset:
            </p>
            <select
              value={selectedDataset}
              onChange={(e) => onDatasetChange(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Datasets</option>
              {datasets.map(dataset => (
                <option key={dataset} value={dataset}>
                  {dataset}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
