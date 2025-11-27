import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Connexion
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const { token: newToken, user: userData } = response;
      
      // Sauvegarder dans le state et localStorage
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Déconnexion
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Mettre à jour le profil
  const updateProfile = async (userData) => {
    try {
      if (!user) throw new Error('Non connecté');
      
      const response = await authAPI.updateProfile(user.id, userData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Mettre à jour le state et localStorage
      const updatedUser = { ...user, ...response };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Vérifier le rôle de l'utilisateur
  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};