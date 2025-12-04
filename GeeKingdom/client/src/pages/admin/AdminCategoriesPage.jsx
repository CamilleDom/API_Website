import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CATEGORIES } from '../../graphql/queries';
import { CREATE_CATEGORIE, UPDATE_CATEGORIE, SUPPRIMER_CATEGORIE } from '../../graphql/mutations';

const AdminCategoriesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    imageUrl: ''
  });

  const { data, loading, refetch } = useQuery(GET_CATEGORIES);

  const [createCategorie] = useMutation(CREATE_CATEGORIE, {
    onCompleted: () => {
      refetch();
      resetForm();
    }
  });

  const [updateCategorie] = useMutation(UPDATE_CATEGORIE, {
    onCompleted: () => {
      refetch();
      resetForm();
    }
  });

  const [supprimerCategorie] = useMutation(SUPPRIMER_CATEGORIE, {
    onCompleted: (data) => {
      if (data.supprimerCategorie.success) {
        refetch();
      } else {
        alert(data.supprimerCategorie.message);
      }
    }
  });

  const resetForm = () => {
    setFormData({ nom: '', description: '', imageUrl: '' });
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleEdit = (categorie) => {
    setEditingCategory(categorie);
    setFormData({
      nom: categorie.nomCategorie,
      description: categorie.description || '',
      imageUrl: categorie.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingCategory) {
      await updateCategorie({
        variables: {
          id: editingCategory.idCategorie.toString(),
          nom: formData.nom,
          description: formData.description || null,
          imageUrl: formData.imageUrl || null
        }
      });
    } else {
      await createCategorie({
        variables: {
          nom: formData.nom,
          description: formData.description || null,
          imageUrl: formData.imageUrl || null
        }
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette catégorie ?')) {
      await supprimerCategorie({ variables: { id: id.toString() } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Catégories</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          + Nouvelle Catégorie
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Grid de catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.categories?.map((categorie) => (
          <div 
            key={categorie.idCategorie}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {categorie.imageUrl ? (
              <img 
                src={categorie.imageUrl} 
                alt={categorie.nomCategorie}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x160?text=Image+non+disponible';
                }}
              />
            ) : (
              <div className="w-full h-40 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-5xl">🏷️</span>
              </div>
            )}
            
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {categorie.nomCategorie}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {categorie.description || 'Aucune description'}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Créée le {categorie.dateCreation ? new Date(categorie.dateCreation).toLocaleDateString('fr-FR') : '-'}
              </p>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(categorie)}
                  className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(categorie.idCategorie)}
                  className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data?.categories?.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl">📂</span>
          <p className="mt-2">Aucune catégorie</p>
        </div>
      )}

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Ex: Figurines"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 h-24"
                  placeholder="Description..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">URL de l'image</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="https://..."
                />
              </div>

              {formData.imageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Aperçu :</p>
                  <img 
                    src={formData.imageUrl} 
                    alt="Aperçu"
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded-lg">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                  {editingCategory ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;