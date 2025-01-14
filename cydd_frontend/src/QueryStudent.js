import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QueryMember.css';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import Header from './Header';
import StudentProfilePage from './StudentProfilePage';

const QueryStudent = () => {
  const [searchParams, setSearchParams] = useState({ name: '', tc_number: '' });
  const [students, setStudents] = useState([]);
  const [editableStudentId, setEditableStudentId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);


  // Trigger the search dynamically based on name or tc_number input
  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  // Search members with the current search params
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await axios.get(`http://localhost:8000/student_list/?${queryString}`);
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all students when component mounts
  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array means this runs once on mount

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`http://localhost:8000/students/${studentId}/`);
      setStudents(students.filter(student => student.id !== studentId));
      // Clear selected student if deleted student was selected
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Failed to delete member", error);
    }
  };

  const handleEdit = (student) => {
    setEditableStudentId(student.id);
    setEditFormData(student);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/students/${editableStudentId}/`, editFormData);
      const updatedStudents = students.map(student => {
        if (student.id === editableStudentId) return response.data;
        return student;
      });
      setStudents(updatedStudents);
      // Update selected student if it was the one being edited
      if (selectedStudent && selectedStudent.id === editableStudentId) {
        setSelectedStudent(response.data);
      }
      setEditableStudentId(null);
    } catch (error) {
      console.error("Failed to update member", error);
    }
  };

  const handleRowClick = (student) => {
    if (student && student.id) {
      setSelectedStudent(student);
    }
  };

  return (
    <>
      <div className="header-container">
        <Header />
      </div>
      <div className="page-container">
        <div className="formContainer">
          <form className="form" style={{ backgroundColor: '#f0f0f0' }} onSubmit={(e) => {
            e.preventDefault();
            fetchStudents();
          }}>
            <p>
              <label htmlFor="name">İsim Soyisim</label>
              <input type="text" name="name" placeholder="İsim Soyisim" value={searchParams.name} onChange={handleSearchChange} />
            </p>
            <p>
              <label htmlFor="tc_number">TC Numarası</label>
              <input type="text" name="tc_number" placeholder="TC Numarası" value={searchParams.tc_number} onChange={handleSearchChange} />
            </p>
            <button type="submit">Öğrenci Ara</button>
          </form>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="membersTable">
              <thead>
                <tr>
                  <th>İsim Soyisim</th>
                  <th>TC Numarası</th>
                  <th>Toplam Gönüllü Saat</th>
                  <th>Birim</th>
                  <th>Görev</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id} style={{ cursor: 'pointer' }}>
                      {editableStudentId === student.id ? (
                        <>
                          <td><input type="text" name="name" value={editFormData.name} onChange={handleEditChange} /></td>
                          <td><input type="text" name="tc_number" value={editFormData.tc_number} onChange={handleEditChange} /></td>
                          <td><input type="number" name="total_volunteering_hours" value={editFormData.total_volunteering_hours} onChange={handleEditChange} /></td>
                          <td><input type="text" name="group" value={editFormData.group} onChange={handleEditChange} /></td>
                          <td><input type="text" name="mission" value={editFormData.mission} onChange={handleEditChange} /></td>
                        </>
                      ) : (
                        < >
                          <td onClick={() => handleRowClick(student)}>{student.name}</td>
                          <td onClick={() => handleRowClick(student)}>{student.tc_number}</td>
                          <td onClick={() => handleRowClick(student)}>{student.total_volunteering_hours}</td>
                          <td onClick={() => handleRowClick(student)}>{student.group}</td>
                          <td onClick={() => handleRowClick(student)}>{student.mission}</td>
                        </>
                      )}
                      <td className="action-icons">
                        {editableStudentId === student.id ? (
                          <FaSave onClick={handleUpdate} style={{ color: '#48bb78' }} />
                        ) : (
                          <>
                            <FaEdit onClick={() => handleEdit(student)} style={{ color: '#4299e1' }} />
                            <FaTrash onClick={() => handleDelete(student.id)} style={{ color: '#f56565' }} />
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No members found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {selectedStudent && (
          <StudentProfilePage 
            student={selectedStudent} 
            onClose={() => setSelectedStudent(null)} 
          />
        )}
      </div>
    </>
  );
};

export default QueryStudent;
