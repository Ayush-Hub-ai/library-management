import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function EditBook() {
  const [book, setBook] = useState({ title: '', author: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the book's current data when the page loads
  useEffect(() => {
    const fetchBook = async () => {
      const response = await fetch(`http://localhost:5000/api/books/${id}`);
      const data = await response.json();
      setBook(data);
    };
    fetchBook();
  }, [id]);

  // --- THIS IS THE NEW PART ---
  // Function to send the updated data to the backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'PUT', // Use the PUT method for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book), // Send the updated book state
      });

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      // On success, navigate back to the dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Error updating book:', error);
      // You could show an error message to the user here
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