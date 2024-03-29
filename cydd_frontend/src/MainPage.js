import React from 'react';
import BaseLayout from './BaseLayout';
import './MainPage.css'; // Your CSS file for MainPage styles

const MainPage = ({ events }) => {
  return (
    <BaseLayout>
      <div className="header">
        <div>
          <button className='button' onClick={() => window.location.href='/add_member'}>Üye Ekle</button>
          <button  className='button' onClick={() => window.location.href='/query_member'}>Üye Sorgula</button>
        </div>
      </div>
      <div>

      </div>
    </BaseLayout>
  );
};

export default MainPage;
