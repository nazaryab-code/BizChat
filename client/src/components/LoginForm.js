import React, { useState, useEffect } from 'react';
import socket from '../Socket';
import '../styles/loginForm.css';

function LoginForm({ setLogin, setUserName, setUserSession }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(null);

  useEffect(() => {
    return () => {
      // Cleanup function to handle unmounting
      setLoginMessage(null); // Reset login message on component unmount
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://192.168.1.50:1234/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userSession = await response.json();

        // Store user information in session storage
        sessionStorage.setItem('userSession', JSON.stringify(userSession));

        setUserSession(userSession);

        // Assuming the structure of the userSession matches the provided reference data
        const {
          id,
          full_name,
          // Other properties if needed
        } = userSession;

        setLogin(true);
        setUserName(full_name);
        socket.emit('login', full_name);
        socket.emit('loginId', id);
        console.log('Emitted loginId:', id);

        // Additional actions after a successful login if needed
      } else {
        const errorData = await response.json();
        setLoginMessage(errorData.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginMessage(`Internal Server Error: ${error.message}`);
    }
  };

  return (
    <div className="column is-half is-offset-one-quarter">
      <form onSubmit={handleLogin}>
        <div className="field">
          <div className="control">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              type="text"
              placeholder="Username"
              required
            />
          </div>
        </div>

        <div className="field">
          <div className="control">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              type="password"
              placeholder="Password"
              required
            />
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit">
              Login
            </button>
          </div>
        </div>

        <p className={`help is-danger ${loginMessage ? '' : 'is-hidden'}`}>{loginMessage}</p>
      </form>
    </div>
  );
}

export default LoginForm;
