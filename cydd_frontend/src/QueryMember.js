import React, { useState } from 'react';
import axios from 'axios';
import logo from './assets/cydd_logo.jpg';
import './QueryMember.css';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';

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
        if (member.id === editableMemberId) return response.data;
        return member;
      });
      setMembers(updatedMembers);
      setEditableMemberId(null);
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
            <input type="text" name="name" placeholder="İsim Soyisim" onChange={handleChange} />
          </p>
          <p>
            <label htmlFor="tc_number">TC Numarası</label>
            <input type="text" name="tc_number" placeholder="TC Numarası" onChange={handleChange} />
          </p>
          <p>
            <label htmlFor="total_volunteering_hours">Toplam Gönüllü Saat</label>
            <input type="number" name="total_volunteering_hours" placeholder="Toplam Gönüllü Saat" onChange={handleChange} />
          </p>
          <p>
            <label htmlFor="start_time">Başlangıç Zamanı</label>
            <input type="datetime-local" name="start_time" onChange={handleChange} />
          </p>
          <p>
            <label htmlFor="end_time">Bitiş Zamanı</label>
            <input type="datetime-local" name="end_time" onChange={handleChange} />
          </p>
          <button type="submit">Ara</button>
        </form>

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
            {members.map((member) => (
              <tr key={member.id}>
                {editableMemberId === member.id ? (
                  <>
                    <td><input type="text" name="name" value={editFormData.name} onChange={handleEditChange} /></td>
                    <td><input type="text" name="tc_number" value={editFormData.tc_number} onChange={handleEditChange} /></td>
                    <td><input type="number" name="total_volunteering_hours" value={editFormData.total_volunteering_hours} onChange={handleEditChange} /></td>
                    <td><input type="datetime-local" name="start_time" value={editFormData.start_time} onChange={handleEditChange} /></td>
                    <td><input type="datetime-local" name="end_time" value={editFormData.end_time} onChange={handleEditChange} /></td>
                  </>
                ) : (
                  <>
                    <td>{member.name}</td>
                    <td>{member.tc_number}</td>
                    <td>{member.total_volunteering_hours}</td>
                    <td>{member.start_time}</td>
                    <td>{member.end_time}</td>
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
