import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        confirmPassword: '',
        telephone: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const { nom, prenom, email, motDePasse, confirmPassword } = formData;

        if (!nom || !prenom || !email || !motDePasse || !confirmPassword) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (motDePasse !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        if (motDePasse.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        setLoading(true);

        const result = await register({
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            motDePasse: formData.motDePasse,
            telephone: formData.telephone,
        });

        if (result.success) {
            setSuccess('Compte créé avec succès ! Redirection vers la connexion...');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.error || 'Erreur lors de la création du compte.');
        }

        setLoading(false);
    };

    return (
        <section className="auth-page">
            <div className="auth-container">
                <h2>Inscription</h2>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-row">
                        <input
                            type="text"
                            name="prenom"
                            placeholder="Prénom *"
                            value={formData.prenom}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="nom"
                            placeholder="Nom *"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="telephone"
                        placeholder="Téléphone"
                        value={formData.telephone}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="motDePasse"
                        placeholder="Mot de passe *"
                        value={formData.motDePasse}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmer le mot de passe *"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Création...' : 'Créer un compte'}
                    </button>
                </form>

                <p className="auth-link">
                    Déjà inscrit ? <Link to="/login">Connectez-vous ici</Link>
                </p>
            </div>
        </section>
    );
}

export default RegisterPage;