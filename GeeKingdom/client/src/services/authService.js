// Service d'authentification avec gestion d'erreurs améliorée
// Localisation : GeeKingdom/client/src/services/authService.js

const API_BASE_URL = 'http://localhost:8080/api/utilisateurs';

/**
 * Service centralisé pour toutes les opérations utilisateur
 * VERSION AMÉLIORÉE avec meilleure gestion d'erreurs
 */
const authService = {

    /**
     * Inscription d'un nouvel utilisateur
     */
    register: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            // Vérifier si la réponse est vide
            const text = await response.text();
            if (!text) {
                throw new Error('Le serveur a renvoyé une réponse vide');
            }

            const data = JSON.parse(text);

            if (!response.ok) {
                throw new Error(data.error || `Erreur HTTP: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('❌ Erreur inscription:', error);

            // Messages d'erreur plus explicites
            if (error.message === 'Failed to fetch') {
                throw new Error('Impossible de contacter le serveur. Vérifiez que le backend est lancé sur http://localhost:8080');
            }

            throw error;
        }
    },

    /**
     * Connexion d'un utilisateur
     */
    login: async (email, motDePasse) => {
        try {
            console.log('🔐 Tentative de connexion:', { email, url: `${API_BASE_URL}/login` });

            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, motDePasse })
            });

            console.log('📡 Réponse reçue:', response.status, response.statusText);

            // Vérifier si la réponse est vide
            const text = await response.text();
            console.log('📄 Contenu de la réponse:', text);

            if (!text) {
                throw new Error('Le serveur a renvoyé une réponse vide. Vérifiez que le backend est lancé.');
            }

            const data = JSON.parse(text);

            if (!response.ok) {
                throw new Error(data.error || `Erreur HTTP: ${response.status}`);
            }

            // Sauvegarder l'utilisateur dans localStorage
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                console.log('✅ Utilisateur connecté:', data.user.email);
            }

            return data;
        } catch (error) {
            console.error('❌ Erreur connexion:', error);

            // Messages d'erreur plus explicites
            if (error.message === 'Failed to fetch') {
                throw new Error('❌ Impossible de contacter le serveur. Vérifiez que le backend est lancé sur http://localhost:8080');
            }

            if (error.message.includes('Unexpected end of JSON')) {
                throw new Error('❌ Le serveur ne répond pas correctement. Vérifiez les logs du backend.');
            }

            throw error;
        }
    },

    /**
     * Déconnexion
     */
    logout: () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    /**
     * Récupérer l'utilisateur connecté
     */
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Vérifier si un utilisateur est connecté
     */
    isAuthenticated: () => {
        return localStorage.getItem('user') !== null;
    },

    /**
     * Récupérer le profil d'un utilisateur
     */
    getProfile: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile/${userId}`);

            const text = await response.text();
            if (!text) {
                throw new Error('Réponse vide du serveur');
            }

            const data = JSON.parse(text);

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la récupération du profil');
            }

            return data;
        } catch (error) {
            console.error('❌ Erreur récupération profil:', error);
            throw error;
        }
    },

    /**
     * Mettre à jour le profil
     */
    updateProfile: async (userId, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });

            const text = await response.text();
            if (!text) {
                throw new Error('Réponse vide du serveur');
            }

            const data = JSON.parse(text);

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la mise à jour');
            }

            // Mettre à jour localStorage
            if (data.user) {
                const currentUser = authService.getCurrentUser();
                const updatedUser = { ...currentUser, ...data.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            return data;
        } catch (error) {
            console.error('❌ Erreur mise à jour profil:', error);
            throw error;
        }
    },

    /**
     * Changer le mot de passe
     */
    changePassword: async (userId, currentPassword, newPassword) => {
        try {
            const response = await fetch(`${API_BASE_URL}/change-password/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const text = await response.text();
            if (!text) {
                throw new Error('Réponse vide du serveur');
            }

            const data = JSON.parse(text);

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors du changement de mot de passe');
            }

            return data;
        } catch (error) {
            console.error('❌ Erreur changement mot de passe:', error);
            throw error;
        }
    },

    /**
     * Supprimer le compte
     */
    deleteAccount: async (userId, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password })
            });

            const text = await response.text();
            if (!text) {
                throw new Error('Réponse vide du serveur');
            }

            const data = JSON.parse(text);

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la suppression');
            }

            // Déconnexion après suppression
            authService.logout();

            return data;
        } catch (error) {
            console.error('❌ Erreur suppression compte:', error);
            throw error;
        }
    },

    /**
     * Récupérer l'historique des commandes
     */
    getOrderHistory: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${userId}/commandes`);

            const text = await response.text();
            if (!text) {
                throw new Error('Réponse vide du serveur');
            }

            const data = JSON.parse(text);

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la récupération de l\'historique');
            }

            return data;
        } catch (error) {
            console.error('❌ Erreur historique commandes:', error);
            throw error;
        }
    },

    /**
     * Vérifier si un email est déjà utilisé
     */
    checkEmail: async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/check-email?email=${encodeURIComponent(email)}`);

            const text = await response.text();
            if (!text) {
                return false;
            }

            const data = JSON.parse(text);
            return data.exists;
        } catch (error) {
            console.error('❌ Erreur vérification email:', error);
            return false;
        }
    }
};

export default authService;