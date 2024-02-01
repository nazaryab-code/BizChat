import React, { useEffect, useState, useRef } from 'react';
import socket from '../Socket';
import img from '../styles/user1.png';

function UserList({ onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [userEmails, setUserEmails] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    function onGetOnlineUser(onlineUsers) {
      setUsers(onlineUsers);
    }

    function onNewUser(newUser) {
      setUsers((prevUsers) => [...prevUsers, newUser]);
    }

    function onUserId(receivedUserId) {
      console.log('Received userId:', users);
      console.log('Current userId:', selectedUser);

      if (receivedUserId !== userIdRef.current) {
        console.log('Updating userId to:', receivedUserId);
        userIdRef.current = receivedUserId;

        // Automatically fetch user info when userId is received
        fetchUserInfo(receivedUserId);
        // Fetch user info by name when userId is received
        fetchUserInfoByName(selectedUser);
      } else {
        console.log('Received the same userId, not updating.');
      }
    }

    const storedUserSession = JSON.parse(sessionStorage.getItem('userSession'));
    if (storedUserSession) {
      // Set the userIdRef.current here
      userIdRef.current = storedUserSession.id;

      // Automatically fetch user info when userId is already available
      fetchUserInfo(userIdRef.current);
      // Fetch user info by name when userId is already available
      fetchUserInfoByName(selectedUser);
    }

    socket.on('get online user', onGetOnlineUser);
    socket.on('new user', onNewUser);
    socket.on('userId', onUserId);

    return () => {
      socket.off('get online user', onGetOnlineUser);
      socket.off('new user', onNewUser);
      socket.off('userId', onUserId);
    };
  }, [selectedUser, users]); // Add selectedUser as a dependency to useEffect

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch('http://192.168.1.50:1234/api/getUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json();
      // Use userData as needed, e.g., display user details
      console.log('User Information:', userData);

      // Set the email in the state
      setUserEmails((prevEmails) => ({
        ...prevEmails,
        [userId]: userData.email,
      }));
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  const fetchUserInfoByName = async (userName) => {
    try {
      const userInfoResponse = await fetch('http://192.168.1.50:1234/api/getUserInfoByName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ full_name: userName }),
      });

      if (!userInfoResponse.ok) {
        throw new Error(`HTTP error! Status: ${userInfoResponse.status}`);
      }

      const userInfo = await userInfoResponse.json();
      // Use userInfo as needed, e.g., display user details
      console.log('User Information by Name:', userInfo);

      // Set the email in the state
      setUserEmails((prevEmails) => ({
        ...prevEmails,
        [userName]: userInfo.email,
      }));
    } catch (error) {
      console.error('Error fetching user information by name:', error);
    }
  };

  const handleSelectUser = async (user) => {
    console.log('Selected user:', user);

    setSelectedUser(user);
    onUserSelect(user);

    if (!userIdRef.current) {
      console.error('User ID is not available.');
      return;
    }

    const userIdInt = parseInt(userIdRef.current, 10); // Convert to integer

    // Fetch user info when user is selected
    fetchUserInfo(userIdInt);
    // Fetch user info by name when user is selected
    fetchUserInfoByName(user);
  };

  return (
    <div id="activeUsersList" className="scrollable-content">
      <h2 className="has-text-centered is-size-6 is-marginless is-paddingless">
        Online <span>({users.length})</span>
      </h2>
      <ul className="user-list">
        {users.map((user, index) => (
          <li key={index}>
            <div
              className={`user-card ${selectedUser === user ? 'active' : ''}`}
              onClick={() => handleSelectUser(user)}
            >
              <img className="user-image" src={img} alt="User" />
              <div className="user-info">
                <p className="user-name">{user}</p>
                {userEmails[user] && (
                  <p className="user-message tool1">
                    <i className="fa fa-envelope" aria-hidden="true"></i> {userEmails[user]}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
