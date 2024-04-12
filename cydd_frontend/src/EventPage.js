import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import './EventPage.css'; // Adjust the path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const EventPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [member, setMember] = useState(null);
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate(); // Use useNavigate here
    const event = location.state ? location.state.event : null;

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
            const response = await axios.get(`http://localhost:8000/members_list/?search=${searchTerm}`);
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
        <>
        <div className='event-details'>
            <h1>{event.name}</h1>
            <p>Date: {formatDate(event.date)}</p>
            <p>Points: {event.point}</p>
            <p>Location: {event.place}</p>
            {/* Add additional content and functionality */}
        </div>
        

        <div className='attendees-list'>
                <h2 className='attendee-list-name'>Katılımcılar</h2>
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
        
            <div>
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
        </>
    );
};

export default EventPage;
