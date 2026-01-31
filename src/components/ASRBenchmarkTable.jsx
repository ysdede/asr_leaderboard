import React from 'react';
import DatasetFilter from './DatasetFilter';

const ASRBenchmarkTable = ({ metrics, sortConfig, requestSort, formatNumber, selectedDataset, datasets, onDatasetChange }) => {
  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 w-full">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold dark:text-gray-100 text-gray-800">ASR Benchmark Comparison</h1>
      </div>
      
      <DatasetFilter 
        selectedDataset={selectedDataset} 
        datasets={datasets} 
        onChange={onDatasetChange} 
      />
      
      <div className="overflow-x-auto dark:bg-gray-900 bg-white rounded-lg shadow-md -mx-2 sm:mx-0">
        <table className="min-w-full divide-y dark:divide-gray-700 divide-gray-200">
          <thead className="dark:bg-gray-800 bg-gray-50">
            <tr>
              <th className="py-2 px-1 sm:px-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Model
              </th>
              <th 
                className="py-2 px-1 sm:px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 whitespace-nowrap"
                onClick={() => requestSort('wer')}
              >
                <div className="flex items-center justify-center">
                  WER
                  {sortConfig.key === 'wer' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th 
                className="py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 whitespace-nowrap"
                onClick={() => requestSort('cer')}
              >
                <div className="flex items-center justify-center">
                  CER
                  {sortConfig.key === 'cer' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th 
                className="py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 whitespace-nowrap"
                onClick={() => requestSort('cosine_similarity')}
              >
                <div className="flex items-center justify-center">
                  Sim
                  {sortConfig.key === 'cosine_similarity' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th 
                className="py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 whitespace-nowrap"
                onClick={() => requestSort('speed')}
              >
                <div className="flex items-center justify-center">
                  Speed
                  {sortConfig.key === 'speed' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th className="py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Dataset
              </th>
              <th className="hidden sm:table-cell py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Backend
              </th>
              <th className="hidden sm:table-cell py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Device
              </th>
              <th className="py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Hardware
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700 divide-gray-200">
            {metrics.map((item, index) => (
              <tr 
                key={index} 
                className={index % 2 === 0 ? 'dark:bg-gray-900 bg-white' : 'dark:bg-gray-800 bg-gray-50'}
              >
                <td className="py-2 px-1 sm:px-3 text-xs whitespace-nowrap">
                  <a 
                    href={item.asr_model_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="dark:text-blue-400 text-blue-600 dark:hover:text-blue-300 hover:text-blue-800 hover:underline"
                  >
                    {item.asr_model_name}
                  </a>
                </td>
                <td className="py-2 px-1 sm:px-2 text-xs text-center whitespace-nowrap">
                  {formatNumber(item.wer)}%
                </td>
                <td className="py-2 px-2 text-xs text-center whitespace-nowrap">
                  {formatNumber(item.cer)}%
                </td>
                <td className="py-2 px-2 text-xs text-center whitespace-nowrap">
                  {formatNumber(item.cosine_similarity)}%
                </td>
                <td className="py-2 px-2 text-xs text-center whitespace-nowrap">
                  {Math.round(parseFloat(item.speed))}
                </td>
                <td className="py-2 px-2 text-xs text-center whitespace-nowrap">
                  <a 
                    href={`https://huggingface.co/${item.dataset_hf_id}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="dark:text-blue-400 text-blue-600 dark:hover:text-blue-300 hover:text-blue-800 hover:underline"
                  >
                    {item.dataset_name}
                  </a>
                </td>
                <td className="hidden sm:table-cell py-2 px-2 text-xs text-center whitespace-nowrap">
                  {item.backend || '-'}
                </td>
                <td className="hidden sm:table-cell py-2 px-2 text-xs text-center whitespace-nowrap">
                  {item.device || '-'}
                </td>
                <td className="py-2 px-2 text-xs text-center whitespace-nowrap">
                  {item.device_model || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs dark:text-gray-400 text-gray-600 dark:bg-gray-900 bg-white p-3 rounded-lg shadow-md">
        <p className="text-xs dark:text-gray-500 text-gray-500">
          Last updated: {metrics.length > 0 ? 
            (() => {
              // Get the last element of the metrics array (most recent)
              const ts = metrics[metrics.length - 1].timestamp;
              // Format: yyyymmddhhmmss -> yyyy-mm-dd hh:mm:ss
              const formattedDate = `${ts.substring(0,4)}-${ts.substring(4,6)}-${ts.substring(6,8)} ${ts.substring(8,10)}:${ts.substring(10,12)}:${ts.substring(12,14)}`;
              return new Date(formattedDate).toLocaleString();
            })() 
            : 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default ASRBenchmarkTable;
