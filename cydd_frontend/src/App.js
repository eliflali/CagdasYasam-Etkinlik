import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import AddMember from './AddMember';
import QueryMember from './QueryMember';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/add_member" element={<AddMember />} />
        <Route path="/query_member" element={<QueryMember />} />
      </Routes>
    </Router>
  );
}

export default App;
