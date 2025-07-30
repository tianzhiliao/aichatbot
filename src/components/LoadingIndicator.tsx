import React, { memo } from 'react';

export const LoadingIndicator = memo(() => {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
            style={{ animationDelay: '0.1s' }} 
          />
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
            style={{ animationDelay: '0.2s' }} 
          />
        </div>
      </div>
    </div>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator'; 