import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

function ProfilePage() {
    const { user, updateProfile, refreshProfile, loading } = useAuth();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        adresse: '',
        ville: '',
        codePostal: '',
        pays: '',
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [saving, setSaving] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // ✅ Charger les données du profil
    useEffect(() => {
        if (user) {
            setFormData({
                nom: user.nom || '',
                prenom: user.prenom || '',
                telephone: user.telephone || '',
                adresse: user.adresse || '',
                ville: user.ville || '',
                codePostal: user.codePostal || '',
                pays: user.pays || 'France',
            });
        }
    }, [user]);

    // ✅ Rafraîchir les données au montage du composant
    useEffect(() => {
        const loadFreshData = async () => {
            if (refreshProfile) {
                setRefreshing(true);
                await refreshProfile();
                setRefreshing(false);
            }
        };
        loadFreshData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setSaving(true);

        try {
            const result = await updateProfile(formData);

            if (result.success) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });

                // ✅ Mettre à jour le formulaire avec les nouvelles données
                if (result.user) {
                    setFormData({
                        nom: result.user.nom || '',
                        prenom: result.user.prenom || '',
                        telephone: result.user.telephone || '',
                        adresse: result.user.adresse || '',
                        ville: result.user.ville || '',
                        codePostal: result.user.codePostal || '',
                        pays: result.user.pays || 'France',
                    });
                }
            } else {
                setMessage({ type: 'error', text: result.error || 'Erreur lors de la mise à jour' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Une erreur est survenue' });
        }

        setSaving(false);

        // Effacer le message après 5 secondes
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    if (loading || refreshing) {
        return <Loader message="Chargement du profil..." />;
    }

    return (
        <section className="profile-page">
            <h2>Mon Profil</h2>

            {message.text && (
                <div className={`profile-message ${message.type}`}>
          <span className="message-icon">
            {message.type === 'success' ? '✅' : '❌'}
          </span>
                    <span className="message-text">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-section">
                    <h3>👤 Informations personnelles</h3>

                    <div className="form-group">
                        <label htmlFor="prenom">Prénom</label>
                        <input
                            type="text"
                            id="prenom"
                            name="prenom"
                            placeholder="Votre prénom"
                            value={formData.prenom}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nom">Nom</label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            placeholder="Votre nom"
                            value={formData.nom}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={user?.email || ''}
                            disabled
                            className="input-disabled"
                            placeholder="Email (non modifiable)"
                        />
                        <span className="field-hint">L'email ne peut pas être modifié</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="telephone">Téléphone</label>
                        <input
                            type="tel"
                            id="telephone"
                            name="telephone"
                            placeholder="Votre numéro de téléphone"
                            value={formData.telephone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>📍 Adresse</h3>

                    <div className="form-group">
                        <label htmlFor="adresse">Adresse</label>
                        <input
                            type="text"
                            id="adresse"
                            name="adresse"
                            placeholder="Numéro et nom de rue"
                            value={formData.adresse}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="ville">Ville</label>
                            <input
                                type="text"
                                id="ville"
                                name="ville"
                                placeholder="Ville"
                                value={formData.ville}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="codePostal">Code postal</label>
                            <input
                                type="text"
                                id="codePostal"
                                name="codePostal"
                                placeholder="Code postal"
                                value={formData.codePostal}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pays">Pays</label>
                        <input
                            type="text"
                            id="pays"
                            name="pays"
                            placeholder="Pays"
                            value={formData.pays}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={saving} className="btn-save">
                        {saving ? (
                            <>
                                <span className="spinner-small"></span>
                                Enregistrement...
                            </>
                        ) : (
                            <>
                                <span className="btn-icon">💾</span>
                                Sauvegarder
                            </>
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default ProfilePage;