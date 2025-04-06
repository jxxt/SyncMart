import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-black text-white sticky top-0 z-50 border-b border-gray-800 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold tracking-tight hover:text-gray-300 transition-colors duration-300"
        >
          Sync<span className="text-gray-300">Mart</span>
        </Link>
        
        <button 
          className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-300 relative group cursor-pointer"
          aria-label="Shopping cart"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          {/* Optional subtle dot to indicate cart has items */}
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;