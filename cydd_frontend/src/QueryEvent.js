import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './QueryEvent.css';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import EventPage from './EventPage';
const QueryEvent = () => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    date: '',
    point: '',
    place: ''
  });
  const [events, setEvents] = useState([]);
  const [editableEventId, setEditableEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch all events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

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

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await axios.get(`http://localhost:8000/events_list/?${queryString}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
    console.log("events",events);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:8000/events/${eventId}/`);
        setEvents(events.filter(event => event.id !== eventId));
      } catch (error) {
        console.error("Failed to delete event", error);
      }
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
        if (event.id === editableEventId) return response.data;
        return event;
      });
      setEvents(updatedEvents);
      setEditableEventId(null);
    } catch (error) {
      console.error("Failed to update event", error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="search-form-container">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Etkinlik İsmi</label>
                <input 
                  type="text" 
                  id="name"
                  name="name" 
                  value={searchParams.name}
                  onChange={handleChange} 
                  placeholder="Etkinlik İsmi"
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Tarihi</label>
                <input 
                  type="date" 
                  id="date"
                  name="date" 
                  value={searchParams.date}
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="point">Puanı</label>
                <input 
                  type="number" 
                  id="point"
                  name="point" 
                  value={searchParams.point}
                  onChange={handleChange} 
                  placeholder="Puanı"
                />
              </div>
              <div className="form-group">
                <label htmlFor="place">Mekan</label>
                <input 
                  type="text" 
                  id="place"
                  name="place" 
                  value={searchParams.place}
                  onChange={handleChange} 
                  placeholder="Mekan"
                />
              </div>
            </div>
            <button type="submit">Ara</button>
          </form>
        </div>

        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : (
          <div className="table-container">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Etkinlik İsmi</th>
                  <th>Tarihi</th>
                  <th>Puanı</th>
                  <th>Mekan</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr 
                    key={event.id} 
                    onClick={() => !editableEventId && handleEventClick(event)}
                    className={editableEventId ? '' : 'clickable-row'}
                  >
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
                    <td className="action-buttons">
                      {editableEventId === event.id ? (
                        <FaSave className="action-icon save" onClick={handleUpdate} title="Kaydet" />
                      ) : (
                        <>
                          <FaEdit 
                            className="action-icon edit" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(event);
                            }} 
                            title="Düzenle" 
                          />
                          <FaTrash 
                            className="action-icon delete" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(event.id);
                            }} 
                            title="Sil" 
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <EventPage event={selectedEvent} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default QueryEvent;
