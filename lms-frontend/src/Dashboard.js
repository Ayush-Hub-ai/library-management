import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // 2. Wrap fetchBooks in useCallback to prevent re-creation on every render
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/books`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]); // useCallback dependency array

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser.user);
        fetchBooks();
      } catch (err) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, fetchBooks]); // 3. Add fetchBooks to the dependency array

  const handleDelete = async (bookId) => {
    const token = localStorage.getItem('token');
    try {
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