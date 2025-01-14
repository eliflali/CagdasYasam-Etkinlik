import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './StudentProfilePage.css';

const StudentProfilePage = ({ student, onClose }) => {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="profile-card">
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <h2 className="profile-title">{student.name}</h2>
                
                <div className="info-section">
                    <h3>Kişisel Bilgiler</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>TC Numarası</label>
                            <span>{student.tc_number}</span>
                        </div>
                        <div className="info-item">
                            <label>E-posta</label>
                            <span>{student.email}</span>
                        </div>
                        <div className="info-item">
                            <label>Telefon</label>
                            <span>{student.phone_number}</span>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h3>Eğitim Bilgileri</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Okul</label>
                            <span>{student.school}</span>
                        </div>
                        <div className="info-item">
                            <label>Bölüm</label>
                            <span>{student.department}</span>
                        </div>
                        <div className="info-item">
                            <label>Sınıf</label>
                            <span>{student.student_class}</span>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h3>Gönüllülük Bilgileri</h3>

                    <div className="info-grid">
                        <div className="info-item">
                            <label>Gönüllülük Durumu</label>
                            <span>{student.student_type === 'volunteering' ? 'Gönüllü Öğrenci' : 'Burslu Öğrenci'}</span>
                        </div>
                        <div className="info-item">
                            <label>Toplam Puan</label>
                            <span>{student.points_collected}</span>
                        </div>
                        <div className="info-item">
                            <label>Görev</label>
                            <span>{student.mission || '-'}</span>
                        </div>
                        <div className="info-item">
                            <label>Grup</label>
                            <span>{student.group || '-'}</span>
                        </div>
                        <div className="info-item">
                            <label>Durum</label>
                            <span className={student.active ? 'status-active' : 'status-inactive'}>
                                {student.active ? 'Aktif' : 'Pasif'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfilePage;
