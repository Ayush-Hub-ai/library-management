import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function EditBook() {
  const [book, setBook] = useState({ title: '', author: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  // Define the API URL using an environment variable
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch the book's current data when the page loads
  useEffect(() => {
    const fetchBook = async () => {
      // The GET request for a single book is public, so no token is needed
      const response = await fetch(`${API_URL}/api/books/${id}`);
      const data = await response.json();
      setBook(data);
    };
    fetchBook();
  }, [id, API_URL]);

  // Function to send the updated data to the backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get the token from storage

    try {
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add the Authorization header to prove the user is an admin
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error('Failed to update book');
      }
      
      navigate('/dashboard');

    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  // Function to handle changes in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prevBook => ({
      ...prevBook,
      [name]: value
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Edit Book</h2>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Book Title"
              value={book.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={book.author}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Update Book</button>
        </form>
      </header>
    </div>
  );
}

export default EditBook;