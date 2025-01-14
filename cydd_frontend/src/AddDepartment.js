import React, { useState } from 'react';
import axios from 'axios';
import './AddDepartment.css';
import Header from './Header';

const AddDepartmentForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        department_type: 'native',
    });

    const [notification, setNotification] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = formData.department_type === 'native'
                ? 'http://localhost:8000/departments-create/'
                : 'http://localhost:8000/departments/helper/';
            const response = await axios.post(endpoint, formData);
            console.log('Department added:', response.data);
            setNotification("Departman kaydedildi.");

            setFormData({
                name: '',
                category: '',
                department_type: 'native',
            });

            setTimeout(() => {
                setNotification('');
            }, 3000);

        } catch (error) {
            console.error('There was an error adding the department:', error.response.data);
        }
    };

    return (
        <>
            <div className="header-container">
                <Header />
            </div>
            <div className="add-department-container">
                <div className="form-container">
                    <h2 className="form-title">Departman Kayıt Formu</h2>
                    <form onSubmit={handleSubmit} className="add-department-form">
                        <div className="form-group">
                            <label htmlFor="department_type">Departman Türü</label>
                            <select
                                id="department_type"
                                name="department_type"
                                value={formData.department_type}
                                onChange={handleChange}
                            >
                                <option value="native">Yerel Departman</option>
                                <option value="helper">Yardımcı Departman</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Departman Adı</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Departman Adı"
                            />
                        </div>

                        <div className="form-group">
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

                        <div className="clearfix">
                            <button type="submit">Ekle</button>
                        </div>
                    </form>
                    {notification && <div className="notification">{notification}</div>}
                </div>
            </div>
        </>
    );
};

export default AddDepartmentForm;
