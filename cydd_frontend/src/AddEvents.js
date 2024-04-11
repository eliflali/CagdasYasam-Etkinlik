import React, { useState } from 'react';
import axios from 'axios';
import logo from './assets/cydd_logo.jpg'
import './AddEvents.css'

const AddEventForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        point: '',
        place: '',
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
            const response = await axios.post('http://localhost:8000/events/', formData);
            console.log('Event added:', response.data);

            // Set notification
            setNotification("Etkinlik kaydedildi.");

            // Clear form fields
            setFormData({
                name: '',
                date: '',
                point: '',
                place: '',
            });

            // Optionally, clear notification after a few seconds
            setTimeout(() => {
                setNotification('');
            }, 3000); // Clear notification after 5 seconds

        } catch (error) {
            console.error('There was an error adding the event:', error.response.data);
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
            <div className="form-group"> 
            <label htmlFor="date">Tarihi</label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group"> 
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
                <div className="form-group"> 
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
        
            <div className="clearfix">
                    <button type="submit">Ekle</button>
                </div>
        </form>
        {notification && <div className="notification">{notification}</div>}
        </div>
        </>
    );
};

export default AddEventForm;
