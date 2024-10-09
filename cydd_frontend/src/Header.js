import React from 'react';
import logo from './assets/cydd_logo.jpg';
import './Header.css'; // Add the CSS file for styling
import { Dropdown, DropdownButton } from 'react-bootstrap';

function Header() {
  return (
    <div className='header'>
      <div className="header-top">
        <img src={logo} alt="Logo" width="50" />
        <h3>Çağdaş Yaşamı Destekleme Derneği Yenişehir</h3>
      </div>
      <div className='navigationBar'>
        {/* Üye Dropdown */}
        <DropdownButton id="dropdown-basic-button" title="Üye">
          <Dropdown.Item onClick={() => window.location.href='/add_member'}>Üye Ekle</Dropdown.Item>
          <Dropdown.Item onClick={() => window.location.href='/query_member'}>Üye Sorgula</Dropdown.Item>
        </DropdownButton>

        <DropdownButton id="dropdown-basic-button" title="Öğrenci">
          <Dropdown.Item onClick={() => window.location.href='/add-student'}>Öğrenci Ekle</Dropdown.Item>
          <Dropdown.Item onClick={() => window.location.href='/query_student'}>Öğrenci Sorgula</Dropdown.Item>
        </DropdownButton>

        {/* Proje Dropdown */}
        <DropdownButton id="dropdown-basic-button" title="Proje">
          <Dropdown.Item onClick={() => window.location.href='/add-project'}>Proje Ekle</Dropdown.Item>
          <Dropdown.Item onClick={() => window.location.href='/add-member-to-department-project'}>Projeye Üye Ekle</Dropdown.Item>
          <Dropdown.Item onClick={() => window.location.href='/add-student-to-department-project'}>Projeye Öğrenci Ekle</Dropdown.Item>
        </DropdownButton>

        {/* Etkinlik Dropdown */}
        <DropdownButton id="dropdown-basic-button" title="Etkinlik">
          <Dropdown.Item onClick={() => window.location.href='/add_event'}>Etkinlik Ekle</Dropdown.Item>
          <Dropdown.Item onClick={() => window.location.href='/query_event'}>Etkinlik Sorgula</Dropdown.Item>
        </DropdownButton>

        {/* Departman Dropdown */}
        <DropdownButton id="dropdown-basic-button" title="Departman">
          <Dropdown.Item onClick={() => window.location.href='/add-department'}>Departman Ekle</Dropdown.Item>
          <Dropdown.Item onClick={() => window.location.href='/add-target-group'}>Hedef Kitle Ekle</Dropdown.Item>
        </DropdownButton>
        
      </div>
    </div>
  );
}

export default Header;
