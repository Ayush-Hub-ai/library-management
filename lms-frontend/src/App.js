import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import EditBook from './EditBook';
import AddBook from './AddBook';
import ProtectedRoute from './ProtectedRoute';
import IssueBook from './IssueBook';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/edit/:id" element={<EditBook />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/issue/:id" element={<IssueBook />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;