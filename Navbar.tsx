import React from 'react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLoginClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">Meldungssystem</span>
          </div>
          <button
            onClick={onLoginClick}
            className={`creative-btn text-white font-medium ${isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoggedIn}
          >
            {isLoggedIn ? 'Eingeloggt' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;