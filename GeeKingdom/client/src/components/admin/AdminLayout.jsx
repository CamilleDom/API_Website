import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AdminStyles.css';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Dashboard', exact: true },
        { path: '/admin/avis', icon: '⭐', label: 'Modération Avis' },
        { path: '/admin/utilisateurs', icon: '👥', label: 'Utilisateurs' },
        { path: '/admin/commandes', icon: '📦', label: 'Commandes' },
        { path: '/admin/produits', icon: '🛍️', label: 'Produits' },
        { path: '/admin/stocks', icon: '📋', label: 'Stocks' },
        { path: '/admin/categories', icon: '🏷️', label: 'Catégories' },
    ];

    return (
        <div className="admin-layout">
            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-left">
                    <Link to="/admin" className="admin-logo">
                        👑 GeeKingdom Admin
                    </Link>
                </div>

                <div className="admin-header-right">
                    <Link to="/" className="admin-back-link">
                        ← Retour au site
                    </Link>
                    <span className="admin-user-name">
            {user?.prenom} {user?.nom}
          </span>
                    <button onClick={handleLogout} className="admin-logout-btn">
                        Déconnexion
                    </button>
                </div>
            </header>

            <div className="admin-body">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <nav className="admin-nav">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) =>
                                    `admin-nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;