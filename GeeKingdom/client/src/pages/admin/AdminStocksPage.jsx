import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_STOCKS, GET_STOCKS_EN_ALERTE } from '../../graphql/queries';
import { APPROVISIONNER_STOCK, MODIFIER_SEUIL_ALERTE } from '../../graphql/mutations';

const AdminStocksPage = () => {
    const [showAlertsOnly, setShowAlertsOnly] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [quantiteAppro, setQuantiteAppro] = useState('');
    const [commentaire, setCommentaire] = useState('');

    const { data: stocksData, loading, refetch } = useQuery(GET_STOCKS);
    const { data: alertesData } = useQuery(GET_STOCKS_EN_ALERTE);

    const [approvisionner] = useMutation(APPROVISIONNER_STOCK, {
        onCompleted: (data) => {
            if (data.approvisionnerStock.success) {
                refetch();
                setSelectedStock(null);
                setQuantiteAppro('');
                setCommentaire('');
            }
        }
    });

    const [modifierSeuil] = useMutation(MODIFIER_SEUIL_ALERTE, { onCompleted: () => refetch() });

    const handleApprovisionner = async () => {
        if (selectedStock && quantiteAppro > 0) {
            await approvisionner({
                variables: {
                    input: {
                        idProduit: selectedStock.idProduit,
                        quantite: parseInt(quantiteAppro),
                        commentaire: commentaire || 'Approvisionnement depuis admin'
                    }
                }
            });
        }
    };

    const handleModifierSeuil = async (idProduit, nouveauSeuil) => {
        await modifierSeuil({ variables: { idProduit, seuil: parseInt(nouveauSeuil) } });
    };

    const displayedStocks = showAlertsOnly
        ? alertesData?.stocksEnAlerte?.map(a => ({ ...a.stock, produit: a.produit, alertLevel: a.alertLevel }))
        : stocksData?.stocks;

    const stockOk = stocksData?.stocks?.filter(s => s.quantiteDisponible > s.seuilAlerte).length || 0;
    const stockAlerte = alertesData?.stocksEnAlerte?.length || 0;
    const stockRupture = stocksData?.stocks?.filter(s => s.quantiteDisponible === 0).length || 0;

    const getStockStatus = (stock) => {
        if (stock.quantiteDisponible === 0) return { label: 'Rupture', icon: '🔴' };
        if (stock.quantiteDisponible <= stock.seuilAlerte) return { label: 'Alerte', icon: '🟠' };
        return { label: 'OK', icon: '🟢' };
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Gestion des Stocks</h1>
                <button
                    className={`admin-btn ${showAlertsOnly ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                    onClick={() => setShowAlertsOnly(!showAlertsOnly)}
                >
                    {showAlertsOnly ? '📋 Voir tout' : '⚠️ Alertes uniquement'}
                </button>
            </div>

            <div className="admin-summary-row">
                <div className="admin-summary-card green">
                    <p className="summary-label">Stock OK</p>
                    <p className="summary-value">{stockOk}</p>
                </div>
                <div className="admin-summary-card orange">
                    <p className="summary-label">En alerte</p>
                    <p className="summary-value">{stockAlerte}</p>
                </div>
                <div className="admin-summary-card red">
                    <p className="summary-label">En rupture</p>
                    <p className="summary-value">{stockRupture}</p>
                </div>
            </div>

            {loading && <div className="admin-loading"><div className="admin-spinner"></div></div>}

            {!loading && (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Produit</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Disponible</th>
                            <th className="text-center">Réservé</th>
                            <th className="text-center">Seuil</th>
                            <th className="text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayedStocks?.map((stock) => {
                            const status = getStockStatus(stock);
                            return (
                                <tr key={stock.idStock}>
                                    <td>
                                        <div className="table-product-cell">
                                            <span className="table-product-name">{stock.produit?.nomProduit}</span>
                                            <span className="table-product-sku">{stock.emplacement || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="text-center">
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {status.icon} {status.label}
                      </span>
                                    </td>
                                    <td className="text-center" style={{
                                        fontWeight: 600,
                                        color: stock.quantiteDisponible === 0 ? '#f87171' : stock.quantiteDisponible <= stock.seuilAlerte ? '#fb923c' : '#4ade80'
                                    }}>
                                        {stock.quantiteDisponible}
                                    </td>
                                    <td className="text-center" style={{ color: '#9ca3af' }}>{stock.quantiteReservee}</td>
                                    <td className="text-center">
                                        <input
                                            type="number"
                                            defaultValue={stock.seuilAlerte}
                                            onBlur={(e) => {
                                                if (e.target.value !== stock.seuilAlerte.toString()) {
                                                    handleModifierSeuil(stock.idProduit, e.target.value);
                                                }
                                            }}
                                            style={{
                                                width: '60px', textAlign: 'center', padding: '0.375rem',
                                                background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)',
                                                borderRadius: '0.375rem', color: '#c084fc'
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="admin-btn admin-btn-sm admin-btn-success" onClick={() => setSelectedStock(stock)}>
                                                + Approvisionner
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {displayedStocks?.length === 0 && !loading && (
                <div className="panel-empty"><span className="empty-icon">📦</span><p>Aucun stock à afficher</p></div>
            )}

            {selectedStock && (
                <div className="admin-modal-overlay" onClick={() => setSelectedStock(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Approvisionner: {selectedStock.produit?.nomProduit}</h2>
                            <button className="admin-modal-close" onClick={() => setSelectedStock(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>Stock actuel: <strong style={{ color: '#fff' }}>{selectedStock.quantiteDisponible}</strong></p>
                            <div className="admin-form">
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Quantité à ajouter</label>
                                    <input className="admin-form-input" type="number" min="1" value={quantiteAppro} onChange={(e) => setQuantiteAppro(e.target.value)} placeholder="Ex: 50" />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Commentaire (optionnel)</label>
                                    <input className="admin-form-input" type="text" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} placeholder="Ex: Réapprovisionnement fournisseur" />
                                </div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-secondary" onClick={() => setSelectedStock(null)}>Annuler</button>
                            <button className="admin-btn admin-btn-success" onClick={handleApprovisionner} disabled={!quantiteAppro || quantiteAppro <= 0}>
                                Confirmer (+{quantiteAppro || 0})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStocksPage;