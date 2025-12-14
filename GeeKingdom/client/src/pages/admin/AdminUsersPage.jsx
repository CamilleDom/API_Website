import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_UTILISATEURS, SEARCH_UTILISATEURS } from '../../graphql/queries';
import { SUSPENDRE_UTILISATEUR, ACTIVER_UTILISATEUR, CHANGER_ROLE_UTILISATEUR, SUPPRIMER_UTILISATEUR } from '../../graphql/mutations';

const AdminUsersPage = () => {
    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, loading, refetch } = useQuery(GET_UTILISATEURS, {
        variables: { page, size: 15 }
    });

    const { data: searchData } = useQuery(SEARCH_UTILISATEURS, {
        variables: { query: searchQuery },
        skip: searchQuery.length < 2
    });

    const [suspendreUtilisateur] = useMutation(SUSPENDRE_UTILISATEUR, { onCompleted: () => refetch() });
    const [activerUtilisateur] = useMutation(ACTIVER_UTILISATEUR, { onCompleted: () => refetch() });
    const [changerRole] = useMutation(CHANGER_ROLE_UTILISATEUR, { onCompleted: () => refetch() });
    const [supprimerUtilisateur] = useMutation(SUPPRIMER_UTILISATEUR, { onCompleted: () => refetch() });

    const handleSuspendre = async (id) => {
        const motif = window.prompt('Motif de la suspension :');
        if (motif !== null) {
            await suspendreUtilisateur({ variables: { id: id.toString(), motif } });
        }
    };

    const handleActiver = async (id) => {
        await activerUtilisateur({ variables: { id: id.toString() } });
    };

    const handleChangerRole = async (id, newRole) => {
        await changerRole({ variables: { id: id.toString(), role: newRole } });
    };

    const handleSupprimer = async (id) => {
        if (window.confirm('Supprimer définitivement cet utilisateur ?')) {
            await supprimerUtilisateur({ variables: { id: id.toString() } });
        }
    };

    const users = searchQuery.length >= 2 ? searchData?.searchUtilisateurs : data?.utilisateurs?.content;

    const getInitials = (prenom, nom) => `${prenom?.[0] || ''}${nom?.[0] || ''}`.toUpperCase();

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Gestion des Utilisateurs</h1>
                <span style={{ color: '#9ca3af' }}>{data?.utilisateurs?.pageInfo?.totalElements || 0} utilisateurs</span>
            </div>

            <div className="admin-search-bar">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Rechercher par nom, prénom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading && <div className="admin-loading"><div className="admin-spinner"></div></div>}

            {!loading && (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Utilisateur</th>
                            <th>Contact</th>
                            <th>Rôle</th>
                            <th>Statut</th>
                            <th>Inscription</th>
                            <th className="text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users?.map((user) => (
                            <tr key={user.idUtilisateur}>
                                <td>
                                    <div className="table-user-cell">
                                        <div className="table-user-avatar">{getInitials(user.prenom, user.nom)}</div>
                                        <div className="table-user-info">
                                            <span className="table-user-name">{user.prenom} {user.nom}</span>
                                            <span className="table-user-detail">{user.ville || '-'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="table-contact-cell">
                                        <span className="table-contact-email">{user.email}</span>
                                        <span className="table-contact-phone">{user.telephone || '-'}</span>
                                    </div>
                                </td>
                                <td>
                    <span className={`admin-badge ${user.role === 'admin' ? 'purple' : user.role === 'vendeur' ? 'info' : 'success'}`}>
                      {user.role}
                    </span>
                                </td>
                                <td>
                    <span className={`admin-badge ${user.statut === 'actif' ? 'success' : user.statut === 'suspendu' ? 'danger' : 'warning'}`}>
                      {user.statut}
                    </span>
                                </td>
                                <td style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                                    {user.dateInscription ? new Date(user.dateInscription).toLocaleDateString('fr-FR') : '-'}
                                </td>
                                <td>
                                    <div className="table-actions">
                                        {user.statut === 'actif' ? (
                                            <button className="table-action-btn delete" onClick={() => handleSuspendre(user.idUtilisateur)} title="Suspendre">🚫</button>
                                        ) : (
                                            <button className="table-action-btn success" onClick={() => handleActiver(user.idUtilisateur)} title="Activer">✓</button>
                                        )}
                                        <select className="table-select" value={user.role} onChange={(e) => handleChangerRole(user.idUtilisateur, e.target.value)}>
                                            <option value="client">Client</option>
                                            <option value="vendeur">Vendeur</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        {user.role !== 'admin' && (
                                            <button className="table-action-btn delete" onClick={() => handleSupprimer(user.idUtilisateur)} title="Supprimer">🗑️</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {data?.utilisateurs?.pageInfo && searchQuery.length < 2 && (
                <div className="admin-pagination">
                    <span className="admin-pagination-info">Page {data.utilisateurs.pageInfo.currentPage + 1} sur {data.utilisateurs.pageInfo.totalPages}</span>
                    <div className="admin-pagination-buttons">
                        <button className="admin-pagination-btn" onClick={() => setPage(p => p - 1)} disabled={!data.utilisateurs.pageInfo.hasPrevious}>← Précédent</button>
                        <button className="admin-pagination-btn" onClick={() => setPage(p => p + 1)} disabled={!data.utilisateurs.pageInfo.hasNext}>Suivant →</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;