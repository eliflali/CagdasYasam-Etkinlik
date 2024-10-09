import React, { useState } from 'react';
import axios from 'axios';
const AddEventForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        start_time: '',
        end_time: '',
        category: '',
        explanation: '',
        event_type: '',
        point: '',
        place: '',
        manager_student: '',
        manager_member: '',
        target_groups: '',
        native_departments: '',
        helper_departments: '',
        attendant_from_other: '',
        attendant_from_us: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const [notification, setNotification] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/events/', formData);
            console.log('Event added:', response.data);

            setNotification("Etkinlik kaydedildi.");
            setFormData({
                name: '',
                date: '',
                start_time: '',
                end_time: '',
                category: '',
                explanation: '',
                event_type: '',
                point: '',
                place: '',
                manager_student: '',
                manager_member: '',
                target_groups: '',
                native_departments: '',
                helper_departments: '',
                attendant_from_other: '',
                attendant_from_us: '',
            });
            setTimeout(() => {
                setNotification('');
            }, 3000);

        } catch (error) {
            console.error('There was an error adding the event:', error.response.data);
        }
    };

    return (
        <>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="add-member-form">
            <div className="row">
                <div className="form-group half-width">
                    <label htmlFor="name">Etkinlik Adı</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Etkinlik Adı"
                    />
                </div>
                <div className="form-group half-width">
                    <label htmlFor="date">Tarihi</label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group half-width">
                    <label htmlFor="start_time">Başlangıç Saati</label>
                    <input
                        id="start_time"
                        name="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group half-width">
                    <label htmlFor="end_time">Bitiş Saati</label>
                    <input
                        id="end_time"
                        name="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group half-width">
                    <label htmlFor="category">Kategori</label>
                    <input
                        id="category"
                        name="category"
                        type="text"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Kategori"
                    />
                </div>
                <div className="form-group half-width">
                    <label htmlFor="event_type">Etkinlik Türü</label>
                    <input
                        id="event_type"
                        name="event_type"
                        type="text"
                        value={formData.event_type}
                        onChange={handleChange}
                        placeholder="Etkinlik Türü"
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group half-width">
                    <label htmlFor="point">Puanı</label>
                    <input
                        id="point"
                        name="point"
                        type="number"
                        value={formData.point}
                        onChange={handleChange}
                        placeholder="Puanı"
                    />
                </div>
                <div className="form-group half-width">
                    <label htmlFor="place">Mekan</label>
                    <input
                        id="place"
                        name="place"
                        type="text"
                        value={formData.place}
                        onChange={handleChange}
                        placeholder="Mekan"
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group half-width">
                    <label htmlFor="manager_student">Öğrenci Yöneticisi</label>
                    <input
                        id="manager_student"
                        name="manager_student"
                        type="text"
                        value={formData.manager_student}
                        onChange={handleChange}
                        placeholder="Öğrenci Yöneticisi ID"
                    />
                </div>
                <div className="form-group half-width">
                    <label htmlFor="manager_member">Üye Yöneticisi</label>
                    <input
                        id="manager_member"
                        name="manager_member"
                        type="text"
                        value={formData.manager_member}
                        onChange={handleChange}
                        placeholder="Üye Yöneticisi ID"
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group half-width">
                    <label htmlFor="target_groups">Hedef Gruplar</label>
                    <input
                        id="target_groups"
                        name="target_groups"
                        type="text"
                        value={formData.target_groups}
                        onChange={handleChange}
                        placeholder="Hedef Grup ID'leri (Virgülle ayırın)"
                    />
                </div>
                <div className="form-group half-width">
                    <label htmlFor="native_departments">Yerel Departmanlar</label>
                    <input
                        id="native_departments"
                        name="native_departments"
                        type="text"
                        value={formData.native_departments}
                        onChange={handleChange}
                        placeholder="Yerel Departman ID'leri (Virgülle ayırın)"
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group half-width">
                    <label htmlFor="helper_departments">Yardımcı Departmanlar</label>
                    <input
                        id="helper_departments"
                        name="helper_departments"
                        type="text"
                        value={formData.helper_departments}
                        onChange={handleChange}
                        placeholder="Yardımcı Departman ID'leri (Virgülle ayırın)"
                    />
                </div>
                <div className="form-group half-width">
                    <label htmlFor="attendant_from_other">Diğer Katılımcılar</label>
                    <input
                        id="attendant_from_other"
                        name="attendant_from_other"
                        type="number"
                        value={formData.attendant_from_other}
                        onChange={handleChange}
                        placeholder="Diğer Katılımcılar"
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group half-width">
                    <label htmlFor="attendant_from_us">Bizden Katılımcılar</label>
                    <input
                        id="attendant_from_us"
                        name="attendant_from_us"
                        type="number"
                        value={formData.attendant_from_us}
                        onChange={handleChange}
                        placeholder="Bizden Katılımcılar"
                    />
                </div>
            </div>

            <div className="clearfix">
                <button type="submit">Ekle</button>
            </div>
        </form>
        {notification && <div className="notification">{notification}</div>}
        </div>

        <style jsx>{`
            .row {
                display: flex;
                gap: 20px;
                justify-content: space-between;
            }
            .half-width {
                flex: 1;
            }
            .form-container {
                width: 100%;
                padding: 20px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                margin: auto;
            }
            .form-group {
                margin-bottom: 15px;
            }
            input {
                width: 100%;
                padding: 8px;
                margin-top: 5px;
                border-radius: 4px;
                border: 1px solid #ccc;
            }
            button {
                padding: 10px 20px;
                background-color: #0070f3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            button:hover {
                background-color: #005bb5;
            }
        `}</style>
        </>
    );
};

export default AddEventForm;
