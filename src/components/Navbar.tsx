import React from 'react';

interface NavbarProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${currentTab === 'directory' ? 'active' : ''}`} 
        onClick={() => onTabChange('directory')}
      >
        <span className="material-symbols-outlined">navigation</span>
        <span className="nav-label">DIRECTORY</span>
      </button>

      <button 
        className={`nav-item ${currentTab === 'submit' ? 'active' : ''}`} 
        onClick={() => onTabChange('submit')}
      >
        <span className="material-symbols-outlined">add_circle</span>
        <span className="nav-label">SUBMIT</span>
      </button>

      <button 
        className={`nav-item ${currentTab === 'auth' ? 'active' : ''}`} 
        onClick={() => onTabChange('auth')}
      >
        <span className="material-symbols-outlined">hub</span>
        <span className="nav-label">CONNECT</span>
      </button>

      <button 
        className={`nav-item ${currentTab === 'night' ? 'active' : ''}`} 
        onClick={() => onTabChange('night')}
      >
        <span className="material-symbols-outlined">dark_mode</span>
        <span className="nav-label">NIGHT PLANS</span>
      </button>
    </nav>
  );
};

export default Navbar;
