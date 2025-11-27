import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { commandesAPI, detailsCommandeAPI, livraisonsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const ordersData = await commandesAPI.getByUtilisateur(user.id);
        
        // Enrichir chaque commande avec ses détails et sa livraison
        const enrichedOrders = await Promise.all(
          ordersData.map(async (order) => {
            const [details, livraison] = await Promise.all([
              detailsCommandeAPI.getByCommande(order.idCommande),
              livraisonsAPI.getByCommande(order.idCommande).catch(() => null)
            ]);
            return { ...order, details, livraison };
          })
        );
        
        setOrders(enrichedOrders);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusLabel = (statut) => {
    const labels = {
      'en_attente': '⏳ En attente',
      'confirmee': '✓ Confirmée',
      'en_preparation': '📦 En préparation',
      'expediee': '🚚 Expédiée',
      'livree': '✅ Livrée',
      'annulee': '❌ Annulée',
    };
    return labels[statut] || statut;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <Loader message="Chargement de vos commandes..." />;

  return (
    <section className="orders-page">
      <h2>Mes Commandes</h2>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>Vous n'avez pas encore passé de commande.</p>
          <Link to="/products" className="btn-primary">
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.idCommande} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Commande #{order.numeroCommande}</h3>
                  <span className="order-date">{formatDate(order.dateCommande)}</span>
                </div>
                <span className={`order-status status-${order.statut}`}>
                  {getStatusLabel(order.statut)}
                </span>
              </div>

              <div className="order-items">
                {order.details?.map(detail => (
                  <div key={detail.idDetail} className="order-item">
                    <span>{detail.quantite}x Produit #{detail.idProduit}</span>
                    <span>{parseFloat(detail.prixTotal).toFixed(2)} €</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total :</strong>
                  <strong>{parseFloat(order.montantTotal).toFixed(2)} €</strong>
                </div>

                {order.livraison && (
                  <div className="order-tracking">
                    <span>Suivi : {order.livraison.numeroSuivi}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrdersPage;