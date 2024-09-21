import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './assets/cydd_logo.jpg';

const AddProjectForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        department: '',
    });

    const [departments, setDepartments] = useState([]);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:8000/native-departments/');
                setDepartments(response.data);
            } catch (error) {
                console.error('There was an error fetching departments:', error.response.data);
            }
        };

        fetchDepartments();
    }, []);

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
            const response = await axios.post('http://localhost:8000/projects/', formData);
            console.log('Project added:', response.data);

            setNotification("Proje kaydedildi.");

            setFormData({
                name: '',
                department: '',
            });

            setTimeout(() => {
                setNotification('');
            }, 3000);

        } catch (error) {
            console.error('There was an error adding the project:', error.response.data);
        }
    };

    return (
        <>
        <div className="form-container">
            <div className="header">
                <img src={logo} alt="Logo" width="100" />
                <h1>Çağdaş Yaşamı Destekleme Derneği Yenişehir</h1>
            </div>
            <form onSubmit={handleSubmit} className="add-project-form">
                <div className="form-group">
                    <label htmlFor="name">Proje Adı</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Proje Adı"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="department">Departman</label>
                    <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                    >
                        <option value="">Bir Departman Seçin</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
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

export default AddProjectForm;
