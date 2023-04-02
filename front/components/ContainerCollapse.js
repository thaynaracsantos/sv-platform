// components/ContainerCollapse.js

import React, { useState } from 'react';

const ContainerCollapse = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      <button
        className="w-full text-left py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-t focus:outline-none"
        onClick={toggleCollapse}
      >
        {title}
      </button>
      {isOpen && (
        <div className="border-2 border-t-0 rounded-b p-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default ContainerCollapse;
