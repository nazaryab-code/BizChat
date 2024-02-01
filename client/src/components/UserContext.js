// UserContext.js
import React from 'react';
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setUserInfo = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
