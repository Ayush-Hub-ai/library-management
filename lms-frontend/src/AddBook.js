import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // 1. Get the token

    try {
      const response = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 2. Send the token
        },
        body: JSON.stringify({ title, author }),
      });

      if (!response.ok) {
        throw new Error('Failed to add book. You may not be authorized.');
      }
      
      navigate('/dashboard');

    } catch (error) {
      console.error('Error adding book:', error);
      alert(error.message); // Show an alert if it fails
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Add a New Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Book</button>
        </form>
      </div>
    </div>
  );
}

export default AddBook;