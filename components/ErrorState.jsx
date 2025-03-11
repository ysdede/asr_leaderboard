const ErrorState = ({ error, debugInfo }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-red-500 dark:text-red-400 p-4 max-w-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-semibold mb-2">Error</p>
        <p>{error}</p>
        <span className="text-xs dark:text-gray-400 text-gray-500 mt-4 block">{debugInfo}</span>
      </div>
    </div>
  );
}; 