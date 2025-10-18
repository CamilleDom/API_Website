import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    // Ici, tu peux appeler ton API pour créer le compte
    // Exemple :
    // fetch('/api/register', { method: 'POST', body: JSON.stringify(formData) })

    setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    // Redirection après 2 secondes
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <section style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Inscription</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          type="text"
          name="fullName"
          placeholder="Nom complet"
          value={formData.fullName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit" style={{ padding: '0.5rem', background: '#222', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Créer un compte
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        Déjà inscrit ? <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => navigate('/login')}>Connectez-vous ici</span>.
      </p>
    </section>
  );
}

export default RegisterPage;
