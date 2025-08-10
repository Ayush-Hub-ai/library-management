import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author }),
      });

      if (!response.ok) {
        throw new Error('Failed to add book');
      }

      // On success, navigate back to the dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Error adding book:', error);
      // You could show an error message to the user here
    }
  };

  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default AddBook;