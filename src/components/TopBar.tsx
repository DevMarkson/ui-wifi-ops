import React from 'react';

const TopBar: React.FC = () => {
    return (
        <header className="top-bar">
            <div className="top-bar-left">
                <span className="material-symbols-outlined logo-icon">wifi_tethering</span>
                <h1 className="logo-text">UI WIFI OPS</h1>
            </div>
        </header>
    );
};

export default TopBar;
