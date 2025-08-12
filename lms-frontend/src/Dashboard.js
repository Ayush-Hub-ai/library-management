import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';

// Import your images
import girlImage from './assets/girl-in-library.png';
import boyImage from './assets/boy-in-library.png';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null); // Initialize user as null
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchBooks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/books`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }, [API_URL]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser.user);
      } catch (error) {
        console.error("Invalid Token:", error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    fetchBooks();
  }, [navigate, fetchBooks]);
  
  const handleReturn = async (bookId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/books/${bookId}/return`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchBooks(); // Refresh the list
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };
  
  const handleDelete = async (bookId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/books/${bookId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="page-container">
      <h1>Library Dashboard</h1>
      {user ? (
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      ) : (
        <Link to="/login"><button className="login-btn">Login as Admin</button></Link>
      )}
      
      {user && user.role === 'admin' && (
        <div className="dashboard-actions">
          <Link to="/add-book"><button className="add-btn">Add New Book</button></Link>
        </div>
      )}
      
      <div className="dashboard-images">
        <img src={girlImage} alt="Girl choosing a book from a library shelf" />
        <img src={boyImage} alt="Boy choosing a book from a library shelf" />
      </div>

      <div className="book-list">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Borrowed By</th>
              {user && user.role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td style={{ color: book.status === 'Issued' ? '#ff9800' : '#4CAF50' }}>
                  {book.status}
                </td>
                <td>{book.borrowedBy ? book.borrowedBy.name : '---'}</td>
                {user && user.role === 'admin' && (
                  <td className="actions-cell">
                    {book.status === 'Available' ? (
                      // UPDATED: This is now a link to the new IssueBook page
                      <Link to={`/issue/${book._id}`}>
                        <button className="issue-btn">Issue</button>
                      </Link>
                    ) : (
                      <button onClick={() => handleReturn(book._id)} className="return-btn">Return</button>
                    )}
                    <Link to={`/edit/${book._id}`}><button className="edit-btn">Edit</button></Link>
                    <button onClick={() => handleDelete(book._id)} className="delete-btn">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;