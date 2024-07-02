"use client";
import { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = async (username, password) => {
    const response = await axios.post("http://localhost:5000/api/users/login", {
      username,
      password,
    });
    setToken(response.data.token);
  };

  const register = async (username, password) => {
    await axios.post("http://localhost:5000/api/users/register", {
      username,
      password,
    });
  };

  return (
    <AuthContext.Provider value={{ token, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
