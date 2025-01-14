import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QueryMember.css';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import Header from './Header';

const QueryMember = () => {
  const [searchParams, setSearchParams] = useState({ name: '', tc_number: '' });
  const [members, setMembers] = useState([]);
  const [editableMemberId, setEditableMemberId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Trigger the search dynamically based on name or tc_number input
  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  // Search members with the current search params
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await axios.get(`http://localhost:8000/members_list/?${queryString}`);
      setMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all members when component mounts
  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (memberId) => {
    try {
      await axios.delete(`http://localhost:8000/members/${memberId}/`);
      setMembers(members.filter(member => member.id !== memberId));
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

  return (
    <>
        <div className="header-container">
            <Header />
        </div>
        <div className="page-container">
            <div className="formContainer">
                <form className="form" style={{backgroundColor: 'white'}} onSubmit={(e) => {
                    e.preventDefault();
                    fetchMembers();
                }}>
                    <p>
                        <label htmlFor="name">İsim Soyisim</label>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="İsim Soyisim" 
                            value={searchParams.name} 
                            onChange={handleSearchChange} 
                        />
                    </p>
                    <p>
                        <label htmlFor="tc_number">TC Numarası</label>
                        <input 
                            type="text" 
                            name="tc_number" 
                            placeholder="TC Numarası" 
                            value={searchParams.tc_number} 
                            onChange={handleSearchChange} 
                        />
                    </p>
                    <button type="submit">Üye Ara</button>
                </form>

                {loading ? (
                    <div className="loading-state">Yükleniyor...</div>
                ) : (
                    <table className="membersTable">
                        <thead>
                            <tr>
                                <th>İsim Soyisim</th>
                                <th>TC Numarası</th>
                                <th>Toplam Gönüllü Saat</th>
                                <th>Başlangıç Zamanı</th>
                                <th>Bitiş Zamanı</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.length > 0 ? (
                                members.map((member) => (
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
                                        <td className="action-icons">
                                            {editableMemberId === member.id ? (
                                                <FaSave className="save-icon" onClick={handleUpdate} />
                                            ) : (
                                                <>
                                                    <FaEdit className="edit-icon" onClick={() => handleEdit(member)} />
                                                    <FaTrash className="delete-icon" onClick={() => handleDelete(member.id)} />
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-state">Üye bulunamadı</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    </>
  );
};

export default QueryMember;
