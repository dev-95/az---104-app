import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg text-gray-600">Generating your AZ-104 quiz with AI...</p>
    </div>
  );
};

export default Spinner;