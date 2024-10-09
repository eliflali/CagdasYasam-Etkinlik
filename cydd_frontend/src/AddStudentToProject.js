import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddStudentToDepartmentProjectForm = () => {
    const [formData, setFormData] = useState({
        student: '',
        department: '',
        projects: [],
    });

    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [projects, setProjects] = useState([]);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentsResponse =  await axios.get('http://localhost:8000/student_list/');
                ;
                const departmentsResponse = await axios.get('http://localhost:8000/departments');
                setStudents(studentsResponse.data);
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
            const response = await axios.post('http://localhost:8000/student_memberships/', formData);
            console.log('Member added to department and projects:', response.data);

            setNotification("Öğrenci departman ve projelere eklendi.");

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
            <form onSubmit={handleSubmit} className="add-member-to-department-project-form">
                <div className="form-group">
                    <label htmlFor="student">Student</label>
                    <select
                        id="student"
                        name="student"
                        value={formData.student}
                        onChange={handleChange}
                    >
                        <option value="">Bir Öğrenci Seçin</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>
                                {student.name}
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

export default AddStudentToDepartmentProjectForm;
