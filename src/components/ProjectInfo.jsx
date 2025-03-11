import React, { useEffect } from 'react';

const ProjectInfo = () => {
  useEffect(() => {
    // Add GitHub button script
    const script = document.createElement('script');
    script.src = 'https://buttons.github.io/buttons.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="mt-8 border-t pt-4 dark:border-gray-700">
      <div className="max-w-7xl mx-auto rounded-lg overflow-hidden dark:bg-gray-800 bg-white shadow">
        <div className="p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-700 mb-2">
                About ASR Leaderboard
              </h2>
              <p className="text-sm dark:text-gray-300 text-gray-600 mb-2">
                A dynamic and interactive leaderboard for Automatic Speech Recognition (ASR) models. 
                This project automatically fetches benchmark results from Hugging Face datasets, 
                parses the data, and presents it in an organized, sortable table format.
              </p>
              <p className="text-sm dark:text-gray-300 text-gray-600">
                While the current implementation focuses on Turkish ASR models, this project is designed 
                to be universal and can be easily adapted for other languages and datasets.
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start">
              <div className="mb-2">
                <a className="github-button" 
                  href="https://github.com/ysdede/asr_leaderboard" 
                  data-size="large" 
                  data-show-count="true" 
                  aria-label="Star ysdede/asr_leaderboard on GitHub">Star</a>
              </div>
              <div className="text-xs dark:text-gray-400 text-gray-500">
                Adapt this project for your language!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
