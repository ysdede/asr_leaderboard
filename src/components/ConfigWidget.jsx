import React, { useState } from 'react';

const ConfigWidget = ({ config, onApplyConfig, isValidating }) => {
  const [draftConfig, setDraftConfig] = useState(config);

  const handleApply = () => {
    onApplyConfig(draftConfig);
  };

  const handleReset = () => {
    const defaultConfig = {
      owner: 'ysdede',
      repo: 'asr_benchmark_store',
      branch: 'main'
    };
    setDraftConfig(defaultConfig);
    onApplyConfig(defaultConfig);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
      <div className="flex items-center gap-4 text-sm">
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
          <input
            type="text"
            value={draftConfig.branch}
            onChange={(e) => setDraftConfig({ ...draftConfig, branch: e.target.value })}
            className="px-2 py-1 w-24 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            placeholder="Branch"
          />
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
        </div>
      </div>
    </div>
  );
};

export default ConfigWidget; 