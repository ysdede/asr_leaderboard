import React, { useState, useMemo } from 'react';
import ThemeToggle from './ThemeToggle';

const AverageScoresTable = ({ 
  metrics, 
  datasets, 
  formatNumber, 
  darkMode, 
  toggleTheme, 
  debugInfo 
}) => {
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'avgWer', direction: 'asc' });

  // Toggle dataset selection
  const toggleDataset = (datasetName) => {
    setSelectedDatasets(prev => 
      prev.includes(datasetName)
        ? prev.filter(d => d !== datasetName)
        : [...prev, datasetName]
    );
  };

  // Select all datasets
  const selectAllDatasets = () => {
    setSelectedDatasets([...datasets]);
  };

  // Clear all dataset selections
  const clearDatasetSelection = () => {
    setSelectedDatasets([]);
  };

  // Calculate average metrics for each model across selected datasets
  const averageMetrics = useMemo(() => {
    // If no datasets selected, use all datasets
    const datasetsToUse = selectedDatasets.length > 0 ? selectedDatasets : datasets;
    
    // Group metrics by model
    const modelGroups = {};
    
    metrics.forEach(item => {
      if (datasetsToUse.includes(item.dataset_name) || datasetsToUse.length === 0) {
        if (!modelGroups[item.asr_model_name]) {
          modelGroups[item.asr_model_name] = {
            asr_model_name: item.asr_model_name,
            asr_model_url: item.asr_model_url,
            backend: item.backend,
            device: item.device,
            device_model: item.device_model,
            metrics: []
          };
        }
        modelGroups[item.asr_model_name].metrics.push(item);
      }
    });
    
    // Calculate averages for each model
    return Object.values(modelGroups).map(group => {
      const metricsCount = group.metrics.length;
      
      if (metricsCount === 0) return null;
      
      // Calculate sums
      const sums = group.metrics.reduce((acc, item) => {
        acc.wer += parseFloat(item.wer) || 0;
        acc.cer += parseFloat(item.cer) || 0;
        acc.cosine_similarity += parseFloat(item.cosine_similarity) || 0;
        acc.speed += parseFloat(item.speed) || 0;
        return acc;
      }, { wer: 0, cer: 0, cosine_similarity: 0, speed: 0 });
      
      // Calculate averages
      return {
        asr_model_name: group.asr_model_name,
        asr_model_url: group.asr_model_url,
        backend: group.backend || '-',
        device: group.device || '-',
        device_model: group.device_model || '-',
        avgWer: (sums.wer / metricsCount).toFixed(2),
        avgCer: (sums.cer / metricsCount).toFixed(2),
        avgCosineSimilarity: (sums.cosine_similarity / metricsCount).toFixed(2),
        avgSpeed: (sums.speed / metricsCount).toFixed(2),
        datasetCount: metricsCount,
        includedDatasets: group.metrics.map(m => m.dataset_name).join(', ')
      };
    }).filter(Boolean);
  }, [metrics, selectedDatasets, datasets]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort the average metrics
  const sortedAverageMetrics = useMemo(() => {
    const sortableItems = [...averageMetrics];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = parseFloat(a[sortConfig.key]) || 0;
        const bValue = parseFloat(b[sortConfig.key]) || 0;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [averageMetrics, sortConfig]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold dark:text-gray-100 text-gray-800">ASR Models Average Performance</h1>
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      </div>
      
      {/* Dataset Selector */}
      <div className="mb-6 dark:bg-dark-100 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-sm font-medium dark:text-gray-300 text-gray-700">
            Select datasets to include in average calculation:
          </span>
          <div className="flex gap-2">
            <button 
              onClick={selectAllDatasets}
              className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Select All
            </button>
            <button 
              onClick={clearDatasetSelection}
              className="px-3 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {datasets.map((dataset) => (
            <label 
              key={dataset} 
              className="inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedDatasets.includes(dataset) || selectedDatasets.length === 0}
                onChange={() => toggleDataset(dataset)}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-sm dark:text-gray-300 text-gray-700">{dataset}</span>
            </label>
          ))}
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {selectedDatasets.length === 0 
            ? "Using all datasets for calculation" 
            : `Using ${selectedDatasets.length} selected datasets for calculation`}
        </div>
      </div>
      
      {/* Average Scores Table */}
      <div className="overflow-x-auto dark:bg-dark-100 bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y dark:divide-gray-700 divide-gray-200">
          <thead className="dark:bg-gray-800 bg-gray-50">
            <tr>
              <th className="py-2 px-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th 
                className="py-2 px-3 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100"
                onClick={() => requestSort('avgWer')}
              >
                <div className="flex items-center justify-center">
                  Avg WER ⬇️
                  {sortConfig.key === 'avgWer' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th 
                className="py-2 px-3 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100"
                onClick={() => requestSort('avgCer')}
              >
                <div className="flex items-center justify-center">
                  Avg CER ⬇️
                  {sortConfig.key === 'avgCer' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th 
                className="py-2 px-3 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100"
                onClick={() => requestSort('avgCosineSimilarity')}
              >
                <div className="flex items-center justify-center">
                  Avg Similarity ⬆️
                  {sortConfig.key === 'avgCosineSimilarity' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th 
                className="py-2 px-3 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100"
                onClick={() => requestSort('avgSpeed')}
              >
                <div className="flex items-center justify-center">
                  Avg Speed ⬆️
                  {sortConfig.key === 'avgSpeed' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
              <th className="py-2 px-3 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Datasets
              </th>
              <th className="py-2 px-3 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Backend
              </th>
              <th className="py-2 px-3 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Device
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700 divide-gray-200">
            {sortedAverageMetrics.map((item, index) => (
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
                <td className="py-2 px-3 text-xs text-center whitespace-nowrap">
                  {formatNumber(item.avgWer)}%
                </td>
                <td className="py-2 px-3 text-xs text-center whitespace-nowrap">
                  {formatNumber(item.avgCer)}%
                </td>
                <td className="py-2 px-3 text-xs text-center whitespace-nowrap">
                  {formatNumber(item.avgCosineSimilarity)}%
                </td>
                <td className="py-2 px-3 text-xs text-center whitespace-nowrap">
                  {formatNumber(item.avgSpeed)}×
                </td>
                <td className="py-2 px-3 text-xs text-center">
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {item.datasetCount}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 hidden md:inline">
                    {item.includedDatasets}
                  </span>
                </td>
                <td className="py-2 px-3 text-xs text-center whitespace-nowrap">
                  {item.backend}
                </td>
                <td className="py-2 px-3 text-xs text-center whitespace-nowrap">
                  {item.device} {item.device_model}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 text-xs dark:text-gray-400 text-gray-600 dark:bg-dark-100 bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p><span className="font-semibold">Avg WER</span>: Average Word Error Rate (lower is better)</p>
            <p><span className="font-semibold">Avg CER</span>: Average Character Error Rate (lower is better)</p>
          </div>
          <div>
            <p><span className="font-semibold">Avg Similarity</span>: Average Cosine similarity (higher is better)</p>
            <p><span className="font-semibold">Avg Speed</span>: Average Real-time factor (higher is better)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AverageScoresTable;
