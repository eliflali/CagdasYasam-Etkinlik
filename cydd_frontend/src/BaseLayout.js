import React from 'react';
import cyddLogo from './assets/cydd_logo.jpg'; // Adjust the path as necessary
import './BaseLayout.css'; // Your CSS file for styles

const BaseLayout = ({ children }) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <div className="header">
            <img src={cyddLogo} alt="Logo" width="100" />
            <h1 className="header_text">
              Çağdaş Yaşamı Destekleme Derneği Yenişehir
            </h1>
          </div>
          {/* Add additional navigation links if needed */}
        </div>
      </nav>
      <div className="container mt-4">
        {children}
      </div>
      {/* Add your scripts here if needed */}
    </>
  );
};

export default BaseLayout;
