import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function IssueBook() {
  const [book, setBook] = useState(null);
  const [users, setUsers] = useState([]); // <-- FIX IS HERE
  const [selectedUserId, setSelectedUserId] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookAndUsers = async () => {
      try {
        const bookRes = await fetch(`${API_URL}/api/books/${id}`);
        const bookData = await bookRes.json();
        setBook(bookData);

        const usersRes = await fetch(`${API_URL}/api/users`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        // Ensure we always have an array
        if (Array.isArray(usersData)) {
            setUsers(usersData);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    
    fetchBookAndUsers();
  }, [id, API_URL, token]);

  const handleIssue = async (e) => {
    // ... your handleIssue logic
  };
  
  if (!book) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Issue Book</h2>
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        <form onSubmit={handleIssue}>
          <div className="form-group">
            <label htmlFor="user-select">Issue to:</label>
            <select 
              id="user-select"
              value={selectedUserId} 
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="">-- Select a User --</option>
              {/* This map function now safely runs on an array */}
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="issue-btn">Confirm Issue</button>
        </form>
      </div>
    </div>
  );
}

export default IssueBook;