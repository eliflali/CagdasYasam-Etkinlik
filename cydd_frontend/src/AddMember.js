import React, { useState } from 'react';
import axios from 'axios';
import logo from './assets/cydd_logo.jpg'

const AddMemberForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        mission: '',
        school: '',
        department: '',
        student_class: '',
        group: '',
        phone_number: '',
        email: '',
        tc_number: '',
        active: true,
        points_collected: 0,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(name);
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // New state for managing notification
    const [notification, setNotification] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/members/', formData);
            console.log('Member added:', response.data);

            // Set notification
            setNotification("Üye kaydedildi.");

            // Clear form fields
            setFormData({
                name: '',
                mission: '',
                school: '',
                department: '',
                student_class: '',
                group: '',
                phone_number: '',
                email: '',
                tc_number: '',
                active: true,
                points_collected: 0,
            });

            // Optionally, clear notification after a few seconds
            setTimeout(() => {
                setNotification('');
            }, 3000); // Clear notification after 5 seconds

        } catch (error) {
            console.error('There was an error adding the member:', error.response.data);
        }
    };

    // Form fields go here
    return (
        <>
        
      <div className="form-container">
      <div className="header">
        <img src={logo} alt="Logo" width="100" />
        <h1>Çağdaş Yaşamı Destekleme Derneği Yenişehir</h1>
      </div>
        <form onSubmit={handleSubmit} className="add-member-form">
            {/* Example field */}
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
            <label htmlFor="mission">Görevi</label>
                    <input
                        id="mission"
                        name="mission"
                        type="text"
                        value={formData.mission}
                        onChange={handleChange}
                        placeholder="Görevi"
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
            <label htmlFor="department">Bölümü</label>
                    <input
                        id="department"
                        name="department"
                        type="text"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Bölümü"
                    />
                </div>
            
                <div className="form-group"> 
            <label htmlFor="student_class">Sınıfı</label>
                    <input
                        id="student_class"
                        name="student_class"
                        type="text"
                        value={formData.student_class}
                        onChange={handleChange}
                        placeholder="Sınıfı"
                    />
                </div>
                <div className="form-group"> 
            <label htmlFor="group">Öbeği</label>
                    <input
                        id="group"
                        name="group"
                        type="text"
                        value={formData.group}
                        onChange={handleChange}
                        placeholder="Öbeği"
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
            <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="E-mail"
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
                        placeholder="TC numarası"
                    />
                </div>

            
            <div className="form-group">
                    <label>Aktif
                        <input
                            name="active"
                            type="checkbox"
                            checked={formData.active}
                            onChange={handleChange}
                        /> 
                    </label>
                </div>

                <div className="form-group"> 
            <label htmlFor="points_collected">Topladığı Puan</label>
                    <input
                        id="points_collected"
                        name="points_collected"
                        type="text"
                        value={formData.points_collected}
                        onChange={handleChange}
                        placeholder="Topladığı Puan"
                    />
                </div>
            {/* Include other fields similarly */}
            <div className="clearfix">
                    <button type="submit">Ekle</button>
                </div>
        </form>
        {notification && <div className="notification">{notification}</div>}
        </div>
        </>
    );
};

export default AddMemberForm;
