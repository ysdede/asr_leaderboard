import React from 'react';
import DatasetFilter from './DatasetFilter';

const ASRBenchmarkTable = ({ metrics, sortConfig, requestSort, formatNumber, selectedDataset, datasets, onDatasetChange }) => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold dark:text-gray-100 text-gray-800">ASR Benchmark Comparison</h1>
      </div>
      
      <DatasetFilter 
        selectedDataset={selectedDataset} 
        datasets={datasets} 
        onChange={onDatasetChange} 
      />
      
      <div className="overflow-x-auto dark:bg-dark-100 bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y dark:divide-gray-700 divide-gray-200">
          <thead className="dark:bg-gray-800 bg-gray-50">
            <tr>
              <th className="py-2 px-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Model
              </th>
              <th 
                className="py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 whitespace-nowrap"
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
              <th className="py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Backend
              </th>
              <th className="py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
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
                className={index % 2 === 0 ? 'dark:bg-dark-100 bg-white' : 'dark:bg-gray-800 bg-gray-50'}
              >
                <td className="py-2 px-3 text-xs whitespace-nowrap">
                  <a 
                    href={item.asr_model_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="dark:text-blue-400 text-blue-600 dark:hover:text-blue-300 hover:text-blue-800 hover:underline"
                  >
                    {item.asr_model_name}
                  </a>
                </td>
                <td className="py-2 px-2 text-xs text-center whitespace-nowrap">
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
                <td className="py-2 px-2 text-xs text-center whitespace-nowrap">
                  {item.backend || '-'}
                </td>
                <td className="py-2 px-2 text-xs text-center whitespace-nowrap">
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
      
      <div className="mt-4 text-xs dark:text-gray-400 text-gray-600 dark:bg-dark-100 bg-white p-3 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p><span className="font-semibold">WER</span>: Word Error Rate (lower is better)</p>
            <p><span className="font-semibold">CER</span>: Character Error Rate (lower is better)</p>
          </div>
          <div>
            <p><span className="font-semibold">Similarity</span>: Cosine similarity between reference and prediction texts (higher is better)</p>
            <p><span className="font-semibold">Speed</span>: Real-time factor (higher is better)</p>
          </div>
        </div>
        <p className="mt-4 text-xs dark:text-gray-500 text-gray-500">
          Last updated: {metrics[0]?.timestamp ? new Date(metrics[0].timestamp.substring(0,8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).toLocaleDateString() : 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default ASRBenchmarkTable;
