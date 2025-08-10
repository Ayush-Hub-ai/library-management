// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import EditBook from './EditBook';
import AddBook from './AddBook';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* The Dashboard is now a public route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* These routes are still protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/edit/:id" element={<EditBook />} />
          <Route path="/add-book" element={<AddBook />} />
        </Route>

        {/* Redirect any other path to the dashboard by default */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;