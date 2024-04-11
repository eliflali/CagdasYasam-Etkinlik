import React, { useState } from 'react';
import axios from 'axios';

const EventPage = ({ eventId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const searchMembers = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/members_list/?${searchTerm}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching members:", error);
        }
    };

    const addMemberToEvent = async (memberId) => {
        try {
            const data = { member: memberId, event: eventId, points_gained: /* Define points */ 10 };
            await axios.post('http://localhost:8000/add_attendance/', data);
            alert("Member added to event successfully.");
        } catch (error) {
            console.error("Error adding member to event:", error);
        }
    };

    return (
        <div>
            <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search Members" 
            />
            <button onClick={searchMembers}>Search</button>
            <ul>
                {searchResults.map(member => (
                    <li key={member.id}>
                        {member.name}
                        <button onClick={() => addMemberToEvent(member.id)}>Add to Event</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventPage;
