import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, isAuthenticated, hasRole, logout } = useAuth();  // ✅ Ajout de hasRole
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">GeeKingdom</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/categories">Catégories</Link>
        <Link to="/products">Produits</Link>
        <Link to="/points-retrait">Points Retrait</Link>
        
        <Link to="/cart" className="cart-link">
          🛒 Panier
          {getItemCount() > 0 && (
            <span className="cart-badge">{getItemCount()}</span>
          )}
        </Link>

        {isAuthenticated() ? (
          <>
            <Link to="/orders">Mes Commandes</Link>
            
            {/* ✅ BOUTON ADMIN - Affiché seulement si l'utilisateur est admin */}
            {hasRole('admin') && (
              <Link to="/admin" className="admin-link">
                👑 Admin
              </Link>
            )}
            
            <Link to="/profile">
              👤 {user?.prenom || user?.nom || 'Profil'}
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;