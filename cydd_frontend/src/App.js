import React from 'react';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import AddMember from './AddMember';
import QueryMember from './QueryMember';
import AddEventForm from './AddEvents';
import EventPage from './EventPage';
import QueryEvent from './QueryEvent';
import AddDepartmentForm from './AddDepartment';
import AddProjectForm from './AddProjects';
import AddMemberToDepartmentProjectForm from './AddMemberToProjects';
import AddTargetGroupForm from './AddTargetGroups';

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
        <Route path="/add-department" element={<AddDepartmentForm/>} />
        <Route path="/add-project" element={<AddProjectForm/>} />
        <Route path="/add-member-to-department-project" element={<AddMemberToDepartmentProjectForm/>} />
        <Route path="/add-target-group" element={<AddTargetGroupForm/>} />
      </Routes>
    </Router>
  );
}

export default App;
