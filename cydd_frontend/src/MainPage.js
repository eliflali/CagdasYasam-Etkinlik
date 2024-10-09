import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import { FaTrash, FaEdit, FaSave, FaRegEye } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainPage = () => {
  const [events, setEvents] = useState([]);
  const [editableEventId, setEditableEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents(); // Load events when the component mounts
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/events_list/`);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (event) => {
    setEditableEventId(event.id);
    setEditFormData(event);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/events/${editableEventId}/`, editFormData);
      const updatedEvents = events.map(event => {
        if (event.id === editableEventId) return response.data;
        return event;
      });
      setEvents(updatedEvents);
      setEditableEventId(null);
    } catch (error) {
      console.error("Failed to update event", error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:8000/events/${eventId}/`);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };

  const handleNavigateToEvent = (event) => {
    navigate(`/events/${event.id}`, { state: { event } });
  };

  return (
    <>
      <div>
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
    </>
  );
};

export default MainPage;
