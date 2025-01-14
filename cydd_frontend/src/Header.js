import React, { useState } from 'react';
import logo from './assets/cydd_logo.jpg';
import './Header.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

function Header() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const menuItems = [
    {
      title: "Üye",
      items: [
        { label: "Üye Ekle", path: "/add_member" },
        { label: "Üye Sorgula", path: "/query_member" }
      ]
    },
    {
      title: "Öğrenci", 
      items: [
        { label: "Öğrenci Ekle", path: "/add-student" },
        { label: "Öğrenci Sorgula", path: "/query_student" }
      ]
    },
    {
      title: "Etkinlik",
      items: [
        { label: "Etkinlik Ekle", path: "/add_event" },
        { label: "Etkinlik Sorgula", path: "/query_event" }
      ]
    },
    {
      title: "Proje",
      items: [
        { label: "Proje Ekle", path: "/add-project" },
        { label: "Projeye Üye Ekle", path: "/add-member-to-department-project" },
        { label: "Projeye Öğrenci Ekle", path: "/add-student-to-department-project" }
      ]
    },
    {
      title: "Departman",
      items: [
        { label: "Departman Ekle", path: "/add-department" },
        { label: "Hedef Kitle Ekle", path: "/add-target-group" }
      ]
    }
  ];

  return (
    <div className="header" style={{ position: 'relative' }}>
      <div className="header-top">
        <div className="header-logo-title">
          <img src={logo} alt="Logo" width="50" />
          <h3>Çağdaş Yaşamı Destekleme Derneği Yenişehir</h3>
        </div>
        <button className="expand-button" onClick={toggleExpand}>
          {isExpanded ? <BsChevronUp size={20} /> : <BsChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="navigationBar" style={{ position: 'relative' }}>
          <div className="main-menu" style={{ position: 'relative', zIndex: 10001 }}>
            {menuItems.map((menu, index) => (
              <DropdownButton 
                key={index} 
                id={`dropdown-${menu.title}`} 
                title={menu.title}
                className="nav-dropdown"
                style={{ position: 'relative' }}
              >
                {menu.items.map((item, idx) => (
                  <Dropdown.Item 
                    key={idx} 
                    onClick={() => window.location.href = item.path}
                  >
                    {item.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
