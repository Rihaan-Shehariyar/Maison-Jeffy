import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load from localStorage if exists
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    
    setUser(userData);
    
    localStorage.setItem("user", JSON.stringify(userData)); // persist login
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // remove from storage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
