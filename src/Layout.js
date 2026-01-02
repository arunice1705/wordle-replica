import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="brutalist-layout">
            <main className="brutalist-main">
                {children}
            </main>
        </div>
    );
};

export default Layout;
