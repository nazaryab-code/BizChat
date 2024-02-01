// UserSessionContext.js
import React, { createContext, useContext, useState } from 'react';

const UserSessionContext = createContext();

export const UserSessionProvider = ({ children }) => {
  const [userSession, setUserSession] = useState({
    id: null,
    username: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    project: '',
    invoice: '',
    deadline: '',
    budget: '',
    session_id: '',
    status: 0,
  });

  return (
    <UserSessionContext.Provider value={{ userSession, setUserSession }}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => {
  return useContext(UserSessionContext);
};
