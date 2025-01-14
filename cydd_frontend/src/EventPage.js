import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EventPage.css'; // Adjust the path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const EventPage = ({ event, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [member, setMember] = useState(null);
    const [error, setError] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (event) {
            fetchAttendees(event.id);
        }
    }, [event]);
    
    if (!event) {
        return <p>No event data!</p>;
    }

    const fetchMemberDetails = async (memberId) => {
        try {
            const response = await axios.get(`http://localhost:8000/memberslist/${memberId}/`);
            return response.data;  // Return the full member object
        } catch (error) {
            console.error("Error fetching member details:", error);
        }
    };
    
    const fetchAttendees = async (eventId) => {
        try {
            const response = await axios.get(`http://localhost:8000/events/${eventId}/attendees/`);
            const attendeesWithDetails = await Promise.all(response.data.map(async attendee => {
                const memberDetails = await fetchMemberDetails(attendee.member);
                return { ...attendee, member: memberDetails };  // Replace member ID with full member details
            }));
            setAttendees(attendeesWithDetails);
        } catch (error) {
            console.error("Error fetching attendees:", error);
        }
    };

    const searchMembers = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/student_list/?search=${searchTerm}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching members:", error);
        }
    };

    const addMemberToEvent = async (memberId) => {
        try {
            const data = { member: memberId, event: event.id, points_gained: event.point };
            const response = await axios.post('http://localhost:8000/add_attendance/', data);
            console.log("Response:", response.data);
            alert("Member added to event successfully.");
            fetchAttendees(event.id); // Refresh the list of attendees
        } catch (error) {
            console.error("Error adding member to event:", error.response ? error.response.data : "Error");
        }
    };

    const removeAttendee = async (memberId, eventId) => {
        try {
            await axios.delete(`http://localhost:8000/events/${eventId}/remove-attendee/${memberId}/`);
            alert("Member removed from event successfully.");
            fetchAttendees(eventId);  // Refresh the list of attendees
        } catch (error) {
            console.error("Error removing attendee:", error.response ? error.response.data : "Error");
        }
    };

    // Date formatting function
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options).replace(/\//g, '-');
    };

    return (
        <div className="event-page">
            <div className="event-details">
                <h1>{event.name}</h1>
                <div className="event-info">
                    <p><strong>Tarih:</strong> {formatDate(event.date)}</p>
                    <p><strong>Puan:</strong> {event.point}</p>
                    <p><strong>Mekan:</strong> {event.place}</p>
                </div>
                
                <button 
                    className="expand-button"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <span>Tüm Detaylar</span>
                    <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                </button>

                <div className={`expanded-details ${isExpanded ? 'expanded' : ''}`}>
                    <div className="details-grid">
                        <p><strong>Başlangıç Saati:</strong> {event.start_time}</p>
                        <p><strong>Bitiş Saati:</strong> {event.end_time}</p>
                        <p><strong>Kategori:</strong> {event.category}</p>
                        <p><strong>Etkinlik Tipi:</strong> {event.event_type}</p>
                        <p><strong>Öğrenci Yöneticisi:</strong> {event.manager_student}</p>
                        <p><strong>Üye Yöneticisi:</strong> {event.manager_member}</p>
                        <p><strong>Hedef Gruplar:</strong> {event.target_groups}</p>
                        <p><strong>Yerel Departmanlar:</strong> {event.native_departments.join(', ')}</p>
                        <p><strong>Yardımcı Departmanlar:</strong> {event.helper_departments.join(', ')}</p>
                        <p><strong>Diğer Katılımcılar:</strong> {event.attendant_from_other}</p>
                        <p><strong>Bizden Katılımcılar:</strong> {event.attendant_from_us}</p>
                    </div>
                    <div className="explanation-section">
                        <p><strong>Açıklama:</strong></p>
                        <p className="explanation-text">{event.explanation}</p>
                    </div>
                </div>
            </div>

            <div className="attendees-section">
                <h2>Katılımcılar</h2>
                <ul>
                    {attendees.map(attendee => (
                        <li className='member-info' key={attendee.id}>
                            {attendee.member ? `${attendee.member.name}` : "Loading..."}

                            <button className= "delete-member-button" onClick={() => removeAttendee(attendee.member.id, event.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="search-section">
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Eklenecek Katılımcı Ara" 
                />
                <button onClick={searchMembers}>Ara</button>
                <ul className='member-addition-list'>
                    {searchResults.map(member => (
                        <li className= "member-addition-list-elmt" key={member.id}>
                            <strong className='member-name'>{member.name}</strong>
                            <button className='add-to-event-button' onClick={() => addMemberToEvent(member.id)}>Etkinliğe Ekle</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EventPage;
