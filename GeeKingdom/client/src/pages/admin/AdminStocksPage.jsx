import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_STOCKS, GET_STOCKS_EN_ALERTE } from '../../graphql/queries';
import { APPROVISIONNER_STOCK, AJUSTER_STOCK, MODIFIER_SEUIL_ALERTE } from '../../graphql/mutations';

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

  const [modifierSeuil] = useMutation(MODIFIER_SEUIL_ALERTE, {
    onCompleted: () => refetch()
  });

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
    await modifierSeuil({
      variables: {
        idProduit,
        seuil: parseInt(nouveauSeuil)
      }
    });
  };

  const displayedStocks = showAlertsOnly 
    ? alertesData?.stocksEnAlerte?.map(a => ({ ...a.stock, produit: a.produit, alertLevel: a.alertLevel }))
    : stocksData?.stocks;

  const getStockStatus = (stock) => {
    if (stock.quantiteDisponible === 0) {
      return { label: 'Rupture', color: 'red', icon: '🔴' };
    }
    if (stock.quantiteDisponible <= stock.seuilAlerte) {
      return { label: 'Alerte', color: 'orange', icon: '🟠' };
    }
    return { label: 'OK', color: 'green', icon: '🟢' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Stocks</h1>
        <button
          onClick={() => setShowAlertsOnly(!showAlertsOnly)}
          className={`px-4 py-2 rounded-lg transition ${
            showAlertsOnly 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {showAlertsOnly ? '⚠️ Alertes uniquement' : '📋 Voir tout'}
        </button>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-semibold">Stock OK</p>
          <p className="text-2xl font-bold text-green-600">
            {stocksData?.stocks?.filter(s => s.quantiteDisponible > s.seuilAlerte).length || 0}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-800 font-semibold">En alerte</p>
          <p className="text-2xl font-bold text-orange-600">
            {alertesData?.stocksEnAlerte?.length || 0}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">En rupture</p>
          <p className="text-2xl font-bold text-red-600">
            {stocksData?.stocks?.filter(s => s.quantiteDisponible === 0).length || 0}
          </p>
        </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Disponible</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Réservé</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Seuil</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedStocks?.map((stock) => {
              const status = getStockStatus(stock);
              return (
                <tr key={stock.idStock} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{stock.produit?.nomProduit}</p>
                    <p className="text-sm text-gray-500">{stock.emplacement || 'Non défini'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center space-x-1">
                      <span>{status.icon}</span>
                      <span>{status.label}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold ${
                      stock.quantiteDisponible === 0 ? 'text-red-600' :
                      stock.quantiteDisponible <= stock.seuilAlerte ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {stock.quantiteDisponible}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {stock.quantiteReservee}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      defaultValue={stock.seuilAlerte}
                      onBlur={(e) => {
                        if (e.target.value !== stock.seuilAlerte.toString()) {
                          handleModifierSeuil(stock.idProduit, e.target.value);
                        }
                      }}
                      className="w-16 text-center border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedStock(stock)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      + Approvisionner
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {displayedStocks?.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl">📦</span>
          <p className="mt-2">Aucun stock à afficher</p>
        </div>
      )}

      {/* Modal Approvisionnement */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Approvisionner: {selectedStock.produit?.nomProduit}
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Stock actuel: <span className="font-bold">{selectedStock.quantiteDisponible}</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Quantité à ajouter</label>
              <input
                type="number"
                value={quantiteAppro}
                onChange={(e) => setQuantiteAppro(e.target.value)}
                min="1"
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Ex: 50"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Commentaire (optionnel)</label>
              <input
                type="text"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Ex: Réapprovisionnement fournisseur"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedStock(null);
                  setQuantiteAppro('');
                  setCommentaire('');
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleApprovisionner}
                disabled={!quantiteAppro || quantiteAppro <= 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
              >
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