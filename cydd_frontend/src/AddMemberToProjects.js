import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './assets/cydd_logo.jpg';

const AddMemberToDepartmentProjectForm = () => {
    const [formData, setFormData] = useState({
        member: '',
        department: '',
        projects: [],
    });

    const [members, setMembers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [projects, setProjects] = useState([]);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const membersResponse =  await axios.get('http://localhost:8000/members_list/');
                ;
                const departmentsResponse = await axios.get('http://localhost:8000/departments');
                setMembers(membersResponse.data);
                setDepartments(departmentsResponse.data);
            } catch (error) {
                console.error('There was an error fetching data:', error.response.data);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, options } = e.target;
        if (name === 'projects') {
            const selectedProjects = Array.from(options).filter(option => option.selected).map(option => option.value);
            setFormData(prevState => ({
                ...prevState,
                projects: selectedProjects,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleDepartmentChange = async (e) => {
        const { value } = e.target;  // value is the department ID
        setFormData(prevState => ({
            ...prevState,
            department: value,
        }));
    
        try {
            const response = await axios.get(`http://localhost:8000/departments/${value}/projects/`);
            setProjects(response.data);
        } catch (error) {
            console.error('There was an error fetching projects:', error.response.data);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/memberships/', formData);
            console.log('Member added to department and projects:', response.data);

            setNotification("Üye departman ve projelere eklendi.");

            setFormData({
                member: '',
                department: '',
                projects: [],
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
            <form onSubmit={handleSubmit} className="add-member-to-department-project-form">
                <div className="form-group">
                    <label htmlFor="member">Üye</label>
                    <select
                        id="member"
                        name="member"
                        value={formData.member}
                        onChange={handleChange}
                    >
                        <option value="">Bir Üye Seçin</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="department">Departman</label>
                    <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleDepartmentChange}
                    >
                        <option value="">Bir Departman Seçin</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="projects">Projeler</label>
                    <select
                        id="projects"
                        name="projects"
                        multiple
                        value={formData.projects}
                        onChange={handleChange}
                    >
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
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

export default AddMemberToDepartmentProjectForm;
