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
        className="w-full text-black text-left py-2 px-4 bg-pink-200 hover:bg-pink-300 rounded-t focus:outline-none active:scale-[102%] transition-all ease-in-out duration-300 focus:bg-pink-900 focus:text-white"
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
