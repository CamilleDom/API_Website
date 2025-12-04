import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COMMANDES, GET_COMMANDE } from '../../graphql/queries';
import { CHANGER_STATUT_COMMANDE, ANNULER_COMMANDE } from '../../graphql/mutations';

const AdminOrdersPage = () => {
  const [page, setPage] = useState(0);
  const [filterStatut, setFilterStatut] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);

  const { data, loading, refetch } = useQuery(GET_COMMANDES, {
    variables: { 
      page, 
      size: 15,
      filter: filterStatut ? { statut: filterStatut } : null
    }
  });

  const { data: detailData } = useQuery(GET_COMMANDE, {
    variables: { id: selectedCommande?.toString() },
    skip: !selectedCommande
  });

  const [changerStatut] = useMutation(CHANGER_STATUT_COMMANDE, {
    onCompleted: () => refetch()
  });

  const [annulerCommande] = useMutation(ANNULER_COMMANDE, {
    onCompleted: () => refetch()
  });

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
    { value: 'annulee', label: 'Annulée' },
  ];

  const getStatusBadge = (statut) => {
    const colors = {
      en_attente: 'bg-yellow-100 text-yellow-800',
      confirmee: 'bg-blue-100 text-blue-800',
      en_preparation: 'bg-indigo-100 text-indigo-800',
      expediee: 'bg-purple-100 text-purple-800',
      livree: 'bg-green-100 text-green-800',
      annulee: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[statut] || 'bg-gray-100'}`}>
        {statut?.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gestion des Commandes</h1>

      {/* Filtres */}
      <div className="flex space-x-2 flex-wrap gap-2">
        {statuts.map((statut) => (
          <button
            key={statut.value || 'all'}
            onClick={() => { setFilterStatut(statut.value); setPage(0); }}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatut === statut.value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {statut.label}
          </button>
        ))}
      </div>

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.commandes?.content?.map((commande) => (
              <tr key={commande.idCommande} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedCommande(commande.idCommande)}
                    className="font-medium text-purple-600 hover:underline"
                  >
                    #{commande.numeroCommande}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-800">{commande.utilisateur?.prenom} {commande.utilisateur?.nom}</p>
                  <p className="text-sm text-gray-500">{commande.utilisateur?.email}</p>
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">{commande.montantTotal} €</td>
                <td className="px-6 py-4">{getStatusBadge(commande.statut)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {commande.dateCommande ? new Date(commande.dateCommande).toLocaleDateString('fr-FR') : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  {commande.statut !== 'annulee' && commande.statut !== 'livree' && (
                    <div className="flex justify-end space-x-2">
                      <select
                        value={commande.statut}
                        onChange={(e) => handleChangerStatut(commande.idCommande, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="en_attente">En attente</option>
                        <option value="confirmee">Confirmée</option>
                        <option value="en_preparation">En préparation</option>
                        <option value="expediee">Expédiée</option>
                        <option value="livree">Livrée</option>
                      </select>
                      <button
                        onClick={() => handleAnnuler(commande.idCommande)}
                        className="text-red-600 hover:text-red-800"
                        title="Annuler"
                      >
                        ✗
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.commandes?.pageInfo && (
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Page {data.commandes.pageInfo.currentPage + 1} sur {data.commandes.pageInfo.totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={!data.commandes.pageInfo.hasPrevious}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              ← Précédent
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!data.commandes.pageInfo.hasNext}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Modal Détail */}
      {selectedCommande && detailData?.commande && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Commande #{detailData.commande.numeroCommande}</h3>
              <button onClick={() => setSelectedCommande(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Client</h4>
                <p>{detailData.commande.utilisateur?.prenom} {detailData.commande.utilisateur?.nom}</p>
                <p className="text-sm text-gray-500">{detailData.commande.utilisateur?.email}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Livraison</h4>
                <p>{detailData.commande.adresseLivraison}</p>
                <p>{detailData.commande.codePostalLivraison} {detailData.commande.villeLivraison}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{detailData.commande.montantTotal} €</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;