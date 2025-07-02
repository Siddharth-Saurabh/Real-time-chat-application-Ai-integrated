import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load token from localStorage when app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token }); // you can decode it to get _id/email if needed
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
