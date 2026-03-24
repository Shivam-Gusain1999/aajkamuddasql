import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../assets/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load current user from backend on app start using stored token
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await api.get('/users/current-user');
          setCurrentUser(data.data); // data returned from api
        } catch (err) {
          console.error("Failed to load user session", err);
          localStorage.removeItem('accessToken');
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/users/login', credentials);
    // API returns { data: { user: {...}, accessToken: "..." } }
    localStorage.setItem('accessToken', data.data.accessToken);
    setCurrentUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
    } catch(err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem('accessToken');
      setCurrentUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);