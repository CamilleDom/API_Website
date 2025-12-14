import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COMMANDES, GET_COMMANDE } from '../../graphql/queries';
import { CHANGER_STATUT_COMMANDE, ANNULER_COMMANDE } from '../../graphql/mutations';

const AdminOrdersPage = () => {
    const [page, setPage] = useState(0);
    const [filterStatut, setFilterStatut] = useState(null);
    const [selectedCommande, setSelectedCommande] = useState(null);

    const { data, loading, refetch } = useQuery(GET_COMMANDES, {
        variables: { page, size: 15, filter: filterStatut ? { statut: filterStatut } : null }
    });

    const { data: detailData } = useQuery(GET_COMMANDE, {
        variables: { id: selectedCommande?.toString() },
        skip: !selectedCommande
    });

    const [changerStatut] = useMutation(CHANGER_STATUT_COMMANDE, { onCompleted: () => refetch() });
    const [annulerCommande] = useMutation(ANNULER_COMMANDE, { onCompleted: () => refetch() });

    const handleChangerStatut = async (id, newStatut) => {
        await changerStatut({ variables: { id: id.toString(), statut: newStatut } });
    };

    const handleAnnuler = async (id) => {
        const motif = window.prompt('Motif de l\'annulation :');
        if (motif !== null) {
            await annulerCommande({ variables: { id: id.toString(), motif } });
        }
    };

    const statuts = [
        { value: null, label: 'Tous' },
        { value: 'en_attente', label: 'En attente' },
        { value: 'confirmee', label: 'Confirmée' },
        { value: 'en_preparation', label: 'En préparation' },
        { value: 'expediee', label: 'Expédiée' },
        { value: 'livree', label: 'Livrée' },
        { value: 'annulee', label: 'Annulée' }
    ];

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Gestion des Commandes</h1>
            </div>

            <div className="admin-filter-tabs">
                {statuts.map((statut) => (
                    <button
                        key={statut.value || 'all'}
                        className={`admin-filter-tab ${filterStatut === statut.value ? 'active' : ''}`}
                        onClick={() => { setFilterStatut(statut.value); setPage(0); }}
                    >
                        {statut.label}
                    </button>
                ))}
            </div>

            {loading && <div className="admin-loading"><div className="admin-spinner"></div></div>}

            {!loading && (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Commande</th>
                            <th>Client</th>
                            <th>Montant</th>
                            <th>Statut</th>
                            <th>Date</th>
                            <th className="text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data?.commandes?.content?.length === 0 ? (
                            <tr>
                                <td colSpan="6">
                                    <div className="panel-empty"><span className="empty-icon">📦</span><p>Aucune commande trouvée</p></div>
                                </td>
                            </tr>
                        ) : (
                            data?.commandes?.content?.map((cmd) => (
                                <tr key={cmd.idCommande}>
                                    <td>
                                        <button
                                            onClick={() => setSelectedCommande(cmd.idCommande)}
                                            style={{ background: 'rgba(168,85,247,0.1)', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', color: '#c084fc', fontFamily: 'monospace', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                                        >
                                            #{cmd.numeroCommande}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="table-contact-cell">
                                            <span style={{ color: '#fff' }}>{cmd.utilisateur?.prenom} {cmd.utilisateur?.nom}</span>
                                            <span className="table-contact-phone">{cmd.utilisateur?.email}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600, color: '#fff' }}>{cmd.montantTotal} €</td>
                                    <td><span className={`order-status ${cmd.statut?.replace('_', '-')}`}>{cmd.statut?.replace('_', ' ')}</span></td>
                                    <td style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{cmd.dateCommande ? new Date(cmd.dateCommande).toLocaleDateString('fr-FR') : '-'}</td>
                                    <td>
                                        <div className="table-actions">
                                            {cmd.statut !== 'annulee' && cmd.statut !== 'livree' && (
                                                <>
                                                    <select className="table-select" value={cmd.statut} onChange={(e) => handleChangerStatut(cmd.idCommande, e.target.value)}>
                                                        <option value="en_attente">En attente</option>
                                                        <option value="confirmee">Confirmée</option>
                                                        <option value="en_preparation">En préparation</option>
                                                        <option value="expediee">Expédiée</option>
                                                        <option value="livree">Livrée</option>
                                                    </select>
                                                    <button className="table-action-btn delete" onClick={() => handleAnnuler(cmd.idCommande)} title="Annuler">✗</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {data?.commandes?.pageInfo && (
                <div className="admin-pagination">
                    <span className="admin-pagination-info">Page {data.commandes.pageInfo.currentPage + 1} sur {data.commandes.pageInfo.totalPages}</span>
                    <div className="admin-pagination-buttons">
                        <button className="admin-pagination-btn" onClick={() => setPage(p => p - 1)} disabled={!data.commandes.pageInfo.hasPrevious}>← Précédent</button>
                        <button className="admin-pagination-btn" onClick={() => setPage(p => p + 1)} disabled={!data.commandes.pageInfo.hasNext}>Suivant →</button>
                    </div>
                </div>
            )}

            {selectedCommande && detailData?.commande && (
                <div className="admin-modal-overlay" onClick={() => setSelectedCommande(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="admin-modal-header">
                            <h2>Commande #{detailData.commande.numeroCommande}</h2>
                            <button className="admin-modal-close" onClick={() => setSelectedCommande(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <h4 style={{ color: '#c084fc', marginBottom: '0.5rem' }}>Client</h4>
                                    <p style={{ color: '#e5e7eb' }}>{detailData.commande.utilisateur?.prenom} {detailData.commande.utilisateur?.nom}</p>
                                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{detailData.commande.utilisateur?.email}</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#c084fc', marginBottom: '0.5rem' }}>Livraison</h4>
                                    <p style={{ color: '#e5e7eb' }}>{detailData.commande.adresseLivraison}</p>
                                    <p style={{ color: '#9ca3af' }}>{detailData.commande.codePostalLivraison} {detailData.commande.villeLivraison}</p>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid rgba(168,85,247,0.2)', marginTop: '1.5rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700 }}>
                                <span style={{ color: '#9ca3af' }}>Total</span>
                                <span style={{ color: '#fff' }}>{detailData.commande.montantTotal} €</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;