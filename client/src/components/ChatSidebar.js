// ChatSidebar.js
import React from 'react';
import UserList from './UserList';
import { useUserSession } from '../components/UserSessionContext'; // Import the useUserSession hook

function ChatSidebar({ onUserSelect }) {
  const { userSession } = useUserSession(); // Access user session

  return (
    <aside className="column is-2 is-hidden-mobile has-background-light has-text-black">
      {/* Pass userSession to UserList */}
      <UserList onUserSelect={onUserSelect} userSession={userSession} />
    </aside>
  );
}

export default ChatSidebar;
