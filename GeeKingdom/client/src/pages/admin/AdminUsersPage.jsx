import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_UTILISATEURS, SEARCH_UTILISATEURS } from '../../graphql/queries';
import { 
  SUSPENDRE_UTILISATEUR, 
  ACTIVER_UTILISATEUR, 
  CHANGER_ROLE_UTILISATEUR,
  SUPPRIMER_UTILISATEUR 
} from '../../graphql/mutations';

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

  const [suspendreUtilisateur] = useMutation(SUSPENDRE_UTILISATEUR, {
    onCompleted: () => refetch()
  });

  const [activerUtilisateur] = useMutation(ACTIVER_UTILISATEUR, {
    onCompleted: () => refetch()
  });

  const [changerRole] = useMutation(CHANGER_ROLE_UTILISATEUR, {
    onCompleted: () => refetch()
  });

  const [supprimerUtilisateur] = useMutation(SUPPRIMER_UTILISATEUR, {
    onCompleted: () => refetch()
  });

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
    if (window.confirm(`Changer le rôle en ${newRole} ?`)) {
      await changerRole({ variables: { id: id.toString(), role: newRole } });
    }
  };

  const handleSupprimer = async (id) => {
    if (window.confirm('Supprimer définitivement cet utilisateur ?')) {
      await supprimerUtilisateur({ variables: { id: id.toString() } });
    }
  };

  const users = searchQuery.length >= 2 
    ? searchData?.searchUtilisateurs 
    : data?.utilisateurs?.content;

  const getStatusBadge = (statut) => {
    const styles = {
      actif: 'bg-green-100 text-green-800',
      inactif: 'bg-gray-100 text-gray-800',
      suspendu: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[statut] || styles.inactif}`}>
        {statut}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      vendeur: 'bg-blue-100 text-blue-800',
      client: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role] || styles.client}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
        <div className="text-gray-500">
          {data?.utilisateurs?.pageInfo?.totalElements || 0} utilisateurs
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="🔍 Rechercher par nom, prénom ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscription</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users?.map((user) => (
              <tr key={user.idUtilisateur} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                      {user.prenom?.[0]}{user.nom?.[0]}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">{user.prenom} {user.nom}</p>
                      <p className="text-sm text-gray-500">{user.ville}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-800">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.telephone}</p>
                </td>
                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-4">{getStatusBadge(user.statut)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.dateInscription ? new Date(user.dateInscription).toLocaleDateString('fr-FR') : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    {user.statut === 'actif' ? (
                      <button
                        onClick={() => handleSuspendre(user.idUtilisateur)}
                        className="text-red-600 hover:text-red-800"
                        title="Suspendre"
                      >
                        🚫
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActiver(user.idUtilisateur)}
                        className="text-green-600 hover:text-green-800"
                        title="Activer"
                      >
                        ✓
                      </button>
                    )}
                    
                    <select
                      value={user.role}
                      onChange={(e) => handleChangerRole(user.idUtilisateur, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="client">Client</option>
                      <option value="vendeur">Vendeur</option>
                      <option value="admin">Admin</option>
                    </select>

                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleSupprimer(user.idUtilisateur)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.utilisateurs?.pageInfo && searchQuery.length < 2 && (
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Page {data.utilisateurs.pageInfo.currentPage + 1} sur {data.utilisateurs.pageInfo.totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={!data.utilisateurs.pageInfo.hasPrevious}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              ← Précédent
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!data.utilisateurs.pageInfo.hasNext}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;