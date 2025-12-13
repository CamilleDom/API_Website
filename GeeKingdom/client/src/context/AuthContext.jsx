import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Charger l'utilisateur depuis le localStorage au démarrage
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                // ✅ AMÉLIORATION: Recharger le profil depuis l'API pour avoir les données à jour
                try {
                    const freshProfile = await authAPI.getProfile(parsedUser.id);
                    if (freshProfile && !freshProfile.error) {
                        const updatedUser = { ...parsedUser, ...freshProfile };
                        setUser(updatedUser);
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                } catch (error) {
                    console.log('Impossible de rafraîchir le profil:', error);
                    // Garder les données du localStorage en cas d'erreur
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Connexion
    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);

            if (response.error) {
                throw new Error(response.error);
            }

            const { token: newToken, user: userData } = response;

            // Sauvegarder dans le state et localStorage
            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true, user: userData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Inscription
    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);

            if (response.error) {
                throw new Error(response.error);
            }

            return { success: true, message: response.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Déconnexion
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // ✅ CORRIGÉ: Mettre à jour le profil et recharger les données depuis l'API
    const updateProfile = async (userData) => {
        try {
            if (!user) throw new Error('Non connecté');

            const response = await authAPI.updateProfile(user.id, userData);

            if (response.error) {
                throw new Error(response.error);
            }

            // ✅ AMÉLIORATION: Recharger le profil complet depuis l'API après la mise à jour
            const freshProfile = await authAPI.getProfile(user.id);

            if (freshProfile && !freshProfile.error) {
                // Fusionner avec les données existantes (garder le token, etc.)
                const updatedUser = {
                    ...user,
                    ...freshProfile,
                    // S'assurer que l'id reste correct
                    id: user.id
                };

                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));

                return { success: true, user: updatedUser };
            } else {
                // Fallback: utiliser la réponse de updateProfile
                const updatedUser = { ...user, ...response };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));

                return { success: true, user: updatedUser };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // ✅ NOUVEAU: Fonction pour rafraîchir manuellement le profil
    const refreshProfile = async () => {
        try {
            if (!user) return { success: false, error: 'Non connecté' };

            const freshProfile = await authAPI.getProfile(user.id);

            if (freshProfile && !freshProfile.error) {
                const updatedUser = { ...user, ...freshProfile };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return { success: true, user: updatedUser };
            }

            return { success: false, error: 'Impossible de charger le profil' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Vérifier si l'utilisateur est connecté
    const isAuthenticated = () => {
        return !!token && !!user;
    };

    // Vérifier le rôle de l'utilisateur
    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile, // ✅ NOUVEAU
        isAuthenticated,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};