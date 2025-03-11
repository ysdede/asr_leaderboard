const LoadingState = ({ debugInfo }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg">Loading benchmark data...</p>
        <span className="text-xs dark:text-gray-400 text-gray-500">{debugInfo}</span>
      </div>
    </div>
  );
}; 