import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // <-- 1. Import jwt-decode
import './App.css';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({}); // <-- 2. State to hold user info
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token); // Decode the token
        setUser(decodedUser.user); // Set user info from the token
        fetchBooks();
      } catch (err) {
        console.error("Invalid token:", err);
        navigate('/login'); // If token is bad, redirect to login
      }
    } else {
      navigate('/login'); // If no token, redirect to login
    }
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/books');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          // 3. Send the token for protected routes
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete book');
      }
      // Refresh the book list after deleting
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      alert(`Error: ${error.message}`); // Show error to admin
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Library Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>

        {/* 4. Only show admin buttons if the user's role is 'admin' */}
        {user.role === 'admin' && (
          <div className="dashboard-actions">
            <Link to="/add-book">
              <button className="add-btn">Add New Book</button>
            </Link>
          </div>
        )}

        <p>Welcome! Here are the books available in the library.</p>

        <div className="book-list">
          {loading && <p>Loading books...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  {/* Only show Actions column for admins */}
                  {user.role === 'admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    {/* Only show action buttons for admins */}
                    {user.role === 'admin' && (
                      <td className="actions-cell">
                        <Link to={`/edit/${book._id}`}>
                          <button className="edit-btn">Edit</button>
                        </Link>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </header>
    </div>
  );
}

export default Dashboard;