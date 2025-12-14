import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUITS_ADMIN, GET_CATEGORIES } from '../../graphql/queries';
import { CREATE_PRODUIT, UPDATE_PRODUIT, CHANGER_STATUT_PRODUIT, SUPPRIMER_PRODUIT } from '../../graphql/mutations';

const AdminProductsPage = () => {
    const [page, setPage] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        nomProduit: '', description: '', prix: '', idCategorie: '', marque: '', statut: 'disponible'
    });

    const { data, loading, refetch } = useQuery(GET_PRODUITS_ADMIN, { variables: { page, size: 15 } });
    const { data: categoriesData } = useQuery(GET_CATEGORIES);

    const [createProduit] = useMutation(CREATE_PRODUIT, { onCompleted: () => { refetch(); resetForm(); } });
    const [updateProduit] = useMutation(UPDATE_PRODUIT, { onCompleted: () => { refetch(); resetForm(); } });
    const [changerStatut] = useMutation(CHANGER_STATUT_PRODUIT, { onCompleted: () => refetch() });
    const [supprimerProduit] = useMutation(SUPPRIMER_PRODUIT, { onCompleted: () => refetch() });

    const resetForm = () => {
        setFormData({ nomProduit: '', description: '', prix: '', idCategorie: '', marque: '', statut: 'disponible' });
        setEditingProduct(null);
        setShowModal(false);
    };

    const handleEdit = (produit) => {
        setEditingProduct(produit);
        setFormData({
            nomProduit: produit.nomProduit,
            description: produit.description || '',
            prix: produit.prix.toString(),
            idCategorie: produit.idCategorie?.toString() || '',
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
            await updateProduit({ variables: { id: editingProduct.idProduit.toString(), input } });
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
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Gestion des Produits</h1>
                <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>+ Nouveau Produit</button>
            </div>

            {loading && <div className="admin-loading"><div className="admin-spinner"></div></div>}

            {!loading && (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Produit</th>
                            <th className="text-right">Prix</th>
                            <th>Statut</th>
                            <th className="text-center">Note</th>
                            <th className="text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data?.produits?.content?.map((produit) => (
                            <tr key={produit.idProduit}>
                                <td>
                                    <div className="table-product-cell">
                                        <span className="table-product-name">{produit.nomProduit}</span>
                                        <span className="table-product-sku">{produit.marque || 'Sans marque'}</span>
                                    </div>
                                </td>
                                <td className="text-right" style={{ fontWeight: 600, color: '#fff' }}>{produit.prix} €</td>
                                <td>
                                    <select className="table-select" value={produit.statut} onChange={(e) => handleStatutChange(produit.idProduit, e.target.value)}>
                                        <option value="disponible">Disponible</option>
                                        <option value="rupture">Rupture</option>
                                        <option value="archive">Archivé</option>
                                    </select>
                                </td>
                                <td className="text-center">
                                    <span style={{ color: '#fbbf24' }}>★ {(produit.noteMoyenne || 0).toFixed(1)}</span>
                                    <span style={{ color: '#6b7280', marginLeft: '0.25rem' }}>({produit.nombreAvis || 0})</span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button className="table-action-btn edit" onClick={() => handleEdit(produit)} title="Modifier">✏️</button>
                                        <button className="table-action-btn delete" onClick={() => handleDelete(produit.idProduit)} title="Supprimer">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {data?.produits?.pageInfo && (
                <div className="admin-pagination">
                    <span className="admin-pagination-info">Page {data.produits.pageInfo.currentPage + 1} sur {data.produits.pageInfo.totalPages}</span>
                    <div className="admin-pagination-buttons">
                        <button className="admin-pagination-btn" onClick={() => setPage(p => p - 1)} disabled={!data.produits.pageInfo.hasPrevious}>← Précédent</button>
                        <button className="admin-pagination-btn" onClick={() => setPage(p => p + 1)} disabled={!data.produits.pageInfo.hasNext}>Suivant →</button>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="admin-modal-overlay" onClick={resetForm}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h2>
                            <button className="admin-modal-close" onClick={resetForm}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-modal-body">
                                <div className="admin-form">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Nom du produit *</label>
                                        <input className="admin-form-input" type="text" value={formData.nomProduit} onChange={(e) => setFormData({...formData, nomProduit: e.target.value})} required />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Description</label>
                                        <textarea className="admin-form-textarea" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                                    </div>
                                    <div className="admin-form-row">
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Prix *</label>
                                            <input className="admin-form-input" type="number" step="0.01" value={formData.prix} onChange={(e) => setFormData({...formData, prix: e.target.value})} required />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Marque</label>
                                            <input className="admin-form-input" type="text" value={formData.marque} onChange={(e) => setFormData({...formData, marque: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Catégorie *</label>
                                        <select className="admin-form-input" value={formData.idCategorie} onChange={(e) => setFormData({...formData, idCategorie: e.target.value})} required>
                                            <option value="">Sélectionner une catégorie</option>
                                            {categoriesData?.categories?.map(cat => (
                                                <option key={cat.idCategorie} value={cat.idCategorie}>{cat.nomCategorie}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={resetForm}>Annuler</button>
                                <button type="submit" className="admin-btn admin-btn-primary">{editingProduct ? 'Modifier' : 'Créer'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;