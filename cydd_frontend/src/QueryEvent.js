import React, { useState } from 'react';
import axios from 'axios';
import logo from './assets/cydd_logo.jpg'
import './QueryEvent.css'; // Import the CSS module here
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaSave, FaRegEye } from 'react-icons/fa'; // Import icons

const QueryEvent = () => {
  const [searchParams, setSearchParams] = useState({});
  const [events, setEvents] = useState([]);
  const [editableEventId, setEditableEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  // Other state setup
  const navigate = useNavigate();

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

  const handleDelete = async (eventId) => {
    // Implement delete logic here
    console.log("Delete", eventId);
    try {
        await axios.delete(`http://localhost:8000/events/${eventId}/`);
        setEvents(events.filter(event => event.id !== eventId)); // Remove the member from the state
      } catch (error) {
        console.error("Failed to delete event", error);
      }
  };

  const handleEdit = (event) => {
    setEditableEventId(event.id);
    setEditFormData(event);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  try {
    const response = await axios.put(`http://localhost:8000/events/${editableEventId}/`, editFormData);
    const updatedEvents = events.map(event => {
      if (event.id === editableEventId) return response.data; // Update with the response data
      return event;
    });
    setEvents(updatedEvents);
    setEditableEventId(null); // Reset editable member ID
  } catch (error) {
    console.error("Failed to update event", error);
  }
  };
  const handleNavigateToEvent = (event) => {
    //window.location.href = `/events/${eventId}`; // Navigate to event page
    // Correct way to navigate with state in React Router v6
    navigate(`/events/${event.id}`, { state: { event } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await axios.get(`http://localhost:8000/events_list/?${queryString}`);
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
        <div className='page_container'>
          <div className="formContainer">
            <form onSubmit={handleSubmit} className="form">
                <p>
                <label htmlFor="name">Etkinlik İsmi</label>
              <input type="text" name="name" placeholder="Etkinlik İsmi" onChange={handleChange} /></p>
              <p>
              <label htmlFor="date">Tarihi</label>
              <input type="date" name="date" placeholder="Tarihi" onChange={handleChange} />
              </p>
              <p> 
            <label htmlFor="point">Puanı</label>
              <input
                        id="point"
                        name="point"
                        type="number"
                        onChange={handleChange}
                        placeholder="Puanı"
                    />
                </p>
                <p>
                <label htmlFor="place">Mekan</label>
                <input
                        id="place"
                        name="place"
                        type="text"
                        onChange={handleChange}
                        placeholder="Mekan"
                    />
                </p>
              <button type="submit">Ara</button>
            </form>
    
            <table className="eventsTable">
        <thead>
          <tr>
            <th>Etkinlik İsmi</th>
            <th>Tarihi</th>
            <th>Puanı</th>
            <th>Mekan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              {/* Editable fields */}
              {editableEventId === event.id ? (
                <>
                  <td><input type="text" name="name" value={editFormData.name} onChange={handleEditChange} /></td>
                  <td><input type="date" name="date" value={editFormData.date} onChange={handleEditChange} /></td>
                  <td><input type="number" name="point" value={editFormData.point} onChange={handleEditChange} /></td>
                  <td><input type="text" name="place" value={editFormData.place} onChange={handleEditChange} /></td>
                </>
              ) : (
                <>
                  <td>{event.name}</td>
                  <td>{event.date}</td>
                  <td>{event.point}</td>
                  <td>{event.place}</td>
                  {/* Display other member details */}
                </>
              )}
              <td>
                {editableEventId === event.id ? (
                  <FaSave onClick={handleUpdate} />
                ) : (
                  <>
                    <FaEdit onClick={() => handleEdit(event)} />
                    <FaTrash onClick={() => handleDelete(event.id)} />
                    <FaRegEye onClick={() => handleNavigateToEvent(event)} /> {/* View icon */}
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

export default QueryEvent;
