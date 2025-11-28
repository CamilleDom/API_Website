import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/adminApi';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState(null);

  // Vérifier que l'utilisateur est admin
  if (!hasRole('admin')) {
    return <p>Accès refusé. Vous devez être administrateur.</p>;
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Chargement des statistiques...</p>;

  return (
    <section className="admin-dashboard">
      <h1>🔐 Tableau de bord Admin</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Utilisateurs</h3>
          <p className="stat-value">{stats.totalUsers}</p>
        </div>
        
        <div className="stat-card">
          <h3>Produits</h3>
          <p className="stat-value">{stats.totalProducts}</p>
        </div>
        
        <div className="stat-card">
          <h3>Commandes</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;