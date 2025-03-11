import React, { useState, useEffect } from 'react';

const GitInfo = () => {
  const [gitInfo, setGitInfo] = useState({ branch: '', commitId: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGitInfo = async () => {
      try {
        console.log('Attempting to fetch git-info.json...');
        const response = await fetch('./git-info.json');
        
        if (response.ok) {
          const data = await response.json();
          console.log('Git info loaded successfully:', data);
          setGitInfo(data);
        } else {
          console.error('Failed to load git info, status:', response.status);
          setError(`Failed to load git info: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching git info:', error);
        setError(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Loading version info...
      </div>
    );
  }

  if (error || (!gitInfo.branch && !gitInfo.commitId)) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {error || 'Version info not available'}
      </div>
    );
  }

  return (
    <div className="text-xs text-gray-600 dark:text-gray-300 text-center font-mono">
      <span>
        {gitInfo.branch && `Branch: ${gitInfo.branch}`} 
        {gitInfo.branch && gitInfo.commitId && ' | '} 
        {gitInfo.commitId && `Commit: ${gitInfo.commitId}`}
      </span>
    </div>
  );
};

export default GitInfo;
