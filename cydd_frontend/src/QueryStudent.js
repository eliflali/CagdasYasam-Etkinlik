import React, { useState } from 'react';
import axios from 'axios';
import './QueryMember.css';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';

const QueryStudent= () => {
  const [searchParams, setSearchParams] = useState({ name: '', tc_number: '' });
  const [students, setStudents] = useState([]);
  const [editableStudentId, setEditableStudentId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Debounce timer to avoid excessive API calls
  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Trigger the search dynamically based on name or tc_number input
  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
    debouncedSearch();
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

  // Debounce search function
  const debouncedSearch = debounce(fetchStudents, 500);

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
      setEditableStudentId(null);
    } catch (error) {
      console.error("Failed to update member", error);
    }
  };

  return (
    <div className='page-container'>
      <div className="formContainer">
        <form className="form">
          <p>
            <label htmlFor="name">İsim Soyisim</label>
            <input type="text" name="name" placeholder="İsim Soyisim" value={searchParams.name} onChange={handleSearchChange} />
          </p>
          <p>
            <label htmlFor="tc_number">TC Numarası</label>
            <input type="text" name="tc_number" placeholder="TC Numarası" value={searchParams.tc_number} onChange={handleSearchChange} />
          </p>
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
                <th>Başlangıç Zamanı</th>
                <th>Bitiş Zamanı</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    {editableStudentId === student.id ? (
                      <>
                        <td><input type="text" name="name" value={editFormData.name} onChange={handleEditChange} /></td>
                        <td><input type="text" name="tc_number" value={editFormData.tc_number} onChange={handleEditChange} /></td>
                        <td><input type="number" name="total_volunteering_hours" value={editFormData.total_volunteering_hours} onChange={handleEditChange} /></td>
                        <td><input type="datetime-local" name="start_time" value={editFormData.start_time} onChange={handleEditChange} /></td>
                        <td><input type="datetime-local" name="end_time" value={editFormData.end_time} onChange={handleEditChange} /></td>
                      </>
                    ) : (
                      <>
                        <td>{student.name}</td>
                        <td>{student.tc_number}</td>
                        <td>{student.total_volunteering_hours}</td>
                        <td>{student.start_time}</td>
                        <td>{student.end_time}</td>
                      </>
                    )}
                    <td>
                      {editableStudentId === student.id ? (
                        <FaSave onClick={handleUpdate} />
                      ) : (
                        <>
                          <FaEdit onClick={() => handleEdit(student)} />
                          <FaTrash onClick={() => handleDelete(student.id)} />
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
    </div>
  );
};

export default QueryStudent;
