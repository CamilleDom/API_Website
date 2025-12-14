import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_AVIS_EN_ATTENTE, GET_AVIS_PAR_STATUT } from '../../graphql/queries';
import { APPROUVER_AVIS, REJETER_AVIS, SUPPRIMER_AVIS } from '../../graphql/mutations';

const AdminAvisPage = () => {
    const [activeTab, setActiveTab] = useState('en_attente');
    const [page, setPage] = useState(0);
    const [motifRejet, setMotifRejet] = useState('');
    const [selectedAvis, setSelectedAvis] = useState(null);

    const { data, loading, refetch } = useQuery(
        activeTab === 'en_attente' ? GET_AVIS_EN_ATTENTE : GET_AVIS_PAR_STATUT,
        {
            variables: activeTab === 'en_attente'
                ? { page, size: 10 }
                : { statut: activeTab, page, size: 10 }
        }
    );

    const [approuverAvis] = useMutation(APPROUVER_AVIS, { onCompleted: () => refetch() });
    const [rejeterAvis] = useMutation(REJETER_AVIS, {
        onCompleted: () => { refetch(); setSelectedAvis(null); setMotifRejet(''); }
    });
    const [supprimerAvis] = useMutation(SUPPRIMER_AVIS, { onCompleted: () => refetch() });

    const handleApprouver = async (id) => {
        if (window.confirm('Approuver cet avis ?')) {
            await approuverAvis({ variables: { id: id.toString() } });
        }
    };

    const handleRejeter = async () => {
        if (selectedAvis) {
            await rejeterAvis({ variables: { id: selectedAvis.toString(), motif: motifRejet || null } });
        }
    };

    const handleSupprimer = async (id) => {
        if (window.confirm('Supprimer définitivement cet avis ?')) {
            await supprimerAvis({ variables: { id: id.toString() } });
        }
    };

    const avisData = activeTab === 'en_attente' ? data?.avisEnAttente : data?.avisParStatut;

    const renderStars = (note) => [...Array(5)].map((_, i) => (
        <span key={i} className={`star ${i < note ? '' : 'empty'}`}>★</span>
    ));

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Modération des Avis</h1>
            </div>

            <div className="admin-filter-tabs">
                {[
                    { key: 'en_attente', label: 'En attente' },
                    { key: 'approuve', label: 'Approuvés' },
                    { key: 'rejete', label: 'Rejetés' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        className={`admin-filter-tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => { setActiveTab(tab.key); setPage(0); }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading && <div className="admin-loading"><div className="admin-spinner"></div></div>}

            {!loading && (
                <div className="admin-cards-grid">
                    {avisData?.content?.length === 0 ? (
                        <div className="admin-card">
                            <div className="panel-empty">
                                <span className="empty-icon">📭</span>
                                <p>Aucun avis dans cette catégorie</p>
                            </div>
                        </div>
                    ) : (
                        avisData?.content?.map((avis) => (
                            <div key={avis.idAvis} className="admin-card">
                                <div className="review-card-header">
                                    <div className="review-rating">{renderStars(avis.note)}</div>
                                    <span className="review-date">{new Date(avis.dateAvis).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <p className="review-content">{avis.commentaire}</p>
                                <div className="review-meta">
                                    <div className="review-meta-item"><span className="meta-icon">👤</span><span>{avis.utilisateur?.prenom} {avis.utilisateur?.nom}</span></div>
                                    <div className="review-meta-item"><span className="meta-icon">✉️</span><span>{avis.utilisateur?.email}</span></div>
                                    <div className="review-meta-item"><span className="meta-icon">📦</span><span>{avis.produit?.nomProduit}</span></div>
                                </div>
                                <div className="review-actions">
                                    {activeTab === 'en_attente' ? (
                                        <>
                                            <button className="admin-btn admin-btn-success" onClick={() => handleApprouver(avis.idAvis)}>✓ Approuver</button>
                                            <button className="admin-btn admin-btn-danger" onClick={() => setSelectedAvis(avis.idAvis)}>✗ Rejeter</button>
                                        </>
                                    ) : (
                                        <button className="admin-btn admin-btn-danger" onClick={() => handleSupprimer(avis.idAvis)}>🗑️ Supprimer</button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {avisData?.pageInfo && avisData.content?.length > 0 && (
                <div className="admin-pagination">
                    <span className="admin-pagination-info">Page {avisData.pageInfo.currentPage + 1} sur {avisData.pageInfo.totalPages}</span>
                    <div className="admin-pagination-buttons">
                        <button className="admin-pagination-btn" onClick={() => setPage(p => p - 1)} disabled={!avisData.pageInfo.hasPrevious}>← Précédent</button>
                        <button className="admin-pagination-btn" onClick={() => setPage(p => p + 1)} disabled={!avisData.pageInfo.hasNext}>Suivant →</button>
                    </div>
                </div>
            )}

            {selectedAvis && (
                <div className="admin-modal-overlay" onClick={() => setSelectedAvis(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Rejeter l'avis</h2>
                            <button className="admin-modal-close" onClick={() => setSelectedAvis(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-form-group">
                                <label className="admin-form-label">Motif du rejet (optionnel)</label>
                                <textarea className="admin-form-textarea" value={motifRejet} onChange={(e) => setMotifRejet(e.target.value)} placeholder="Expliquez la raison..." rows="4" />
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-secondary" onClick={() => setSelectedAvis(null)}>Annuler</button>
                            <button className="admin-btn admin-btn-danger" onClick={handleRejeter}>Confirmer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAvisPage;