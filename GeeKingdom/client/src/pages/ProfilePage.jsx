import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSaving(true);

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }

    setSaving(false);
  };

  if (loading) return <Loader message="Chargement du profil..." />;

  return (
    <section className="profile-page">
      <h2>Mon Profil</h2>

      {message.text && (
        <p className={`${message.type}-message`}>{message.text}</p>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3>Informations personnelles</h3>
          <div className="input-row">
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
            />
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
            />
          </div>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            placeholder="Email (non modifiable)"
          />
          <input
            type="tel"
            name="telephone"
            placeholder="Téléphone"
            value={formData.telephone}
            onChange={handleChange}
          />
        </div>

        <div className="form-section">
          <h3>Adresse</h3>
          <input
            type="text"
            name="adresse"
            placeholder="Adresse"
            value={formData.adresse}
            onChange={handleChange}
          />
          <div className="input-row">
            <input
              type="text"
              name="ville"
              placeholder="Ville"
              value={formData.ville}
              onChange={handleChange}
            />
            <input
              type="text"
              name="codePostal"
              placeholder="Code postal"
              value={formData.codePostal}
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            name="pays"
            placeholder="Pays"
            value={formData.pays}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Sauvegarder'}
        </button>
      </form>
    </section>
  );
}

export default ProfilePage;