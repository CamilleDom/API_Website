import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CATEGORIES } from '../../graphql/queries';
import { CREATE_CATEGORIE, UPDATE_CATEGORIE, SUPPRIMER_CATEGORIE } from '../../graphql/mutations';

const AdminCategoriesPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ nom: '', description: '', imageUrl: '' });

    const { data, loading, refetch } = useQuery(GET_CATEGORIES);

    const [createCategorie] = useMutation(CREATE_CATEGORIE, { onCompleted: () => { refetch(); resetForm(); } });
    const [updateCategorie] = useMutation(UPDATE_CATEGORIE, { onCompleted: () => { refetch(); resetForm(); } });
    const [supprimerCategorie] = useMutation(SUPPRIMER_CATEGORIE, {
        onCompleted: (data) => {
            if (data.supprimerCategorie.success) refetch();
            else alert(data.supprimerCategorie.message);
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
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Gestion des Catégories</h1>
                <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>+ Nouvelle Catégorie</button>
            </div>

            {loading && <div className="admin-loading"><div className="admin-spinner"></div></div>}

            {!loading && (
                <div className="admin-cards-grid">
                    {data?.categories?.length === 0 ? (
                        <div className="admin-card">
                            <div className="panel-empty"><span className="empty-icon">📂</span><p>Aucune catégorie</p></div>
                        </div>
                    ) : (
                        data?.categories?.map((categorie) => (
                            <div key={categorie.idCategorie} className="admin-card">
                                <div className="category-card-header">
                                    <h3>{categorie.nomCategorie}</h3>
                                    <span className="admin-badge info">{categorie.produits?.length || 0} produits</span>
                                </div>
                                <p className="category-description">{categorie.description || 'Aucune description'}</p>
                                <p className="category-meta">Créée le {categorie.dateCreation ? new Date(categorie.dateCreation).toLocaleDateString('fr-FR') : '-'}</p>
                                <div className="category-actions">
                                    <button className="admin-btn admin-btn-secondary" onClick={() => handleEdit(categorie)}>✏️ Modifier</button>
                                    <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(categorie.idCategorie)}>🗑️ Supprimer</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showModal && (
                <div className="admin-modal-overlay" onClick={resetForm}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
                            <button className="admin-modal-close" onClick={resetForm}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-modal-body">
                                <div className="admin-form">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Nom *</label>
                                        <input className="admin-form-input" type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required placeholder="Ex: Figurines" />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Description</label>
                                        <textarea className="admin-form-textarea" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Description..." />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">URL de l'image</label>
                                        <input className="admin-form-input" type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
                                    </div>
                                    {formData.imageUrl && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Aperçu :</p>
                                            <img src={formData.imageUrl} alt="Aperçu" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.5rem' }} onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={resetForm}>Annuler</button>
                                <button type="submit" className="admin-btn admin-btn-primary">{editingCategory ? 'Modifier' : 'Créer'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategoriesPage;