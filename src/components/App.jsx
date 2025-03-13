import React, { useState, useEffect } from 'react';
import ASRBenchmarkTable from './ASRBenchmarkTable';
import AverageScoresTable from './AverageScoresTable';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import CSVParser from '../utils/CSVParser';
import GitInfo from './GitInfo';
import ProjectInfo from './ProjectInfo';
import { DEFAULT_CONFIG } from '../config';
import ConfigWidget from './ConfigWidget';

const App = () => {
  const [metrics, setMetrics] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState(() => {
    try {
      const savedSortConfig = localStorage.getItem('sortConfig');
      return savedSortConfig ? JSON.parse(savedSortConfig) : { key: 'wer', direction: 'asc' };
    } catch (error) {
      console.warn('Error loading sortConfig from localStorage:', error);
      return { key: 'wer', direction: 'asc' }; // Fallback to default
    }
  });
  const [debugInfo, setDebugInfo] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(() => {
    try {
      const savedDataset = localStorage.getItem('selectedDataset');
      return savedDataset || 'all';
    } catch (error) {
      console.warn('Error loading selectedDataset from localStorage:', error);
      return 'all'; // Fallback to default
    }
  });
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        // Apply the saved theme to document
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        return savedTheme === 'dark';
      }
      // If no saved theme, use system preference
      return document.documentElement.classList.contains('dark');
    } catch (error) {
      console.warn('Error loading theme from localStorage:', error);
      return document.documentElement.classList.contains('dark');
    }
  });
  const [config, setConfig] = useState(() => {
    try {
      const savedConfig = localStorage.getItem('userConfig');
      const parsedConfig = savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;
      // Validate the config has the required fields
      if (!parsedConfig.owner || !parsedConfig.repo || !parsedConfig.branch) {
        throw new Error('Invalid config format: missing required fields');
      }
      return parsedConfig;
    } catch (error) {
      console.warn('Error loading userConfig from localStorage:', error);
      return DEFAULT_CONFIG; // Fallback to default
    }
  });
  const [isValidating, setIsValidating] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [configSource, setConfigSource] = useState('initializing');

  const FALLBACK_CONFIG = {
    owner: 'ysdede',
    repo: 'asr_benchmark_store',
    branch: 'main',
    availableBranches: ['main']
  };

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

  // Load config with proper priority: localStorage first, then config.json
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // First try to get from localStorage
        const savedConfig = localStorage.getItem('userConfig');
        if (savedConfig) {
          try {
            const parsedConfig = JSON.parse(savedConfig);
            // Validate the saved config has all required fields
            if (parsedConfig.owner && parsedConfig.repo && parsedConfig.branch) {
              setConfig(parsedConfig);
              setConfigSource('localStorage');
              console.log('📋 Configuration loaded from localStorage:', parsedConfig);
              setConfigLoaded(true);
              return;
            } else {
              console.warn('⚠️ Invalid config in localStorage, missing required fields');
            }
          } catch (parseError) {
            console.warn('⚠️ Error parsing localStorage config:', parseError);
          }
        } else {
          console.log('No configuration found in localStorage, checking config.json...');
        }

        // If not in localStorage or invalid, try to load from config.json
        try {
          // Add cache-busting query parameter
          const cacheBuster = Math.random().toString(36).substring(2) + Date.now();
          const configUrl = `/config.json?nocache=${cacheBuster}`;
          
          console.log(`Fetching config from: ${configUrl}`);
          
          const response = await fetch(configUrl, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (response.ok) {
            const fileConfig = await response.json();
            console.log('📄 Raw configuration loaded from config.json:', fileConfig);
            
            // Validate the config has the required fields
            if (!fileConfig.owner || !fileConfig.repo || !fileConfig.branch) {
              throw new Error('Invalid config format: missing required fields');
            }
            
            setConfig(fileConfig);
            setConfigSource('config.json');
            
            // Save to localStorage for future visits
            localStorage.setItem('userConfig', JSON.stringify(fileConfig));
            
            console.log('✅ Configuration applied from config.json and saved to localStorage:', fileConfig);
          } else {
            throw new Error(`Could not load config.json: ${response.status} ${response.statusText}`);
          }
        } catch (fileError) {
          console.warn('⚠️ Error loading config.json:', fileError);
          setConfigSource('fallback');
          console.log('⚙️ Using fallback configuration:', FALLBACK_CONFIG);
          
          // Save fallback to localStorage
          localStorage.setItem('userConfig', JSON.stringify(FALLBACK_CONFIG));
        }
      } catch (error) {
        console.error('❌ Error in config loading process:', error);
        setConfigSource('fallback');
        console.log('⚙️ Using fallback configuration:', FALLBACK_CONFIG);
        
        // Save fallback to localStorage
        localStorage.setItem('userConfig', JSON.stringify(FALLBACK_CONFIG));
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
    
    // If only the branch changed and it's in the availableBranches list, we can skip some validation
    const onlyBranchChanged = 
      newConfig.owner === config.owner && 
      newConfig.repo === config.repo && 
      newConfig.branch !== config.branch &&
      config.availableBranches && 
      config.availableBranches.includes(newConfig.branch);
    
    if (onlyBranchChanged) {
      setDebugInfo(`Switching to branch: ${newConfig.branch}`);
    } else {
      setDebugInfo('Validating repository configuration...');
    }

    try {
      // Validate by fetching the metrics file
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
      setConfigSource(onlyBranchChanged ? 'branch change' : 'user input');
      
      // Save to localStorage
      localStorage.setItem('userConfig', JSON.stringify(newConfig));
      
      console.log(`🔄 Configuration updated: ${onlyBranchChanged ? 'branch changed' : 'full config changed'}`, newConfig);
      setDebugInfo(onlyBranchChanged ? `Switched to branch: ${newConfig.branch}` : 'Configuration validated successfully and saved');
      
      // Reset the current data
      setMetrics([]);
      setDatasets([]);
      setLoading(true);
      setError(null);
      
      // Parse the CSV data we already fetched for validation
      const parsedData = CSVParser.parseCSV(csvText, setDebugInfo);
      
      if (parsedData.length > 0) {
        setMetrics(parsedData);
        
        // Extract unique datasets
        const uniqueDatasets = [...new Set(parsedData.map(item => item.dataset_name))];
        setDatasets(uniqueDatasets);
        
        setDebugInfo(`Parsed ${parsedData.length} records successfully from branch ${newConfig.branch}`);
      } else {
        setDebugInfo(`Branch ${newConfig.branch} has empty data`);
      }
      
      setLoading(false);
    } catch (error) {
      setDebugInfo(`Configuration error: ${error.message}`);
      alert(`Invalid configuration: ${error.message}`);
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
    try {
      // Save theme preference to localStorage
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
      // Update document class
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
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
