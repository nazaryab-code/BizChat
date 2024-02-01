// UserProfileSidebar.js
import React from 'react';
import UserProfile from './UserProfile';

const UserProfileSidebar = ({ selectedUser }) => {
  return (
    <aside className="column is-3 is-hidden-mobile has-background-light has-text-black">
      {selectedUser && <UserProfile user={selectedUser} />}
    </aside>
  );
};

export default UserProfileSidebar;
