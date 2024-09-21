import React, { useState } from 'react';
import axios from 'axios';
import logo from './assets/cydd_logo.jpg';

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

            setFormData({
                name: '',
            });

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
            <div className="header">
                <img src={logo} alt="Logo" width="100" />
                <h1>Çağdaş Yaşamı Destekleme Derneği Yenişehir</h1>
            </div>
            <form onSubmit={handleSubmit} className="add-target-group-form">
                <div className="form-group">
                    <label htmlFor="name">Hedef Grup Adı</label>
                    <select
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    >
                        <option value="">Bir Hedef Grup Seçin</option>
                        <option value="BURS_VERENLER">Burs Verenler</option>
                        <option value="BURSLU_OGRENCILER">Burslu Öğrenciler</option>
                        <option value="COCUKLAR">Çocuklar</option>
                        <option value="GENCLER">Gençler</option>
                        <option value="GONULLULER">Gönüllüler</option>
                        <option value="KADINLAR">Kadınlar</option>
                        <option value="MEDYA_KAMUOYU">Medya - Kamuoyu</option>
                        <option value="OGRENCILER">Öğrenciler</option>
                        <option value="KURUMSAL_SIRKETLER_STO">Kurumsal Şirketler - STÖ'ler</option>
                        <option value="RESMI_KURUMLAR_YEREL_YONETIMLER">Resmi Kurumlar - Yerel Yönetimler</option>
                        <option value="OGRENCILER_YETISKINLER">Öğrenciler-Yetişkinler</option>
                        <option value="UYELER">Üyeler</option>
                        <option value="VELILER">Veliler</option>
                        <option value="UYELER_VE_GONULLULER">Üyeler ve Gönüllüler</option>
                        <option value="HALK">Halk</option>
                        <option value="YONETIM_KURULU">Yönetim Kurulu</option>
                        <option value="ESNAF">Esnaf</option>
                    </select>
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
