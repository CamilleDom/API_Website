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

  const [approuverAvis] = useMutation(APPROUVER_AVIS, {
    onCompleted: () => refetch()
  });

  const [rejeterAvis] = useMutation(REJETER_AVIS, {
    onCompleted: () => {
      refetch();
      setSelectedAvis(null);
      setMotifRejet('');
    }
  });

  const [supprimerAvis] = useMutation(SUPPRIMER_AVIS, {
    onCompleted: () => refetch()
  });

  const handleApprouver = async (id) => {
    if (window.confirm('Approuver cet avis ?')) {
      await approuverAvis({ variables: { id: id.toString() } });
    }
  };

  const handleRejeter = async () => {
    if (selectedAvis) {
      await rejeterAvis({ 
        variables: { 
          id: selectedAvis.toString(), 
          motif: motifRejet || null 
        } 
      });
    }
  };

  const handleSupprimer = async (id) => {
    if (window.confirm('Supprimer définitivement cet avis ?')) {
      await supprimerAvis({ variables: { id: id.toString() } });
    }
  };

  const avisData = activeTab === 'en_attente' 
    ? data?.avisEnAttente 
    : data?.avisParStatut;

  const renderStars = (note) => {
    return '⭐'.repeat(note) + '☆'.repeat(5 - note);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Modération des Avis</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {[
          { key: 'en_attente', label: 'En attente', color: 'yellow' },
          { key: 'approuve', label: 'Approuvés', color: 'green' },
          { key: 'rejete', label: 'Rejetés', color: 'red' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(0); }}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === tab.key
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Liste des avis */}
      <div className="space-y-4">
        {avisData?.content?.map((avis) => (
          <div 
            key={avis.idAvis}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-lg">{renderStars(avis.note)}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(avis.dateAvis).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                
                <p className="text-gray-800 mb-3">{avis.commentaire}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>👤 {avis.utilisateur?.prenom} {avis.utilisateur?.nom}</span>
                  <span>|</span>
                  <span>📧 {avis.utilisateur?.email}</span>
                  <span>|</span>
                  <span>🛍️ {avis.produit?.nomProduit}</span>
                </div>
              </div>

              {/* Actions */}
              {activeTab === 'en_attente' && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleApprouver(avis.idAvis)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    ✓ Approuver
                  </button>
                  <button
                    onClick={() => setSelectedAvis(avis.idAvis)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    ✗ Rejeter
                  </button>
                </div>
              )}

              {activeTab !== 'en_attente' && (
                <button
                  onClick={() => handleSupprimer(avis.idAvis)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Supprimer"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}

        {avisData?.content?.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl">📭</span>
            <p className="mt-2">Aucun avis dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {avisData?.pageInfo && avisData.content?.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Page {avisData.pageInfo.currentPage + 1} sur {avisData.pageInfo.totalPages}
            ({avisData.pageInfo.totalElements} avis)
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={!avisData.pageInfo.hasPrevious}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              ← Précédent
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!avisData.pageInfo.hasNext}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Modal Rejet */}
      {selectedAvis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Rejeter l'avis</h3>
            <textarea
              value={motifRejet}
              onChange={(e) => setMotifRejet(e.target.value)}
              placeholder="Motif du rejet (optionnel)"
              className="w-full border rounded-lg p-3 h-32 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => { setSelectedAvis(null); setMotifRejet(''); }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleRejeter}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAvisPage;