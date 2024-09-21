import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './assets/cydd_logo.jpg';

const AddMemberForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        tc_number: '',
        total_volunteering_hours: 0,
        start_time: '',
        end_time: '',
        member_type: 'volunteering', // Default to volunteering member
    });

    const [useTodayDate, setUseTodayDate] = useState(false);

    useEffect(() => {
        if (useTodayDate) {
            const now = new Date();
            const today = now.toISOString().substring(0, 10); // Get the date part (YYYY-MM-DD)
            const currentTime = now.toTimeString().substring(0, 5); // Get the time part (HH:MM)
            setFormData(prevState => ({
                ...prevState,
                start_time: `${today}T${currentTime}` // Combine date and time
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                start_time: '', // Clear the start_time if the checkbox is unchecked
            }));
        }
    }, [useTodayDate]);

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

        // Prepare the formData to handle optional end_time
        const submitData = {
            ...formData,
            end_time: formData.end_time || null,  // Set end_time to null if it’s an empty string
        };

        try {
            const endpoint = submitData.member_type === 'volunteering'
                ? 'http://localhost:8000/volunteers/'
                : 'http://localhost:8000/registered/';
            const response = await axios.post(endpoint, submitData);
            console.log('Member added:', response.data);

            setNotification("Üye kaydedildi.");

            setFormData({
                name: '',
                tc_number: '',
                total_volunteering_hours: 0,
                start_time: '',
                end_time: '',
                member_type: 'volunteering',
            });

            setTimeout(() => {
                setNotification('');
            }, 3000);

        } catch (error) {
            console.error('There was an error adding the member:', error.response.data);
        }
    };

    return (
        <>
        <div className="form-container">
            <div className="header">
                <img src={logo} alt="Logo" width="100" />
                <h1>Çağdaş Yaşamı Destekleme Derneği Yenişehir</h1>
            </div>
            <form onSubmit={handleSubmit} className="add-member-form">
                <div className="form-group">
                    <label htmlFor="member_type">Üye Türü</label>
                    <select
                        id="member_type"
                        name="member_type"
                        value={formData.member_type}
                        onChange={handleChange}
                    >
                        <option value="volunteering">Gönüllü Üye</option>
                        <option value="registered">Kayıtlı Üye</option>
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
                    <label htmlFor="total_volunteering_hours">Toplam Gönüllü Saat</label>
                    <input
                        id="total_volunteering_hours"
                        name="total_volunteering_hours"
                        type="number"
                        value={formData.total_volunteering_hours}
                        onChange={handleChange}
                        placeholder="Toplam Gönüllü Saat"
                    />
                </div>
                <div className="form-group"> 
                    <label htmlFor="useTodayDate">Bugünkü Tarihi Kullan</label>
                    <input
                        id="useTodayDate"
                        name="useTodayDate"
                        type="checkbox"
                        checked={useTodayDate}
                        onChange={() => setUseTodayDate(!useTodayDate)}
                    />
                </div>
                {!useTodayDate && (
                    <div className="form-group">
                        <label htmlFor="start_time">Başlangıç Tarihi</label>
                        <input
                            id="start_time"
                            name="start_time"
                            type="date"
                            value={formData.start_time.substring(0, 10)}
                            onChange={handleChange}
                        />
                    </div>
                )}
                <div className="form-group"> 
                    <label htmlFor="end_time">Bitiş Tarihi</label>
                    <input
                        id="end_time"
                        name="end_time"
                        type="date"
                        value={formData.end_time.substring(0, 10)}
                        onChange={handleChange}
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

export default AddMemberForm;
