import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
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
    <aside className="w-64 bg-gray-800 min-h-screen text-white">
      <nav className="py-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition ${
                isActive ? 'bg-purple-600 text-white border-r-4 border-purple-400' : ''
              }`
            }
          >
            <span className="text-xl mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;