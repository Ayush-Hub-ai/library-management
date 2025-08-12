import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function IssueBook() {
  const [book, setBook] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true); // Spinner state
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
        if (Array.isArray(usersData)) {
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false); // Stop spinner after data load
      }
    };

    fetchBookAndUsers();
  }, [id, API_URL, token]);

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      return alert('Please select a user to issue the book to.');
    }
    try {
      const response = await fetch(`${API_URL}/api/books/${id}/issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: selectedUserId }),
      });

      if (!response.ok) {
        throw new Error('Failed to issue book');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error issuing book:', error);
      alert('Failed to issue book.');
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '50px' }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

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
              style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            >
              <option value="">-- Select a User --</option>
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
