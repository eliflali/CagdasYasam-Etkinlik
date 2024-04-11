import React from 'react';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import AddMember from './AddMember';
import QueryMember from './QueryMember';
import AddEventForm from './AddEvents';
import EventPage from './EventPage';
import QueryEvent from './QueryEvent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/add_member" element={<AddMember />} />
        <Route path="/query_member" element={<QueryMember />} />
        <Route path="/add_event" element={<AddEventForm />} />
        <Route path="/query_event" element={<QueryEvent />} />
        <Route path="/events/:eventId" element={<EventPage />} />
      </Routes>
    </Router>
  );
}

export default App;
