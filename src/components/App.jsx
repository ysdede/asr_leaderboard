import React, { useState, useEffect } from 'react';
import ASRBenchmarkTable from './ASRBenchmarkTable';
import AverageScoresTable from './AverageScoresTable';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import CSVParser from '../utils/CSVParser';
import GitInfo from './GitInfo';

const App = () => {
  const [metrics, setMetrics] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'wer', direction: 'asc' });
  const [debugInfo, setDebugInfo] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('all');
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));

  // Simplified theme handling - just initialize once
  useEffect(() => {
    // Set initial dark mode state based on document class
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    console.log("React component initialized with theme:", isDark ? "DARK" : "LIGHT");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const owner = 'ysdede';
        const repo = 'asr_benchmark_store';
        
        // Try alternate URL format for Hugging Face datasets
        const apiUrl = `https://huggingface.co/datasets/${owner}/${repo}/resolve/main/metrics-00.csv`;
        
        setDebugInfo(`Trying to fetch from: ${apiUrl}`);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        setDebugInfo('Data fetched successfully, parsing CSV...');
        
        const parsedData = CSVParser.parseCSV(csvText, setDebugInfo);
        
        if (parsedData.length > 0) {
          setMetrics(parsedData);
          
          // Extract unique datasets
          const uniqueDatasets = [...new Set(parsedData.map(item => item.dataset_name))];
          setDatasets(uniqueDatasets);
          
          setDebugInfo(`Parsed ${parsedData.length} records successfully`);
        } else {
          setDebugInfo('Parsed data is empty');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching metrics data:', error);
        setError(error.message);
        setDebugInfo(`Error: ${error.message}`);
        setLoading(false);
        
        // Fallback to static data for demo purposes
        tryWithStaticData();
      }
    };
    
    const tryWithStaticData = () => {
      setDebugInfo('Falling back to static demo data...');
      // Sample data from your CSV
      const staticData = [
        {
          "asr_model_name": "openai/whisper-large-v3-turbo",
          "wer": "10.4",
          "cer": "5.4",
          "cosine_similarity": "95.51",
          "speed": "29",
          "dataset_name": "turkishvoicedataset",
          "dataset_hf_id": "erenfazlioglu/turkishvoicedataset",
          "device_model": "Tesla T4",
          "timestamp": "20250310164022",
          "asr_model_url": "https://huggingface.co/openai/whisper-large-v3-turbo"
        },
        {
          "asr_model_name": "openai/whisper-small",
          "wer": "21.87",
          "cer": "8.33",
          "cosine_similarity": "91.23",
          "speed": "68",
          "dataset_name": "turkishvoicedataset",
          "dataset_hf_id": "erenfazlioglu/turkishvoicedataset",
          "device_model": "NVIDIA L4",
          "timestamp": "20250310180124",
          "asr_model_url": "https://huggingface.co/openai/whisper-small"
        }
      ];
      
      setMetrics(staticData);
      setDatasets(["turkishvoicedataset"]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatNumber = (value) => {
    if (!value) {
      return '-';
    }
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toFixed(2);
  };

  const getSortedMetrics = () => {
    // First filter by selected dataset
    const filteredItems = selectedDataset === 'all' 
      ? [...metrics]
      : metrics.filter(item => item.dataset_name === selectedDataset);
      
    // Then sort the filtered items
    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
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
    return filteredItems;
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (loading) {
    return <LoadingState debugInfo={debugInfo} />;
  }
  
  if (error) {
    return <ErrorState error={error} debugInfo={debugInfo} />;
  }
  
  if (metrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-4">
          <p className="text-lg">No benchmark data available</p>
          <span className="text-xs dark:text-gray-400 text-gray-500">{debugInfo}</span>
        </div>
      </div>
    );
  }

  const sortedMetrics = getSortedMetrics();
  
  if (sortedMetrics.length === 0) {
    return (
      <EmptyState 
        darkMode={darkMode} 
        toggleTheme={toggleTheme} 
        selectedDataset={selectedDataset} 
        datasets={datasets} 
        onDatasetChange={setSelectedDataset} 
      />
    );
  }

  return (
    <div className="flex flex-col space-y-8 pb-4">
      <AverageScoresTable 
        metrics={metrics}
        datasets={datasets}
        formatNumber={formatNumber}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        debugInfo={debugInfo}
      />
      <ASRBenchmarkTable 
        metrics={sortedMetrics}
        requestSort={requestSort}
        sortConfig={sortConfig}
        formatNumber={formatNumber}
        selectedDataset={selectedDataset}
        datasets={datasets}
        onDatasetChange={setSelectedDataset}
      />
      <div className="mt-8 border-t pt-2 dark:border-gray-700">
        <GitInfo />
      </div>
    </div>
  );
};

export default App;
