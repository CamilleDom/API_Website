import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
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

    const { email, password } = formData;

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    // Ici, tu peux appeler ton API pour vérifier les identifiants
    // Exemple simulé :
    if (email === 'test@example.com' && password === '123456') {
      setSuccess('Connexion réussie !');
      setTimeout(() => navigate('/'), 1000); // redirection vers l’accueil
    } else {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <section style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Connexion</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
        <button type="submit" style={{ padding: '0.5rem', background: '#222', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Se connecter
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        Pas encore de compte ? <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => navigate('/register')}>Inscrivez-vous ici</span>.
      </p>
    </section>
  );
}

export default LoginPage;
