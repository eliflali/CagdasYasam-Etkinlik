import React, { useState } from 'react';
import axios from 'axios';
import logo from './assets/cydd_logo.jpg'
import './QueryMember.css'; // Import the CSS module here
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa'; // Import icons

const QueryMember = () => {
  const [searchParams, setSearchParams] = useState({});
  const [members, setMembers] = useState([]);
  const [editableMemberId, setEditableMemberId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (memberId) => {
    // Implement delete logic here
    console.log("Delete", memberId);
    try {
        await axios.delete(`http://localhost:8000/members/${memberId}/`);
        setMembers(members.filter(member => member.id !== memberId)); // Remove the member from the state
      } catch (error) {
        console.error("Failed to delete member", error);
      }
  };

  const handleEdit = (member) => {
    setEditableMemberId(member.id);
    setEditFormData(member);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  try {
    const response = await axios.put(`http://localhost:8000/members/${editableMemberId}/`, editFormData);
    const updatedMembers = members.map(member => {
      if (member.id === editableMemberId) return response.data; // Update with the response data
      return member;
    });
    setMembers(updatedMembers);
    setEditableMemberId(null); // Reset editable member ID
  } catch (error) {
    console.error("Failed to update member", error);
  }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await axios.get(`http://localhost:8000/members_list/?${queryString}`);
      setMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
        <div className='page-container'>
          <div className="header">
            <img src={logo} alt="Logo" width="100" />
            <h1>Çağdaş Yaşamı Destekleme Derneği Yenişehir</h1>
          </div>
          <div className="formContainer">
            <form onSubmit={handleSubmit} className="form">
                <p>
                <label htmlFor="name">İsim Soyisim</label>
              <input type="text" name="name" placeholder="İsim Soyisim" onChange={handleChange} /></p>
              <p>
              <label htmlFor="mission">Görevi</label>
              <input type="text" name="mission" placeholder="Görevi" onChange={handleChange} />
              </p>
              <p> 
            <label htmlFor="school">Okul</label>
              <input
                        id="school"
                        name="school"
                        type="text"
                        onChange={handleChange}
                        placeholder="Okul"
                    />
                </p>
                <p>
                <label htmlFor="department">Bölümü</label>
                <input
                        id="department"
                        name="department"
                        type="text"
                        onChange={handleChange}
                        placeholder="Bölümü"
                    />
                </p>
                <p>
                <label htmlFor="student_class">Sınıfı</label>
                <input
                        id="student_class"
                        name="student_class"
                        type="text"
                        onChange={handleChange}
                        placeholder="Sınıfı"
                    />
                </p>
                <p>
                <label htmlFor="group">Öbeği</label>
                <input
                        id="group"
                        name="group"
                        type="text"
                        onChange={handleChange}
                        placeholder="Öbeği"
                    />
                </p>
                <p>
                <label htmlFor="phone_number">Telefon Numarası</label>
                <input
                        id="phone_number"
                        name="phone_number"
                        type="text"
                        onChange={handleChange}
                        placeholder="Telefon Numarası"
                    />
                </p>
                <p>
                <label htmlFor="email">E-mail</label>
                <input
                        id="email"
                        name="email"
                        type="text"
                        onChange={handleChange}
                        placeholder="E-mail"
                    />
                </p>

                <p>
                <label htmlFor="points_collected">Topladığı Puan</label>
             <input
                        id="points_collected"
                        name="points_collected"
                        type="text"
                        onChange={handleChange}
                        placeholder="Topladığı Puan"
                    />
                </p>
                <p>
                <label htmlFor="tc_number">TC Numarası</label>
              <input type="text" name="tc_number" placeholder="TC Numarası" onChange={handleChange} />
              </p>
              <button type="submit">Ara</button>
            </form>
    
            <table className="membersTable">
        <thead>
          <tr>
            <th>İsim Soyisim</th>
            <th>Görevi</th>
            <th>Okul</th>
            <th>Bölümü</th>
            <th>Sınıfı</th>
            <th>Öbeği</th>
            <th>Telefon Numarası</th>
            <th>E-mail</th>
            <th>TC Numarası</th>
            <th>Aktif</th>
            <th>Topladığı Puan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              {/* Editable fields */}
              {editableMemberId === member.id ? (
                <>
                  <td><input type="text" name="name" value={editFormData.name} onChange={handleEditChange} /></td>
                  <td><input type="text" name="mission" value={editFormData.mission} onChange={handleEditChange} /></td>
                  <td><input type="text" name="school" value={editFormData.school} onChange={handleEditChange} /></td>
                  <td><input type="text" name="department" value={editFormData.department} onChange={handleEditChange} /></td>
                  <td><input type="text" name="student_class" value={editFormData.student_class} onChange={handleEditChange} /></td>
                  <td><input type="text" name="group" value={editFormData.group} onChange={handleEditChange} /></td>
                  <td><input type="text" name="phone_number" value={editFormData.phone_number} onChange={handleEditChange} /></td>
                  <td><input type="text" name="email" value={editFormData.email} onChange={handleEditChange} /></td>
                  <td><input type="checkbox" name="active" value={editFormData.active} onChange={handleEditChange} /></td>
                  <td><input type="text" name="tc_number" value={editFormData.tc_number} onChange={handleEditChange} /></td>
                  <td><input type="text" name="points_collected" value={editFormData.points_collected} onChange={handleEditChange} /></td>
                </>
              ) : (
                <>
                  <td>{member.name}</td>
                  <td>{member.mission}</td>
                  <td>{member.school}</td>
                  <td>{member.department}</td>
                  <td>{member.student_class}</td>
                  <td>{member.group}</td>
                  <td>{member.phone_number}</td>
                  <td>{member.email}</td>
                  <td>{member.tc_number}</td>
                  <td>{member.active}</td>
                  <td>{member.points_collected}</td>
                  {/* Display other member details */}
                </>
              )}
              <td>
                {editableMemberId === member.id ? (
                  <FaSave onClick={handleUpdate} />
                ) : (
                  <>
                    <FaEdit onClick={() => handleEdit(member)} />
                    <FaTrash onClick={() => handleDelete(member.id)} />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          </div>
        </div>
  );
};

export default QueryMember;
