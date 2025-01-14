import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddEvents.css';
import Header from './Header';

const AddEventForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        start_time: '',
        end_time: '',
        category: '',
        explanation: '',
        event_type: '',
        point: '',
        place: '',
        manager_student: null,
        manager_member: null,
        target_groups: '',
        native_departments: [],
        helper_departments: [],
        attendant_from_other: '',
        attendant_from_us: '',
    });

    const [departments, setDepartments] = useState({
        native: [],
        helper: []
    });

    const [isOpenNative, setIsOpenNative] = useState(false);
    const [isOpenHelper, setIsOpenHelper] = useState(false);
    const [isOpenTargetGroups, setIsOpenTargetGroups] = useState(false);
    const [targetGroups, setTargetGroups] = useState([]);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [studentSearchResults, setStudentSearchResults] = useState([]);
    const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [memberSearchTerm, setMemberSearchTerm] = useState('');
    const [memberSearchResults, setMemberSearchResults] = useState([]);
    const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        fetchDepartments();
        fetchTargetGroups();
        fetchStudents();
        fetchMembers();
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (name === 'native_departments' || name === 'helper_departments') {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setFormData(prevState => ({
                ...prevState,
                [name]: selectedOptions
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? e.target.checked : value
            }));
        }
    };

    const [notification, setNotification] = useState('');


    const fetchDepartments = async () => {
        try {
            const nativeresponse = await axios.get('http://localhost:8000/native-departments/');
            const nativeDepts = nativeresponse.data;
            const helperresponse = await axios.get('http://localhost:8000/helper-departments/');
            const helperDepts = helperresponse.data;
            console.log(nativeDepts);
            console.log(helperDepts);
            setDepartments({
                native: nativeDepts,
                helper: helperDepts
            });
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchTargetGroups = async () => {
        try {
            const targetGroupsResponse = await axios.get('http://localhost:8000/target-groups_list/');
            const targetGroups = targetGroupsResponse.data;
            setTargetGroups(targetGroups);
        } catch (error) {
            console.error('Error fetching target groups:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Format the date and time fields
        const formattedData = {
            ...formData,
            // Ensure manager_student and manager_member are sent as IDs
            manager_student: formData.manager_student,
            manager_member: formData.manager_member,
            // Combine date and time fields
            start_time: formData.date && formData.start_time ? 
                `${formData.date}T${formData.start_time}:00Z` : null,
            end_time: formData.date && formData.end_time ? 
                `${formData.date}T${formData.end_time}:00Z` : null,
            // Other fields...
        };

        try {
            const response = await axios.post('http://localhost:8000/events/', formattedData);
            console.log('Event added:', response.data);

            setNotification("Etkinlik kaydedildi.");
            // Reset form
            setFormData({
                name: '',
                date: '',
                start_time: '',
                end_time: '',
                category: '',
                explanation: '',
                event_type: '',
                point: '',
                place: '',
                manager_student: null,
                manager_member: null,
                target_groups: '',
                native_departments: [],
                helper_departments: [],
                attendant_from_other: '',
                attendant_from_us: '',
            });
            
            setTimeout(() => {
                setNotification('');
            }, 3000);

        } catch (error) {
            console.error('There was an error adding the event:', error.response?.data);
            setNotification("Hata: " + (error.response?.data?.detail || "Etkinlik eklenirken bir hata oluştu"));
            setTimeout(() => {
                setNotification('');
            }, 5000);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/student_list/');
            setStudents(response.data);
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };

    const handleStudentSearch = (searchTerm) => {
        setStudentSearchTerm(searchTerm);
        if (!searchTerm.trim()) {
            setStudentSearchResults([]);
            return;
        }

        const filteredStudents = students
            .filter(student => 
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.tc_number.includes(searchTerm)
            )
            .slice(0, 5); // Only show top 5 results

        setStudentSearchResults(filteredStudents);
    };

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/members_list/');
            setMembers(response.data);
        } catch (error) {
            console.error("Failed to fetch members", error);
        }
    };

    const handleMemberSearch = (searchTerm) => {
        setMemberSearchTerm(searchTerm);
        if (!searchTerm.trim()) {
            setMemberSearchResults([]);
            return;
        }

        const filteredMembers = members
            .filter(member => 
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.tc_number.includes(searchTerm)
            )
            .slice(0, 5); // Only show top 5 results

        setMemberSearchResults(filteredMembers);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setIsStudentDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setIsMemberDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="header-container">
                <Header />
            </div>
            <div className="add-events-container">
                <div className="form-container">
                    <h2 className="form-title">Etkinlik Kayıt Formu</h2>
                    <form onSubmit={handleSubmit} className="add-event-form">
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

                        <div className="form-group">
                            <label htmlFor="event_type">Etkinlik Türü</label>
                            <input
                                id="event_type"
                                name="event_type"
                                type="text"
                                value={formData.event_type}
                                onChange={handleChange}
                                placeholder="Etkinlik Türü"
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
                            <label htmlFor="start_time">Başlangıç Saati</label>
                            <input
                                id="start_time"
                                name="start_time"
                                type="time"
                                value={formData.start_time}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end_time">Bitiş Saati</label>
                            <input
                                id="end_time"
                                name="end_time"
                                type="time"
                                value={formData.end_time}
                                onChange={handleChange}
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
                            <label htmlFor="manager_student">Öğrenci Yöneticisi</label>
                            <div className="dropdown-container">
                                <input
                                    id="manager_student"
                                    type="text"
                                    value={studentSearchTerm}
                                    onChange={(e) => {
                                        handleStudentSearch(e.target.value);
                                        setIsStudentDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsStudentDropdownOpen(true)}
                                    placeholder="Öğrenci ara..."
                                    className="dropdown-header"
                                />
                                {isStudentDropdownOpen && studentSearchResults.length > 0 && (
                                    <div className="dropdown-list">
                                        {studentSearchResults.map(student => (
                                            <div 
                                                key={student.id}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        manager_student: student.id
                                                    });
                                                    setStudentSearchTerm(student.name);
                                                    setIsStudentDropdownOpen(false);
                                                    setStudentSearchResults([]);
                                                }}
                                            >
                                                <span>{student.name}</span>
                                                <span className="student-info">
                                                    {student.tc_number}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="manager_member">Üye Yöneticisi</label>
                            <div className="dropdown-container">
                                <input
                                    id="manager_member"
                                    type="text"
                                    value={memberSearchTerm}
                                    onChange={(e) => {
                                        handleMemberSearch(e.target.value);
                                        setIsMemberDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsMemberDropdownOpen(true)}
                                    placeholder="Üye ara..."
                                    className="dropdown-header"
                                />
                                {isMemberDropdownOpen && memberSearchResults.length > 0 && (
                                    <div className="dropdown-list">
                                        {memberSearchResults.map(member => (
                                            <div 
                                                key={member.id}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        manager_member: member.id
                                                    });
                                                    setMemberSearchTerm(member.name);
                                                    setIsMemberDropdownOpen(false);
                                                    setMemberSearchResults([]);
                                                }}
                                            >
                                                <span>{member.name}</span>
                                                <span className="student-info">
                                                    {member.tc_number}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="target_groups">Hedef Gruplar</label>
                            <div className="dropdown-container">
                                <div 
                                    className="dropdown-header"
                                    onClick={() => setIsOpenTargetGroups(!isOpenTargetGroups)}
                                >
                                    {formData.target_groups.length > 0 
                                        ? `${formData.target_groups.length} hedef grup seçildi`
                                        : "Seçiniz"
                                    }
                                </div>
                            </div>
                            {isOpenTargetGroups && (
                                <div className="dropdown-list">
                                    {targetGroups.map(targetGroup => (
                                        <div 
                                            key={targetGroup.id} 
                                            className="dropdown-item"
                                            onClick={() => {
                                                const updatedGroups = formData.target_groups.includes(targetGroup.id)
                                                    ? formData.target_groups.filter(id => id !== targetGroup.id)
                                                    : [...formData.target_groups, targetGroup.id];
                                                setFormData({
                                                    ...formData,
                                                    target_groups: updatedGroups
                                                });
                                            }}
                                        >
                                            {targetGroup.name}
                                            {formData.target_groups.includes(targetGroup.id) && (
                                                <span className="checkmark">✓</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}  
                        </div>

                        <div className="form-group">
                            <label htmlFor="native_departments">Yerel Departmanlar</label>
                            <div className="dropdown-container">
                                <div 
                                    className="dropdown-header"
                                    onClick={() => setIsOpenNative(!isOpenNative)}
                                >
                                    {formData.native_departments.length > 0 
                                        ? `${formData.native_departments.length} departman seçildi`
                                        : "Seçiniz"
                                    }
                                </div>
                                {isOpenNative && (
                                    <div className="dropdown-list">
                                        {departments.native.map(dept => (
                                            <div 
                                                key={dept.id}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    const updatedDepts = formData.native_departments.includes(dept.id)
                                                        ? formData.native_departments.filter(id => id !== dept.id)
                                                        : [...formData.native_departments, dept.id];
                                                    setFormData({
                                                        ...formData,
                                                        native_departments: updatedDepts
                                                    });
                                                }}
                                            >
                                                <span>{dept.name}</span>
                                                {formData.native_departments.includes(dept.id) && (
                                                    <span className="checkmark">✓</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="helper_departments">Yardımcı Departmanlar</label>
                            <div className="dropdown-container">
                                <div 
                                    className="dropdown-header"
                                    onClick={() => setIsOpenHelper(!isOpenHelper)}
                                >
                                    {formData.helper_departments.length > 0 
                                        ? `${formData.helper_departments.length} departman seçildi`
                                        : "Seçiniz"
                                    }
                                </div>
                                {isOpenHelper && (
                                    <div className="dropdown-list">
                                        {departments.helper.map(dept => (
                                            <div 
                                                key={dept.id}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    const updatedDepts = formData.helper_departments.includes(dept.id)
                                                        ? formData.helper_departments.filter(id => id !== dept.id)
                                                        : [...formData.helper_departments, dept.id];
                                                    setFormData({
                                                        ...formData,
                                                        helper_departments: updatedDepts
                                                    });
                                                }}
                                            >
                                                <span>{dept.name}</span>
                                                {formData.helper_departments.includes(dept.id) && (
                                                    <span className="checkmark">✓</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="attendant_from_other">Diğer Katılımcılar</label>
                            <input
                                id="attendant_from_other"
                                name="attendant_from_other"
                                type="number"
                                value={formData.attendant_from_other}
                                onChange={handleChange}
                                placeholder="Diğer Katılımcılar"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="attendant_from_us">Bizden Katılımcılar</label>
                            <input
                                id="attendant_from_us"
                                name="attendant_from_us"
                                type="number"
                                value={formData.attendant_from_us}
                                onChange={handleChange}
                                placeholder="Bizden Katılımcılar"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="explanation">Açıklama</label>
                            <textarea
                                id="explanation"
                                name="explanation"
                                value={formData.explanation}
                                onChange={handleChange}
                                placeholder="Açıklama"
                            />
                        </div>

                        <div className="submit-button-container full-width">
                            <button type="submit">Etkinlik Ekle</button>
                        </div>
                    </form>
                    {notification && <div className="notification">{notification}</div>}
                </div>
            </div>
        </>
    );
};

export default AddEventForm;
