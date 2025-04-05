import React from "react";

function Button({ children, className, ...props }) {
  return (
    <button
      className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
