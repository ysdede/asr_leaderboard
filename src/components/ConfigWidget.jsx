import React, { useState } from 'react';

const ConfigWidget = ({ config, onApplyConfig, isValidating }) => {
  const [draftConfig, setDraftConfig] = useState(config);
  const [showDebug, setShowDebug] = useState(false);
  const [configFileContent, setConfigFileContent] = useState(null);

  // Get available branches from config or use a default if not available
  const availableBranches = config.availableBranches || ['main', 'dev'];

  const handleApply = () => {
    onApplyConfig(draftConfig);
  };

  const handleBranchChange = (e) => {
    const newBranch = e.target.value;
    const updatedConfig = { ...draftConfig, branch: newBranch };
    setDraftConfig(updatedConfig);
    
    // Immediately apply the new branch without requiring the Apply button
    onApplyConfig(updatedConfig);
  };

  const handleReset = () => {
    // Fetch the default config from config.json with cache busting
    const cacheBuster = Math.random().toString(36).substring(2) + Date.now();
    fetch(`/config.json?nocache=${cacheBuster}`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Could not load config.json: ${response.status} ${response.statusText}`);
      }
    })
    .then(fileConfig => {
      console.log('Reset to config from file:', fileConfig);
      setDraftConfig(fileConfig);
      onApplyConfig(fileConfig);
    })
    .catch(error => {
      alert('Error loading default config: ' + error.message);
      // Fall back to hardcoded defaults
      const defaultConfig = {
        owner: 'ysdede',
        repo: 'asr_benchmark_store',
        branch: 'main',
        availableBranches: ['main', 'dev']
      };
      setDraftConfig(defaultConfig);
      onApplyConfig(defaultConfig);
    });
  };

  const clearCache = () => {
    localStorage.removeItem('userConfig');
    
    // Instead of reloading, fetch the config.json and apply it
    const cacheBuster = Math.random().toString(36).substring(2) + Date.now();
    fetch(`/config.json?nocache=${cacheBuster}`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Could not load config.json: ${response.status} ${response.statusText}`);
      }
    })
    .then(fileConfig => {
      setDraftConfig(fileConfig);
      onApplyConfig(fileConfig);
      alert('Configuration cache cleared and default config loaded.');
    })
    .catch(error => {
      alert('Error loading default config: ' + error.message);
    });
  };

  const checkConfigFile = () => {
    setShowDebug(true);
    // Fetch the config.json file with cache busting
    const cacheBuster = Math.random().toString(36).substring(2) + Date.now();
    fetch(`/config.json?nocache=${cacheBuster}`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Could not load config.json: ${response.status} ${response.statusText}`);
      }
    })
    .then(fileConfig => {
      setConfigFileContent(fileConfig);
    })
    .catch(error => {
      setConfigFileContent({ error: error.message });
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">Repository Settings:</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draftConfig.owner}
            onChange={(e) => setDraftConfig({ ...draftConfig, owner: e.target.value })}
            className="px-2 py-1 w-32 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            placeholder="Owner"
          />
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <input
            type="text"
            value={draftConfig.repo}
            onChange={(e) => setDraftConfig({ ...draftConfig, repo: e.target.value })}
            className="px-2 py-1 w-40 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            placeholder="Repository"
          />
          <span className="text-gray-500 dark:text-gray-400">:</span>
          <select
            value={draftConfig.branch}
            onChange={handleBranchChange}
            className="px-2 py-1 w-24 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
          >
            {availableBranches.map(branch => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <button
            onClick={handleApply}
            disabled={isValidating}
            className={`px-3 py-1 rounded text-white text-sm transition-colors
              ${isValidating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isValidating ? 'Validating...' : 'Apply'}
          </button>
          <button
            onClick={handleReset}
            disabled={isValidating}
            className="px-3 py-1 rounded text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Reset
          </button>
          <button
            onClick={clearCache}
            disabled={isValidating}
            className="px-3 py-1 rounded text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            title="Clear cached configuration and reload"
          >
            Clear Cache
          </button>
          <button
            onClick={checkConfigFile}
            className="px-3 py-1 rounded text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Check Config
          </button>
        </div>
      </div>
      
      {showDebug && configFileContent && (
        <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto">
          <h4 className="font-bold mb-1">config.json content:</h4>
          <pre>{JSON.stringify(configFileContent, null, 2)}</pre>
          <h4 className="font-bold mt-2 mb-1">localStorage content:</h4>
          <pre>{localStorage.getItem('userConfig') || 'No config in localStorage'}</pre>
          <h4 className="font-bold mt-2 mb-1">Current config:</h4>
          <pre>{JSON.stringify(draftConfig, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ConfigWidget; 