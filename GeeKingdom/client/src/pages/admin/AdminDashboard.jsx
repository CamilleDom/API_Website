// src/pages/admin/AdminDashboard.jsx

import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_ADMIN_STATS, GET_COMMANDES_RECENTES, GET_STOCKS_EN_ALERTE } from '../../graphql/queries';
import StatsCard from '../../components/admin/StatsCard';

const AdminDashboard = () => {
  const { data: statsData, loading: statsLoading, error } = useQuery(GET_ADMIN_STATS);
  const { data: commandesData } = useQuery(GET_COMMANDES_RECENTES, {
    variables: { limit: 5 }
  });
  const { data: alertesData } = useQuery(GET_STOCKS_EN_ALERTE);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">❌ Erreur de connexion à GraphQL</p>
        <p className="text-sm text-red-500 mt-2">{error.message}</p>
      </div>
    );
  }

  const stats = statsData?.adminStats;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Utilisateurs"
          value={stats?.totalUtilisateurs || 0}
          icon="👥"
          color="blue"
          subtitle={`${stats?.utilisateursActifs || 0} actifs`}
        />
        <StatsCard
          title="Produits"
          value={stats?.totalProduits || 0}
          icon="🛍️"
          color="green"
          subtitle={`${stats?.produitsEnRupture || 0} en rupture`}
        />
        <StatsCard
          title="Commandes"
          value={stats?.totalCommandes || 0}
          icon="📦"
          color="purple"
          subtitle={`${stats?.commandesEnAttente || 0} en attente`}
        />
        <StatsCard
          title="Chiffre d'affaires"
          value={`${(stats?.chiffreAffaires || 0).toLocaleString('fr-FR')} €`}
          icon="💰"
          color="yellow"
        />
      </div>

      {/* Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avis en attente */}
        <Link 
          to="/admin/avis"
          className="bg-orange-50 border border-orange-200 rounded-lg p-6 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-800">Avis en attente</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats?.avisEnAttente || 0}
              </p>
            </div>
            <span className="text-4xl">⭐</span>
          </div>
          <p className="text-sm text-orange-600 mt-2">Cliquez pour modérer →</p>
        </Link>

        {/* Stocks en alerte */}
        <Link 
          to="/admin/stocks"
          className="bg-red-50 border border-red-200 rounded-lg p-6 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-800">Stocks en alerte</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats?.stocksEnAlerte || 0}
              </p>
            </div>
            <span className="text-4xl">⚠️</span>
          </div>
          <p className="text-sm text-red-600 mt-2">Réapprovisionner →</p>
        </Link>

        {/* Commandes à traiter */}
        <Link 
          to="/admin/commandes"
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800">À expédier</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats?.commandesEnAttente || 0}
              </p>
            </div>
            <span className="text-4xl">🚚</span>
          </div>
          <p className="text-sm text-blue-600 mt-2">Gérer les expéditions →</p>
        </Link>
      </div>

      {/* Dernières commandes & Alertes stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dernières commandes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Dernières commandes</h2>
            <Link to="/admin/commandes" className="text-purple-600 hover:underline text-sm">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-3">
            {commandesData?.commandesRecentes?.length > 0 ? (
              commandesData.commandesRecentes.map((commande) => (
                <div 
                  key={commande.idCommande}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">#{commande.numeroCommande}</p>
                    <p className="text-sm text-gray-500">
                      {commande.utilisateur?.nom} {commande.utilisateur?.prenom}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{commande.montantTotal} €</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      commande.statut === 'livree' ? 'bg-green-100 text-green-800' :
                      commande.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                      commande.statut === 'expediee' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {commande.statut?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune commande récente</p>
            )}
          </div>
        </div>

        {/* Alertes stock */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Alertes Stock</h2>
            <Link to="/admin/stocks" className="text-purple-600 hover:underline text-sm">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-3">
            {alertesData?.stocksEnAlerte?.length > 0 ? (
              alertesData.stocksEnAlerte.slice(0, 5).map((alerte, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{alerte.produit?.nomProduit}</p>
                    <p className="text-sm text-gray-500">
                      Stock: {alerte.stock?.quantiteDisponible} / Seuil: {alerte.stock?.seuilAlerte}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    alerte.alertLevel === 'CRITIQUE' ? 'bg-red-100 text-red-800' :
                    alerte.alertLevel === 'ÉLEVÉ' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alerte.alertLevel}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">✅ Aucune alerte stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;