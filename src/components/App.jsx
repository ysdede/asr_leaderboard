import React, { useState, useEffect } from 'react';
import ASRBenchmarkTable from './ASRBenchmarkTable';
import AverageScoresTable from './AverageScoresTable';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import CSVParser from '../utils/CSVParser';
import GitInfo from './GitInfo';
import ProjectInfo from './ProjectInfo';
import ConfigWidget from './ConfigWidget';

// Default fallback config in case everything else fails
const FALLBACK_CONFIG = {
  owner: 'ysdede',
  repo: 'asr_benchmark_store',
  branch: 'main'
};

const App = () => {
  const [metrics, setMetrics] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState(() => {
    // Try to get saved sort config from localStorage
    const savedSortConfig = localStorage.getItem('sortConfig');
    return savedSortConfig ? JSON.parse(savedSortConfig) : { key: 'wer', direction: 'asc' };
  });
  const [debugInfo, setDebugInfo] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(() => {
    // Try to get saved dataset selection from localStorage
    const savedDataset = localStorage.getItem('selectedDataset');
    return savedDataset || 'all';
  });
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [config, setConfig] = useState(FALLBACK_CONFIG); // Start with fallback
  const [isValidating, setIsValidating] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [configSource, setConfigSource] = useState('initializing');

  // Simplified theme handling - just initialize once
  useEffect(() => {
    // Set initial dark mode state based on document class
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    console.log("React component initialized with theme:", isDark ? "DARK" : "LIGHT");
  }, []);

  // Save selected dataset to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedDataset', selectedDataset);
  }, [selectedDataset]);

  // Save sort config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sortConfig', JSON.stringify(sortConfig));
  }, [sortConfig]);

  useEffect(() => {
    localStorage.setItem('userConfig', JSON.stringify(config));
  }, [config]);

  // Load config from localStorage or config.json
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // First try to get from localStorage
        const savedConfig = localStorage.getItem('userConfig');
        if (savedConfig) {
          try {
            const parsedConfig = JSON.parse(savedConfig);
            setConfig(parsedConfig);
            setConfigSource('localStorage');
            console.log('📋 Configuration loaded from localStorage:', parsedConfig);
            setConfigLoaded(true);
            return;
          } catch (parseError) {
            console.warn('⚠️ Error parsing localStorage config:', parseError);
            // Continue to try other sources
          }
        }

        // If not in localStorage or parsing failed, try to load from config.json
        try {
          console.log('🔍 Attempting to load config from config.json...');
          const response = await fetch('/config.json');
          if (response.ok) {
            const fileConfig = await response.json();
            setConfig(fileConfig);
            setConfigSource('config.json');
            // Also save to localStorage for future use
            localStorage.setItem('userConfig', JSON.stringify(fileConfig));
            console.log('📄 Configuration loaded from config.json:', fileConfig);
          } else {
            console.warn(`⚠️ Could not load config.json: ${response.status} ${response.statusText}`);
            setConfigSource('fallback');
            console.log('⚙️ Using fallback configuration:', FALLBACK_CONFIG);
          }
        } catch (fileError) {
          console.warn('⚠️ Error loading config.json:', fileError);
          setConfigSource('fallback');
          console.log('⚙️ Using fallback configuration:', FALLBACK_CONFIG);
          // Use fallback config (already set as initial state)
        }
      } catch (error) {
        console.error('❌ Error in config loading process:', error);
        setConfigSource('fallback');
        console.log('⚙️ Using fallback configuration:', FALLBACK_CONFIG);
        // Use fallback config (already set as initial state)
      } finally {
        setConfigLoaded(true);
      }
    };

    loadConfig();
  }, []);

  // Only fetch data after config is loaded
  useEffect(() => {
    if (configLoaded) {
      console.log(`🚀 Starting data fetch with configuration from ${configSource}`);
      fetchData();
    }
  }, [configLoaded]);

  // Update debug info when config changes
  useEffect(() => {
    if (configLoaded) {
      setDebugInfo(prev => `${prev}\nUsing config from: ${configSource}`);
    }
  }, [configLoaded, configSource]);

  const tryWithStaticData = () => {
    setDebugInfo('Falling back to static demo data...');
    // Sample data from your CSV
    const staticData = [
      {
        "asr_model_name": "openai/whisper-large-v3-turbo",
        "wer": "10.4",
        // ... rest of the static data ...
      },
      // ... other static entries ...
    ];
    
    setMetrics(staticData);
    setDatasets(["turkishvoicedataset"]);
    setLoading(false);
  };

  const validateAndApplyConfig = async (newConfig) => {
    setIsValidating(true);
    setDebugInfo('Validating repository configuration...');

    try {
      // Only try to fetch the metrics file directly - this was working before
      const metricsUrl = `https://huggingface.co/datasets/${newConfig.owner}/${newConfig.repo}/resolve/${newConfig.branch}/metrics-00.csv`;
      setDebugInfo(`Validating config by fetching: ${metricsUrl}`);
      
      const response = await fetch(metricsUrl);
      if (!response.ok) {
        throw new Error('Metrics file not found. Please check repository, branch name and ensure metrics-00.csv exists.');
      }

      // Try to parse a small bit of the CSV to validate it's the right format
      const csvText = await response.text();
      if (!csvText.includes('asr_model_name') || !csvText.includes('wer')) {
        throw new Error('Invalid metrics file format');
      }

      // If validation passes, update the config and fetch new data
      setConfig(newConfig);
      setConfigSource('user input');
      console.log('🔄 Configuration updated by user:', newConfig);
      localStorage.setItem('userConfig', JSON.stringify(newConfig));
      setDebugInfo('Configuration validated successfully');
      
      // Reset the current data
      setMetrics([]);
      setDatasets([]);
      setLoading(true);
      setError(null);
      
      // Fetch new data
      await fetchData();
    } catch (error) {
      setDebugInfo(`Configuration error: ${error.message}`);
      alert(`Invalid configuration: ${error.message}`);
      // Optionally fall back to static data if needed
      // tryWithStaticData();
    } finally {
      setIsValidating(false);
    }
  };

  const fetchData = async () => {
    try {
      const { owner, repo, branch } = config;
      const apiUrl = `https://huggingface.co/datasets/${owner}/${repo}/resolve/${branch}/metrics-00.csv`;
      
      setDebugInfo(`Fetching data from: ${apiUrl}`);
      
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
      
      tryWithStaticData();
    }
  };

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
    return (
      <ErrorState 
        error={error} 
        debugInfo={debugInfo}
        config={config}
        onApplyConfig={validateAndApplyConfig}
        isValidating={isValidating}
      />
    );
  }
  
  if (metrics.length === 0) {
    return (
      <EmptyState 
        selectedDataset={selectedDataset}
        datasets={datasets}
        onDatasetChange={setSelectedDataset}
        config={config}
        onApplyConfig={validateAndApplyConfig}
        isValidating={isValidating}
        debugInfo={debugInfo}
      />
    );
  }

  const sortedMetrics = getSortedMetrics();
  
  if (sortedMetrics.length === 0) {
    return (
      <EmptyState 
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
      <div className="flex justify-center">
        <ConfigWidget 
          config={config} 
          onApplyConfig={validateAndApplyConfig}
          isValidating={isValidating}
        />
      </div>
      <ProjectInfo />
    </div>
  );
};

export default App;
