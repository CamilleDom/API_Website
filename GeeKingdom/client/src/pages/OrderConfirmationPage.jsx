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
                <div className="confirmation-container">
                    <div className="confirmation-card error-state">
                        <div className="confirmation-icon error">
                            <span>❌</span>
                        </div>
                        <h1>Aucune commande trouvée</h1>
                        <p className="confirmation-message">
                            Il semble qu'il y ait eu un problème avec votre commande.
                        </p>
                        <div className="confirmation-actions">
                            <Link to="/" className="confirmation-btn confirmation-btn-primary">
                                <span className="btn-icon">🏠</span>
                                <span className="btn-text">Retour à l'accueil</span>
                            </Link>
                            <Link to="/orders" className="confirmation-btn confirmation-btn-secondary">
                                <span className="btn-icon">📦</span>
                                <span className="btn-text">Mes commandes</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="order-confirmation">
            <div className="confirmation-container">
                <div className="confirmation-card success-state">
                    {/* Success Animation */}
                    <div className="confirmation-icon success">
                        <div className="checkmark-circle">
                            <svg className="checkmark" viewBox="0 0 52 52">
                                <circle className="checkmark-bg" cx="26" cy="26" r="25" fill="none"/>
                                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1>Commande confirmée !</h1>

                    {/* Message */}
                    <p className="confirmation-message">
                        Merci pour votre commande. Votre paiement a été traité avec succès.
                    </p>

                    {/* Order Details Card */}
                    <div className="order-details-card">
                        <div className="detail-row">
                            <span className="detail-label">Numéro de commande</span>
                            <span className="detail-value order-number">{orderNumber}</span>
                        </div>
                        <div className="detail-divider"></div>
                        <div className="detail-row">
                            <span className="detail-label">ID de commande</span>
                            <span className="detail-value order-id">#{orderId}</span>
                        </div>
                    </div>

                    {/* Info Messages */}
                    <div className="confirmation-info">
                        <div className="info-item">
                            <span className="info-icon">📧</span>
                            <span className="info-text">Un email de confirmation a été envoyé à votre adresse.</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">📦</span>
                            <span className="info-text">Vous pouvez suivre votre commande dans votre espace client.</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="confirmation-actions">
                        <Link to="/orders" className="confirmation-btn confirmation-btn-primary">
                            <span className="btn-icon">📋</span>
                            <span className="btn-text">Voir mes commandes</span>
                        </Link>
                        <Link to="/products" className="confirmation-btn confirmation-btn-secondary">
                            <span className="btn-icon">🛍️</span>
                            <span className="btn-text">Continuer mes achats</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OrderConfirmationPage;