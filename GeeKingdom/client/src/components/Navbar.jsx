import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
    const { user, isAuthenticated, hasRole, logout } = useAuth();
    const { getItemCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/" className="brand-link">
                    {/* Logo SVG inline pour une meilleure compatibilité */}
                    <svg
                        className="brand-logo"
                        viewBox="0 0 40 40"
                        width="40"
                        height="40"
                        aria-hidden="true"
                    >
                        {/* Couronne stylisée */}
                        <defs>
                            <linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="50%" stopColor="#7c3aed" />
                                <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M5 28L8 12L14 20L20 8L26 20L32 12L35 28H5Z"
                            fill="url(#crownGradient)"
                        />
                        <circle cx="8" cy="11" r="3" fill="url(#crownGradient)" />
                        <circle cx="20" cy="6" r="3" fill="url(#crownGradient)" />
                        <circle cx="32" cy="11" r="3" fill="url(#crownGradient)" />
                        <rect x="5" y="28" width="30" height="4" rx="2" fill="url(#crownGradient)" />
                    </svg>
                    <span className="brand-text">GeeKingdom</span>
                </Link>
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

                        {/* Bouton Admin - Affiché seulement si l'utilisateur est admin */}
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