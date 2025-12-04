import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { commandesAPI, detailsCommandeAPI, produitsAPI, livraisonsAPI } from '../services/api';
import Loader from '../components/Loader';

function OrdersPage() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [trackingData, setTrackingData] = useState(null);
    const [stats, setStats] = useState(null);

    // Filtres
    const [filterStatut, setFilterStatut] = useState('');

    // Modal states
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [cancelMotif, setCancelMotif] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');

    // Données d'édition
    const [editData, setEditData] = useState({
        adresseLivraison: '',
        villeLivraison: '',
        codePostalLivraison: '',
        paysLivraison: ''
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login', { state: { from: '/orders' } });
            return;
        }
        fetchOrders();
        fetchStats();
    }, [user, isAuthenticated, navigate, filterStatut]);

    const fetchOrders = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const filters = filterStatut ? { statut: filterStatut } : {};
            const ordersData = await commandesAPI.getHistorique(user.id, filters);

            // Enrichir avec les détails des produits
            const enrichedOrders = await Promise.all(
                ordersData.map(async (order) => {
                    try {
                        const details = await detailsCommandeAPI.getByCommande(order.idCommande);
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
                        return { ...order, details: detailsWithProducts };
                    } catch (error) {
                        return { ...order, details: [] };
                    }
                })
            );

            setOrders(enrichedOrders);
        } catch (error) {
            console.error('Erreur chargement commandes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        if (!user) return;
        try {
            const statsData = await commandesAPI.getStats(user.id);
            setStats(statsData);
        } catch (error) {
            console.error('Erreur chargement stats:', error);
        }
    };

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

    // ✅ SUIVRE UNE COMMANDE
    const handleTrackOrder = async (order) => {
        setSelectedOrder(order);
        setShowTrackingModal(true);
        setActionLoading(true);

        try {
            const tracking = await commandesAPI.suivre(order.idCommande);
            setTrackingData(tracking);
        } catch (error) {
            setActionError('Impossible de charger le suivi de la commande');
        } finally {
            setActionLoading(false);
        }
    };

    // ✅ OUVRIR MODAL ANNULATION
    const handleOpenCancelModal = (order) => {
        setSelectedOrder(order);
        setCancelMotif('');
        setActionError('');
        setShowCancelModal(true);
    };

    // ✅ CONFIRMER ANNULATION
    const handleConfirmCancel = async () => {
        if (!selectedOrder) return;

        setActionLoading(true);
        setActionError('');

        try {
            await commandesAPI.annuler(selectedOrder.idCommande, cancelMotif || 'Annulation demandée par le client');
            setActionSuccess(`Commande ${selectedOrder.numeroCommande} annulée avec succès`);
            setShowCancelModal(false);
            fetchOrders();
            fetchStats();

            // Effacer le message de succès après 3 secondes
            setTimeout(() => setActionSuccess(''), 3000);
        } catch (error) {
            setActionError(error.message || 'Erreur lors de l\'annulation');
        } finally {
            setActionLoading(false);
        }
    };

    // ✅ OUVRIR MODAL MODIFICATION
    const handleOpenEditModal = (order) => {
        setSelectedOrder(order);
        setEditData({
            adresseLivraison: order.adresseLivraison || '',
            villeLivraison: order.villeLivraison || '',
            codePostalLivraison: order.codePostalLivraison || '',
            paysLivraison: order.paysLivraison || 'France'
        });
        setActionError('');
        setShowEditModal(true);
    };

    // ✅ CONFIRMER MODIFICATION
    const handleConfirmEdit = async () => {
        if (!selectedOrder) return;

        setActionLoading(true);
        setActionError('');

        try {
            await commandesAPI.update(selectedOrder.idCommande, editData);
            setActionSuccess(`Commande ${selectedOrder.numeroCommande} mise à jour`);
            setShowEditModal(false);
            fetchOrders();

            setTimeout(() => setActionSuccess(''), 3000);
        } catch (error) {
            setActionError(error.message || 'Erreur lors de la modification');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusInfo = (statut) => {
        const statusMap = {
            'en_attente': { label: 'En attente', icon: '⏳', color: 'warning', class: 'status-warning' },
            'confirmee': { label: 'Confirmée', icon: '✓', color: 'info', class: 'status-info' },
            'en_preparation': { label: 'En préparation', icon: '📦', color: 'info', class: 'status-info' },
            'expediee': { label: 'Expédiée', icon: '🚚', color: 'primary', class: 'status-primary' },
            'livree': { label: 'Livrée', icon: '✅', color: 'success', class: 'status-success' },
            'annulee': { label: 'Annulée', icon: '❌', color: 'danger', class: 'status-danger' }
        };
        return statusMap[statut] || { label: statut, icon: '❓', color: 'secondary', class: 'status-secondary' };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price || 0);
    };

    if (!isAuthenticated()) {
        return null;
    }

    if (loading) {
        return <Loader message="Chargement de vos commandes..." />;
    }

    return (
        <section className="orders-page">
            <h2>📦 Mes Commandes</h2>

            {/* Messages de succès/erreur */}
            {actionSuccess && (
                <div className="success-message">
                    <span>✅</span> {actionSuccess}
                </div>
            )}

            {/* Statistiques */}
            {stats && (
                <div className="orders-stats">
                    <div className="stat-card">
                        <span className="stat-icon">📋</span>
                        <div className="stat-content">
                            <span className="stat-value">{stats.totalCommandes}</span>
                            <span className="stat-label">Total commandes</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🔄</span>
                        <div className="stat-content">
                            <span className="stat-value">{stats.commandesEnCours}</span>
                            <span className="stat-label">En cours</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">✅</span>
                        <div className="stat-content">
                            <span className="stat-value">{stats.commandesLivrees}</span>
                            <span className="stat-label">Livrées</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">💰</span>
                        <div className="stat-content">
                            <span className="stat-value">{formatPrice(stats.montantTotalDepense)}</span>
                            <span className="stat-label">Total dépensé</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="orders-filters">
                <label htmlFor="filterStatut">Filtrer par statut :</label>
                <select
                    id="filterStatut"
                    value={filterStatut}
                    onChange={(e) => setFilterStatut(e.target.value)}
                >
                    <option value="">Toutes les commandes</option>
                    <option value="en_attente">En attente</option>
                    <option value="confirmee">Confirmée</option>
                    <option value="en_preparation">En préparation</option>
                    <option value="expediee">Expédiée</option>
                    <option value="livree">Livrée</option>
                    <option value="annulee">Annulée</option>
                </select>
            </div>

            {/* Liste des commandes */}
            {orders.length === 0 ? (
                <div className="orders-empty">
                    <span className="empty-icon">📭</span>
                    <h3>Aucune commande</h3>
                    <p>Vous n'avez pas encore passé de commande.</p>
                    <Link to="/products" className="btn-primary">
                        Découvrir nos produits
                    </Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => {
                        const statusInfo = getStatusInfo(order.statut);
                        const isExpanded = expandedOrders.has(order.idCommande);

                        return (
                            <div key={order.idCommande} className={`order-card ${statusInfo.class}`}>
                                {/* Header de la commande */}
                                <div className="order-header" onClick={() => toggleOrderExpansion(order.idCommande)}>
                                    <div className="order-main-info">
                                        <span className="order-number">{order.numeroCommande}</span>
                                        <span className={`order-status ${statusInfo.class}`}>
                                            {statusInfo.icon} {statusInfo.label}
                                        </span>
                                    </div>
                                    <div className="order-meta">
                                        <span className="order-date">{formatDate(order.dateCommande)}</span>
                                        <span className="order-total">{formatPrice(order.montantTotal)}</span>
                                        <span className="order-items">{order.nombreArticles} article(s)</span>
                                    </div>
                                    <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                                        ▼
                                    </span>
                                </div>

                                {/* Détails de la commande (expanded) */}
                                {isExpanded && (
                                    <div className="order-details">
                                        {/* Produits */}
                                        <div className="order-products">
                                            <h4>Articles commandés</h4>
                                            {order.details && order.details.map((detail, index) => (
                                                <div key={index} className="order-product-item">
                                                    <div className="product-image">
                                                        {detail.product?.imagesJson ? (
                                                            <img
                                                                src={JSON.parse(detail.product.imagesJson)[0]}
                                                                alt={detail.product?.nomProduit}
                                                                onError={(e) => e.target.src = '/placeholder.jpg'}
                                                            />
                                                        ) : (
                                                            <div className="placeholder-image">📦</div>
                                                        )}
                                                    </div>
                                                    <div className="product-info">
                                                        <span className="product-name">
                                                            {detail.product?.nomProduit || `Produit #${detail.idProduit}`}
                                                        </span>
                                                        <span className="product-quantity">Qté: {detail.quantite}</span>
                                                    </div>
                                                    <span className="product-price">
                                                        {formatPrice(detail.prixTotal)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="order-actions">
                                            <button
                                                className="btn-secondary btn-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTrackOrder(order);
                                                }}
                                            >
                                                🔍 Suivre la commande
                                            </button>

                                            {order.peutEtreAnnulee && order.statut !== 'annulee' && (
                                                <>
                                                    <button
                                                        className="btn-outline btn-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenEditModal(order);
                                                        }}
                                                    >
                                                        ✏️ Modifier
                                                    </button>
                                                    <button
                                                        className="btn-danger btn-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenCancelModal(order);
                                                        }}
                                                    >
                                                        ❌ Annuler
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ========== MODAL SUIVI ========== */}
            {showTrackingModal && (
                <div className="modal-overlay" onClick={() => setShowTrackingModal(false)}>
                    <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🔍 Suivi de la commande {selectedOrder?.numeroCommande}</h3>
                            <button className="modal-close" onClick={() => setShowTrackingModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            {actionLoading ? (
                                <Loader message="Chargement du suivi..." />
                            ) : trackingData ? (
                                <div className="tracking-content">
                                    {/* Infos commande */}
                                    <div className="tracking-info">
                                        <div className="info-row">
                                            <span className="info-label">Statut actuel:</span>
                                            <span className={`order-status ${getStatusInfo(trackingData.commande.statut).class}`}>
                                                {getStatusInfo(trackingData.commande.statut).icon} {getStatusInfo(trackingData.commande.statut).label}
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Montant:</span>
                                            <span>{formatPrice(trackingData.commande.montantTotal)}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Adresse:</span>
                                            <span>{trackingData.commande.adresseLivraison}</span>
                                        </div>
                                        {trackingData.livraison && (
                                            <>
                                                <div className="info-row">
                                                    <span className="info-label">Transporteur:</span>
                                                    <span>{trackingData.livraison.transporteur}</span>
                                                </div>
                                                <div className="info-row">
                                                    <span className="info-label">N° Suivi:</span>
                                                    <span className="tracking-number">{trackingData.livraison.numeroSuivi}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Timeline de suivi */}
                                    <div className="tracking-timeline">
                                        <h4>Historique</h4>
                                        {trackingData.historique && trackingData.historique.map((step, index) => (
                                            <div
                                                key={index}
                                                className={`timeline-step ${step.statut}`}
                                            >
                                                <div className="timeline-dot"></div>
                                                <div className="timeline-content">
                                                    <span className="timeline-title">{step.etape}</span>
                                                    <span className="timeline-desc">{step.description}</span>
                                                    {step.date && (
                                                        <span className="timeline-date">{formatDate(step.date)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Prochaine étape */}
                                    {trackingData.prochaineEtape && trackingData.commande.statut !== 'livree' && trackingData.commande.statut !== 'annulee' && (
                                        <div className="next-step-info">
                                            <span className="next-step-label">Prochaine étape:</span>
                                            <span className="next-step-value">{trackingData.prochaineEtape}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p>Impossible de charger les informations de suivi.</p>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowTrackingModal(false)}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== MODAL ANNULATION ========== */}
            {showCancelModal && (
                <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>❌ Annuler la commande</h3>
                            <button className="modal-close" onClick={() => setShowCancelModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <p>Êtes-vous sûr de vouloir annuler la commande <strong>{selectedOrder?.numeroCommande}</strong> ?</p>
                            <p className="text-warning">⚠️ Cette action est irréversible. Les articles seront remis en stock.</p>

                            <div className="form-group">
                                <label htmlFor="cancelMotif">Motif d'annulation (optionnel):</label>
                                <textarea
                                    id="cancelMotif"
                                    value={cancelMotif}
                                    onChange={(e) => setCancelMotif(e.target.value)}
                                    placeholder="Ex: Changement d'avis, délai trop long..."
                                    rows="3"
                                />
                            </div>

                            {actionError && (
                                <div className="error-message">{actionError}</div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowCancelModal(false)}
                                disabled={actionLoading}
                            >
                                Retour
                            </button>
                            <button
                                className="btn-danger"
                                onClick={handleConfirmCancel}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Annulation...' : 'Confirmer l\'annulation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== MODAL MODIFICATION ========== */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Modifier la commande</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <p>Modifier l'adresse de livraison pour <strong>{selectedOrder?.numeroCommande}</strong></p>

                            <div className="form-group">
                                <label htmlFor="editAdresse">Adresse:</label>
                                <input
                                    id="editAdresse"
                                    type="text"
                                    value={editData.adresseLivraison}
                                    onChange={(e) => setEditData({...editData, adresseLivraison: e.target.value})}
                                    placeholder="Numéro et nom de rue"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="editVille">Ville:</label>
                                    <input
                                        id="editVille"
                                        type="text"
                                        value={editData.villeLivraison}
                                        onChange={(e) => setEditData({...editData, villeLivraison: e.target.value})}
                                        placeholder="Ville"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="editCodePostal">Code postal:</label>
                                    <input
                                        id="editCodePostal"
                                        type="text"
                                        value={editData.codePostalLivraison}
                                        onChange={(e) => setEditData({...editData, codePostalLivraison: e.target.value})}
                                        placeholder="Code postal"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="editPays">Pays:</label>
                                <input
                                    id="editPays"
                                    type="text"
                                    value={editData.paysLivraison}
                                    onChange={(e) => setEditData({...editData, paysLivraison: e.target.value})}
                                    placeholder="Pays"
                                />
                            </div>

                            {actionError && (
                                <div className="error-message">{actionError}</div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowEditModal(false)}
                                disabled={actionLoading}
                            >
                                Annuler
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleConfirmEdit}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default OrdersPage;