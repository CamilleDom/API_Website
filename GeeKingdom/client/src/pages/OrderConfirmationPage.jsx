import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderNumber } = location.state || {};

  // If no order data, redirect to home
  if (!orderId || !orderNumber) {
    return (
      <section className="order-confirmation">
        <div className="confirmation-card">
          <div className="error-icon">❌</div>
          <h2>Aucune commande trouvée</h2>
          <p>Il semble qu'il y ait eu un problème avec votre commande.</p>
          <div className="confirmation-actions">
            <Link to="/" className="btn-primary">
              Retour à l'accueil
            </Link>
            <Link to="/orders" className="btn-secondary">
              Mes commandes
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="order-confirmation">
      <div className="confirmation-card">
        <div className="success-icon">✅</div>
        <h2>Commande confirmée !</h2>
        <p className="confirmation-message">
          Merci pour votre commande. Votre paiement a été traité avec succès.
        </p>

        <div className="order-details">
          <div className="detail-row">
            <span className="detail-label">Numéro de commande :</span>
            <span className="detail-value">{orderNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">ID de commande :</span>
            <span className="detail-value">#{orderId}</span>
          </div>
        </div>

        <div className="confirmation-info">
          <p>📧 Un email de confirmation a été envoyé à votre adresse.</p>
          <p>📦 Vous pouvez suivre votre commande dans votre espace client.</p>
        </div>

        <div className="confirmation-actions">
          <Link to="/orders" className="btn-primary">
            Voir mes commandes
          </Link>
          <Link to="/products" className="btn-secondary">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderConfirmationPage;
