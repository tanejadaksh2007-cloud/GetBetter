import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('veteran_user');
    return saved
      ? JSON.parse(saved)
      : {
          puuid: 'ply-001',
          gameName: 'ViperMain24',
          tagLine: 'NA1',
          role: 'Controller',
          type: 'coach',
          optedIn: true
        };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('veteran_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('veteran_user');
    }
  }, [user]);

  const login = (mockUserData) => {
    setUser(mockUserData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
