import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { commandesAPI, detailsCommandeAPI, livraisonsAPI, produitsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            try {
                const ordersData = await commandesAPI.getByUtilisateur(user.id);

                // Enrichir chaque commande avec ses détails, livraison et infos produits
                const enrichedOrders = await Promise.all(
                    ordersData.map(async (order) => {
                        try {
                            const [details, livraison] = await Promise.all([
                                detailsCommandeAPI.getByCommande(order.idCommande),
                                livraisonsAPI.getByCommande(order.idCommande).catch(() => null)
                            ]);

                            // Récupérer les infos complètes des produits
                            const detailsWithProducts = await Promise.all(
                                details.map(async (detail) => {
                                    try {
                                        const product = await produitsAPI.getById(detail.idProduit);
                                        return { ...detail, product };
                                    } catch {
                                        return { ...detail, product: null };
                                    }
                                })
                            );

                            return { ...order, details: detailsWithProducts, livraison };
                        } catch (error) {
                            console.error(`Erreur pour commande ${order.idCommande}:`, error);
                            return { ...order, details: [], livraison: null };
                        }
                    })
                );

                // Trier par date décroissante
                enrichedOrders.sort((a, b) => new Date(b.dateCommande) - new Date(a.dateCommande));
                setOrders(enrichedOrders);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const getStatusInfo = (statut) => {
        const statusMap = {
            'en_attente': { label: 'En attente', icon: '⏳', color: 'warning' },
            'confirmee': { label: 'Confirmée', icon: '✓', color: 'success' },
            'en_preparation': { label: 'En préparation', icon: '📦', color: 'info' },
            'expediee': { label: 'Expédiée', icon: '🚚', color: 'primary' },
            'livree': { label: 'Livrée', icon: '✅', color: 'success' },
            'annulee': { label: 'Annulée', icon: '❌', color: 'danger' },
        };
        return statusMap[statut] || { label: statut, icon: '●', color: 'default' };
    };

    const getLivraisonStatus = (statutLivraison) => {
        const statusMap = {
            'en_attente': '⏳ En attente d\'expédition',
            'en_transit': '🚚 En transit',
            'en_cours_de_livraison': '📦 En cours de livraison',
            'livree': '✅ Livrée',
            'retournee': '↩️ Retournée',
        };
        return statusMap[statutLivraison] || statutLivraison;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatShortDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    if (loading) return <Loader message="Chargement de vos commandes..." />;

    return (
        <section className="orders-page">
            <div className="orders-header">
                <h2>Mes Commandes</h2>
                <p className="orders-count">
                    {orders.length} commande{orders.length > 1 ? 's' : ''} au total
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <div className="no-orders-icon">📦</div>
                    <h3>Aucune commande pour le moment</h3>
                    <p>Vous n'avez pas encore passé de commande.</p>
                    <Link to="/products" className="btn-primary">
                        Découvrir nos produits
                    </Link>
                </div>
            ) : (
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>N° Commande</th>
                            <th>Date</th>
                            <th>Statut</th>
                            <th>Articles</th>
                            <th>Montant</th>
                            <th>Livraison</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map(order => {
                            const isExpanded = expandedOrders.has(order.idCommande);
                            const statusInfo = getStatusInfo(order.statut);
                            const totalItems = order.details?.reduce((sum, d) => sum + d.quantite, 0) || 0;

                            return (
                                <React.Fragment key={order.idCommande}>
                                    <tr className={`order-row ${isExpanded ? 'expanded' : ''}`}>
                                        <td>
                                            <button
                                                className="expand-btn"
                                                onClick={() => toggleOrderExpansion(order.idCommande)}
                                                aria-label={isExpanded ? 'Réduire' : 'Développer'}
                                            >
                                                {isExpanded ? '▼' : '▶'}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="order-number">
                                                <strong>#{order.numeroCommande}</strong>
                                                <span className="order-id">ID: {order.idCommande}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="order-date">
                                                {formatShortDate(order.dateCommande)}
                                            </div>
                                        </td>
                                        <td>
                        <span className={`status-badge status-${statusInfo.color}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                                        </td>
                                        <td>
                                            <span className="items-count">{totalItems} article{totalItems > 1 ? 's' : ''}</span>
                                        </td>
                                        <td>
                                            <div className="order-amounts">
                                                <strong className="total-amount">{parseFloat(order.montantTotal).toFixed(2)} €</strong>
                                                {order.montantLivraison > 0 && (
                                                    <span className="shipping-amount">
                              + {parseFloat(order.montantLivraison).toFixed(2)} € livraison
                            </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {order.livraison ? (
                                                <div className="tracking-info">
                                                    <span className="tracking-number">{order.livraison.numeroSuivi}</span>
                                                </div>
                                            ) : (
                                                <span className="no-tracking">N/A</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn-details"
                                                onClick={() => toggleOrderExpansion(order.idCommande)}
                                            >
                                                {isExpanded ? 'Réduire' : 'Détails'}
                                            </button>
                                        </td>
                                    </tr>

                                    {isExpanded && (
                                        <tr className="order-details-row">
                                            <td colSpan="8">
                                                <div className="order-details-container">
                                                    {/* Order Items Table */}
                                                    <div className="details-section">
                                                        <h4>📦 Articles commandés</h4>
                                                        <table className="order-items-table">
                                                            <thead>
                                                            <tr>
                                                                <th>Image</th>
                                                                <th>Produit</th>
                                                                <th>Prix unitaire</th>
                                                                <th>Quantité</th>
                                                                <th>Total</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {order.details?.map(detail => (
                                                                <tr key={detail.idDetail}>
                                                                    <td>
                                                                        {detail.product?.imageUrl ? (
                                                                            <img
                                                                                src={detail.product.imageUrl}
                                                                                alt={detail.product.nomProduit}
                                                                                className="product-thumbnail"
                                                                            />
                                                                        ) : (
                                                                            <div className="product-placeholder">📷</div>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <div className="product-info">
                                                                            <strong>
                                                                                {detail.product?.nomProduit || `Produit #${detail.idProduit}`}
                                                                            </strong>
                                                                            {detail.product?.description && (
                                                                                <p className="product-desc">
                                                                                    {detail.product.description.substring(0, 80)}...
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td>{parseFloat(detail.prixUnitaire).toFixed(2)} €</td>
                                                                    <td>
                                                                        <span className="quantity-badge">×{detail.quantite}</span>
                                                                    </td>
                                                                    <td>
                                                                        <strong>{parseFloat(detail.prixTotal).toFixed(2)} €</strong>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                            <tfoot>
                                                            <tr>
                                                                <td colSpan="4" className="text-right">
                                                                    <strong>Sous-total articles:</strong>
                                                                </td>
                                                                <td>
                                                                    <strong>
                                                                        {order.details
                                                                            ?.reduce((sum, d) => sum + parseFloat(d.prixTotal), 0)
                                                                            .toFixed(2)} €
                                                                    </strong>
                                                                </td>
                                                            </tr>
                                                            {order.montantLivraison > 0 && (
                                                                <tr>
                                                                    <td colSpan="4" className="text-right">Frais de livraison:</td>
                                                                    <td>{parseFloat(order.montantLivraison).toFixed(2)} €</td>
                                                                </tr>
                                                            )}
                                                            {order.montantTaxe > 0 && (
                                                                <tr>
                                                                    <td colSpan="4" className="text-right">Taxes:</td>
                                                                    <td>{parseFloat(order.montantTaxe).toFixed(2)} €</td>
                                                                </tr>
                                                            )}
                                                            {order.reduction > 0 && (
                                                                <tr className="reduction-row">
                                                                    <td colSpan="4" className="text-right">
                                                                        Réduction {order.codePromo && `(${order.codePromo})`}:
                                                                    </td>
                                                                    <td className="reduction-amount">
                                                                        -{parseFloat(order.reduction).toFixed(2)} €
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr className="total-row">
                                                                <td colSpan="4" className="text-right">
                                                                    <strong>TOTAL:</strong>
                                                                </td>
                                                                <td>
                                                                    <strong className="grand-total">
                                                                        {parseFloat(order.montantTotal).toFixed(2)} €
                                                                    </strong>
                                                                </td>
                                                            </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>

                                                    {/* Shipping Address */}
                                                    <div className="details-section">
                                                        <h4>🏠 Adresse de livraison</h4>
                                                        <div className="address-box">
                                                            <p>{order.adresseLivraison}</p>
                                                            <p>
                                                                {order.codePostalLivraison} {order.villeLivraison}
                                                            </p>
                                                            <p>{order.paysLivraison}</p>
                                                        </div>
                                                    </div>

                                                    {/* Delivery Information */}
                                                    {order.livraison && (
                                                        <div className="details-section">
                                                            <h4>🚚 Informations de livraison</h4>
                                                            <div className="delivery-info">
                                                                <div className="info-row">
                                                                    <span className="info-label">Numéro de suivi:</span>
                                                                    <span className="info-value tracking-link">
                                      {order.livraison.numeroSuivi}
                                    </span>
                                                                </div>
                                                                <div className="info-row">
                                                                    <span className="info-label">Statut:</span>
                                                                    <span className="info-value">
                                      {getLivraisonStatus(order.livraison.statutLivraison)}
                                    </span>
                                                                </div>
                                                                <div className="info-row">
                                                                    <span className="info-label">Transporteur:</span>
                                                                    <span className="info-value">
                                      {order.livraison.transporteur || 'Standard'}
                                    </span>
                                                                </div>
                                                                {order.livraison.dateExpedition && (
                                                                    <div className="info-row">
                                                                        <span className="info-label">Date d'expédition:</span>
                                                                        <span className="info-value">
                                        {formatDate(order.livraison.dateExpedition)}
                                      </span>
                                                                    </div>
                                                                )}
                                                                {order.livraison.dateLivraisonEstimee && (
                                                                    <div className="info-row">
                                                                        <span className="info-label">Livraison estimée:</span>
                                                                        <span className="info-value">
                                        {formatShortDate(order.livraison.dateLivraisonEstimee)}
                                      </span>
                                                                    </div>
                                                                )}
                                                                {order.livraison.dateLivraisonReelle && (
                                                                    <div className="info-row">
                                                                        <span className="info-label">Livré le:</span>
                                                                        <span className="info-value success">
                                        {formatDate(order.livraison.dateLivraisonReelle)}
                                      </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Order Notes */}
                                                    {order.commentaires && (
                                                        <div className="details-section">
                                                            <h4>💬 Commentaires</h4>
                                                            <div className="comments-box">
                                                                <p>{order.commentaires}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Order Timeline */}
                                                    <div className="details-section">
                                                        <h4>📅 Historique</h4>
                                                        <div className="order-timeline">
                                                            <div className="timeline-item completed">
                                                                <div className="timeline-dot"></div>
                                                                <div className="timeline-content">
                                                                    <strong>Commande passée</strong>
                                                                    <span>{formatDate(order.dateCommande)}</span>
                                                                </div>
                                                            </div>
                                                            {order.statut !== 'en_attente' && (
                                                                <div className="timeline-item completed">
                                                                    <div className="timeline-dot"></div>
                                                                    <div className="timeline-content">
                                                                        <strong>Commande confirmée</strong>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {order.livraison?.dateExpedition && (
                                                                <div className="timeline-item completed">
                                                                    <div className="timeline-dot"></div>
                                                                    <div className="timeline-content">
                                                                        <strong>Colis expédié</strong>
                                                                        <span>{formatDate(order.livraison.dateExpedition)}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {order.livraison?.dateLivraisonReelle ? (
                                                                <div className="timeline-item completed">
                                                                    <div className="timeline-dot"></div>
                                                                    <div className="timeline-content">
                                                                        <strong>Colis livré</strong>
                                                                        <span>{formatDate(order.livraison.dateLivraisonReelle)}</span>
                                                                    </div>
                                                                </div>
                                                            ) : order.livraison?.dateLivraisonEstimee && (
                                                                <div className="timeline-item pending">
                                                                    <div className="timeline-dot"></div>
                                                                    <div className="timeline-content">
                                                                        <strong>Livraison prévue</strong>
                                                                        <span>{formatShortDate(order.livraison.dateLivraisonEstimee)}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default OrdersPage;