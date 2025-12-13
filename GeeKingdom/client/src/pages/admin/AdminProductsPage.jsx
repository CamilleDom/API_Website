import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUITS_ADMIN, GET_CATEGORIES } from '../../graphql/queries';
import { 
  CREATE_PRODUIT, 
  UPDATE_PRODUIT, 
  CHANGER_STATUT_PRODUIT, 
  SUPPRIMER_PRODUIT 
} from '../../graphql/mutations';

const AdminProductsPage = () => {
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nomProduit: '',
    description: '',
    prix: '',
    idCategorie: '',
    marque: '',
    statut: 'disponible'
  });

  const { data, loading, refetch } = useQuery(GET_PRODUITS_ADMIN, {
    variables: { page, size: 15 }
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  const [createProduit] = useMutation(CREATE_PRODUIT, {
    onCompleted: () => {
      refetch();
      resetForm();
    }
  });

  const [updateProduit] = useMutation(UPDATE_PRODUIT, {
    onCompleted: () => {
      refetch();
      resetForm();
    }
  });

  const [changerStatut] = useMutation(CHANGER_STATUT_PRODUIT, {
    onCompleted: () => refetch()
  });

  const [supprimerProduit] = useMutation(SUPPRIMER_PRODUIT, {
    onCompleted: () => refetch()
  });

  const resetForm = () => {
    setFormData({
      nomProduit: '',
      description: '',
      prix: '',
      idCategorie: '',
      marque: '',
      statut: 'disponible'
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleEdit = (produit) => {
    setEditingProduct(produit);
    setFormData({
      nomProduit: produit.nomProduit,
      description: produit.description || '',
      prix: produit.prix.toString(),
      idCategorie: produit.idCategorie.toString(),
      marque: produit.marque || '',
      statut: produit.statut
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const input = {
      nomProduit: formData.nomProduit,
      description: formData.description,
      prix: parseFloat(formData.prix),
      idCategorie: parseInt(formData.idCategorie),
      marque: formData.marque,
      statut: formData.statut
    };

    if (editingProduct) {
      await updateProduit({
        variables: { id: editingProduct.idProduit.toString(), input }
      });
    } else {
      await createProduit({ variables: { input } });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      await supprimerProduit({ variables: { id: id.toString() } });
    }
  };

  const handleStatutChange = async (id, newStatut) => {
    await changerStatut({ variables: { id: id.toString(), statut: newStatut } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Produits</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          + Nouveau Produit
        </button>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.produits?.content?.map((produit) => (
              <tr key={produit.idProduit} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-800">{produit.nomProduit}</p>
                  <p className="text-sm text-gray-500">{produit.marque}</p>
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">{produit.prix} €</td>
                <td className="px-6 py-4">
                  <select
                    value={produit.statut}
                    onChange={(e) => handleStatutChange(produit.idProduit, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="rupture">Rupture</option>
                    <option value="archive">Archivé</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className="text-yellow-500">
                    {'⭐'.repeat(Math.round(produit.noteMoyenne || 0))}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">({produit.nombreAvis || 0})</span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(produit)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(produit.idProduit)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.produits?.pageInfo && (
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Page {data.produits.pageInfo.currentPage + 1} sur {data.produits.pageInfo.totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={!data.produits.pageInfo.hasPrevious}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              ← Précédent
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!data.produits.pageInfo.hasNext}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Nom du produit *</label>
                <input
                  type="text"
                  value={formData.nomProduit}
                  onChange={(e) => setFormData({...formData, nomProduit: e.target.value})}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Prix *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.prix}
                    onChange={(e) => setFormData({...formData, prix: e.target.value})}
                    required
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Marque</label>
                  <input
                    type="text"
                    value={formData.marque}
                    onChange={(e) => setFormData({...formData, marque: e.target.value})}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Catégorie *</label>
                <select
                  value={formData.idCategorie}
                  onChange={(e) => setFormData({...formData, idCategorie: e.target.value})}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoriesData?.categories?.map(cat => (
                    <option key={cat.idCategorie} value={cat.idCategorie}>
                      {cat.nomCategorie}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                  {editingProduct ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;