import React, { useState } from 'react';
import axios from 'axios';

const AddStudentForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        tc_number: '',
        school: '',
        department: '',
        student_class: '',
        phone_number: '',
        active: true,
        points_collected: 0,
        student_type: '', // Default to volunteering student
        mission: '',
        group: '',
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
            const endpoint = formData.student_type === 'volunteering'
                ? 'http://localhost:8000/volunteer_students/'
                : 'http://localhost:8000/scholarship_students/';
            const response = await axios.post(endpoint, formData);
            console.log('Student added:', response.data);

            setNotification("Öğrenci kaydedildi.");

            setFormData({
                name: '',
                email: '',
                tc_number: '',
                school: '',
                department: '',
                student_class: '',
                phone_number: '',
                active: true,
                points_collected: 0,
                student_type: 'volunteering',
                mission: '',
                group: '',
            });

            setTimeout(() => {
                setNotification('');
            }, 3000);

        } catch (error) {
            console.error('There was an error adding the student:', error.response.data);
        }
    };

    return (
        <>
        <div className="form-container">
            <form onSubmit={handleSubmit} className="add-student-form">
                <div className="form-group">
                    <label htmlFor="student_type">Öğrenci Türü</label>
                    <select
                        id="student_type"
                        name="student_type"
                        value={formData.student_type}
                        onChange={handleChange}
                    >
                        <option value="volunteering">Gönüllü Öğrenci</option>
                        <option value="scholarship">Burslu Öğrenci</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="name">İsim Soyisim</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="İsim Soyisim"
                    />
                </div>
                <div className="form-group"> 
                    <label htmlFor="email">E-posta</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="E-posta"
                    />
                </div>
                <div className="form-group"> 
                    <label htmlFor="tc_number">TC Numarası</label>
                    <input
                        id="tc_number"
                        name="tc_number"
                        type="text"
                        value={formData.tc_number}
                        onChange={handleChange}
                        placeholder="TC Numarası"
                    />
                </div>
                <div className="form-group"> 
                    <label htmlFor="school">Okul</label>
                    <input
                        id="school"
                        name="school"
                        type="text"
                        value={formData.school}
                        onChange={handleChange}
                        placeholder="Okul"
                    />
                </div>
                <div className="form-group"> 
                    <label htmlFor="department">Bölüm</label>
                    <input
                        id="department"
                        name="department"
                        type="text"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Bölüm"
                    />
                </div>
                <div className="form-group"> 
                    <label htmlFor="student_class">Sınıf</label>
                    <input
                        id="student_class"
                        name="student_class"
                        type="text"
                        value={formData.student_class}
                        onChange={handleChange}
                        placeholder="Sınıf"
                    />
                </div>
                <div className="form-group"> 
                    <label htmlFor="phone_number">Telefon Numarası</label>
                    <input
                        id="phone_number"
                        name="phone_number"
                        type="text"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="Telefon Numarası"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="mission">Görev</label>
                    <input
                        id="mission"
                        name="mission"
                        type="text"
                        value={formData.mission}
                        onChange={handleChange}
                        placeholder="Görev"
                    />
                </div>
                <div className="form-group"> 
                    <label htmlFor="group">Öbek</label>
                    <input
                        id="group"
                        name="group"
                        type="text"
                        value={formData.group}
                        onChange={handleChange}
                        placeholder="Öbek"
                    />
                </div>
                <div className="clearfix">
                    <button type="submit">Ekle</button>
                </div>
            </form>
            {notification && <div className="notification">{notification}</div>}
        </div>
        </>
    );
};

export default AddStudentForm;
