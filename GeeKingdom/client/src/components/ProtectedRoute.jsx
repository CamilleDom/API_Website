import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader message="Vérification de l'authentification..." />;
  }

  if (!isAuthenticated()) {
    // Rediriger vers login en sauvegardant la destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // L'utilisateur n'a pas le rôle requis
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;