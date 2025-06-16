// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
      <h1 className="text-2xl font-bold text-blue-600">ResumeMatcher</h1>
      <div className="space-x-4">
        <button className="text-blue-600 hover:underline">Login</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</button>
      </div>
    </header>
  );
};

export default Navbar;
