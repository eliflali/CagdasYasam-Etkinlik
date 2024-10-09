import React, { useState } from 'react';
import axios from 'axios';

const AddTargetGroupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const [notification, setNotification] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/target-groups/', formData);
            console.log('Target Group added:', response.data);

            setNotification("Hedef grup kaydedildi.");

            // Clear the form after successful submission
            setFormData({
                name: '',
            });

            // Clear the notification after a few seconds
            setTimeout(() => {
                setNotification('');
            }, 3000);

        } catch (error) {
            console.error('There was an error adding the target group:', error.response.data);
        }
    };

    return (
        <>
        <div className="form-container">
            <form onSubmit={handleSubmit} className="add-target-group-form">
                <div className="form-group">
                    <label htmlFor="name">Hedef Grup Adı</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Hedef Grup Adı"
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

export default AddTargetGroupForm;
