import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_ADMIN_STATS, GET_COMMANDES_RECENTES, GET_STOCKS_EN_ALERTE } from '../../graphql/queries';

const AdminDashboard = () => {
    const { data: statsData, loading: statsLoading, error } = useQuery(GET_ADMIN_STATS);
    const { data: commandesData } = useQuery(GET_COMMANDES_RECENTES, {
        variables: { limit: 5 }
    });
    const { data: alertesData } = useQuery(GET_STOCKS_EN_ALERTE);

    if (statsLoading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <div className="admin-error-icon">❌</div>
                <h3>Erreur de connexion à GraphQL</h3>
                <p>{error.message}</p>
            </div>
        );
    }

    const stats = statsData?.adminStats;

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1>Dashboard Admin</h1>
                <p className="dashboard-date">
                    {new Date().toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Stats Grid - 4 colonnes */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="stat-icon-wrapper blue">👥</div>
                    <div className="stat-content">
                        <p className="stat-label">Utilisateurs</p>
                        <p className="stat-value">{stats?.totalUtilisateurs || 0}</p>
                        <p className="stat-subtitle">{stats?.utilisateursActifs || 0} actifs</p>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="stat-icon-wrapper green">🛍️</div>
                    <div className="stat-content">
                        <p className="stat-label">Produits</p>
                        <p className="stat-value">{stats?.totalProduits || 0}</p>
                        <p className="stat-subtitle">{stats?.produitsEnRupture || 0} en rupture</p>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="stat-icon-wrapper purple">📦</div>
                    <div className="stat-content">
                        <p className="stat-label">Commandes</p>
                        <p className="stat-value">{stats?.totalCommandes || 0}</p>
                        <p className="stat-subtitle">{stats?.commandesEnAttente || 0} en attente</p>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="stat-icon-wrapper yellow">💰</div>
                    <div className="stat-content">
                        <p className="stat-label">Chiffre d'affaires</p>
                        <p className="stat-value">{(stats?.chiffreAffaires || 0).toLocaleString('fr-FR')} €</p>
                    </div>
                </div>
            </div>

            {/* Alertes - 3 colonnes */}
            <div className="admin-alerts-grid">
                <Link to="/admin/avis" className="admin-alert-card orange">
                    <div className="alert-info">
                        <h3>Avis en attente</h3>
                        <p className="alert-value">{stats?.avisEnAttente || 0}</p>
                        <p className="alert-action">Cliquez pour modérer →</p>
                    </div>
                    <span className="alert-icon">⭐</span>
                </Link>

                <Link to="/admin/stocks" className="admin-alert-card red">
                    <div className="alert-info">
                        <h3>Stocks en alerte</h3>
                        <p className="alert-value">{stats?.stocksEnAlerte || 0}</p>
                        <p className="alert-action">Réapprovisionner →</p>
                    </div>
                    <span className="alert-icon">⚠️</span>
                </Link>

                <Link to="/admin/commandes" className="admin-alert-card blue">
                    <div className="alert-info">
                        <h3>À expédier</h3>
                        <p className="alert-value">{stats?.commandesEnAttente || 0}</p>
                        <p className="alert-action">Gérer les expéditions →</p>
                    </div>
                    <span className="alert-icon">🚚</span>
                </Link>
            </div>

            {/* Panels - 2 colonnes */}
            <div className="admin-panels-grid">
                {/* Dernières commandes */}
                <div className="admin-panel">
                    <div className="panel-header">
                        <h2>Dernières commandes</h2>
                        <Link to="/admin/commandes" className="panel-link">Voir tout →</Link>
                    </div>
                    <div className="panel-content">
                        {commandesData?.commandesRecentes?.length > 0 ? (
                            commandesData.commandesRecentes.map((commande) => (
                                <div key={commande.idCommande} className="order-item">
                                    <div className="order-info">
                                        <span className="order-number">#{commande.numeroCommande}</span>
                                        <span className="order-customer">
                      {commande.utilisateur?.nom} {commande.utilisateur?.prenom}
                    </span>
                                    </div>
                                    <div className="order-details">
                                        <span className="order-amount">{commande.montantTotal} €</span>
                                        <span className={`order-status ${commande.statut?.replace('_', '-')}`}>
                      {commande.statut?.replace('_', ' ')}
                    </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="panel-empty">
                                <span className="empty-icon">📭</span>
                                <p>Aucune commande récente</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Alertes Stock */}
                <div className="admin-panel">
                    <div className="panel-header">
                        <h2>Alertes Stock</h2>
                        <Link to="/admin/stocks" className="panel-link">Voir tout →</Link>
                    </div>
                    <div className="panel-content">
                        {alertesData?.stocksEnAlerte?.length > 0 ? (
                            alertesData.stocksEnAlerte.slice(0, 5).map((alerte, index) => (
                                <div key={index} className="stock-alert-item">
                                    <div className="alert-product-info">
                                        <span className="alert-product-name">{alerte.produit?.nomProduit}</span>
                                        <span className="alert-stock-level">
                      Stock: {alerte.stock?.quantiteDisponible} / Seuil: {alerte.stock?.seuilAlerte}
                    </span>
                                    </div>
                                    <span className={`alert-level-badge ${
                                        alerte.alertLevel === 'CRITIQUE' ? 'critique' :
                                            alerte.alertLevel === 'ÉLEVÉ' ? 'eleve' : 'moyen'
                                    }`}>
                    {alerte.alertLevel}
                  </span>
                                </div>
                            ))
                        ) : (
                            <div className="panel-empty">
                                <span className="empty-icon">✅</span>
                                <p>Aucune alerte stock</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;