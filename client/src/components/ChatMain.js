// ChatMain.js
import React, { useState } from 'react';
import ChatArea from "./ChatArea";
import ChatSidebar from "./ChatSidebar";
import UserProfileSidebar from "./UserProfileSidebar";
import { useUserSession } from '../components/UserSessionContext'; // Import the useUserSession hook

function ChatMain() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { userSession } = useUserSession(); // Access user session

  return (
    <main className="columns">
      {/* Pass userSession to UserProfileSidebar */}
      <UserProfileSidebar userSession={userSession} selectedUser={selectedUser} />
      <ChatArea selectedUser={selectedUser} />
      <ChatSidebar onUserSelect={setSelectedUser} />
    </main>
  );
}

export default ChatMain;
