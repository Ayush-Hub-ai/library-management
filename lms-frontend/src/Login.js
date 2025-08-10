import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // --- THIS IS THE NEW PART ---
      // On success, save the token to the browser's local storage
      localStorage.setItem('token', data.token);

      // Then, navigate to the dashboard
      navigate('/dashboard');

    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Library Management Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
      </header>
    </div>
  );
}

export default Login;