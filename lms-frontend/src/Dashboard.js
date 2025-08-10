import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // 1. Define the API URL using an environment variable
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser.user);
        fetchBooks();
      } catch (err) {
        console.error("Invalid token:", err);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // 2. Use the API_URL variable here
      const response = await fetch(`${API_URL}/api/books`);
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
      // 3. And also use the API_URL variable here
      const response = await fetch(`${API_URL}/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete book');
      }
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      alert(`Error: ${error.message}`);
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
                  {user.role === 'admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
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