import React from 'react';

const PromptBox = ({ message, onClose }) => {
  if (!message) return null;

  const [type, content] = message.includes(':') ? message.split(':') : ['info', message];

  const isError = type === 'error';
  const isSuccess = type === 'success';

  const bgColor = isError ? 'bg-red-100' : isSuccess ? 'bg-green-100' : 'bg-gray-100';
  const textColor = isError ? 'text-red-800' : isSuccess ? 'text-green-800' : 'text-gray-800';
  const borderColor = isError ? 'border-red-300' : isSuccess ? 'border-green-300' : 'border-gray-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className={`px-6 py-4 rounded-xl shadow-xl max-w-sm w-full border ${bgColor} ${textColor} ${borderColor}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {isError ? 'Oops!' : isSuccess ? 'Success' : 'Info'}
          </h2>
          <button onClick={onClose} className="text-xl font-bold hover:scale-110 transition">&times;</button>
        </div>
        <div className="mt-2 text-sm"> {content}</div>
        <div className="mt-4 text-right">
          <button onClick={onClose}
            className={`px-4 py-1 rounded transition 
              ${isError ? 'bg-red-500 hover:bg-red-600' : 
                isSuccess ? 'bg-green-500 hover:bg-green-600' : 
                'bg-gray-500 hover:bg-gray-600'}
              text-white`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptBox;
