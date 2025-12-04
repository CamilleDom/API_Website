// Section complète de recommandations personnalisées
// Localisation : GeeKingdom/client/src/components/RecommendationsSection.jsx

import React, { useState, useEffect } from 'react';
import RecommendationCard from '../components/Recommendationcard';
import recommendationService from '../services/Recommendationservice';
import '../styles/Recommendationssection.css';

/**
 * Section de recommandations avec gestion d'état
 * VERSION CORRIGÉE : useEffect se déclenche à chaque changement d'userId
 * Usage: <RecommendationsSection userId={5} limit={8} title="Recommandé pour vous" />
 */
const RecommendationsSection = ({
                                    userId,
                                    limit = 8,
                                    title = "🎯 Recommandé pour vous",
                                    showScore = true
                                }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 🔍 Log pour debug
        console.log('🔄 RecommendationsSection useEffect déclenché', { userId, limit });

        const fetchRecommendations = async () => {
            if (!userId) {
                console.log('⚠️ Pas d\'userId, arrêt');
                setLoading(false);
                return;
            }

            try {
                console.log('📡 Chargement recommandations pour utilisateur', userId);
                setLoading(true);
                setError(null);

                const data = await recommendationService.getPersonalizedRecommendations(userId, limit);
                console.log('✅ Recommandations reçues:', data.recommendations?.length || 0, 'produits');

                setRecommendations(data.recommendations || []);
            } catch (err) {
                console.error('❌ Erreur recommandations:', err);
                setError('Impossible de charger les recommandations');
            } finally {
                console.log('🏁 Chargement recommandations terminé');
                setLoading(false);
            }
        };

        fetchRecommendations();

        // 🧹 Cleanup : réinitialiser l'état au démontage
        return () => {
            setRecommendations([]);
            setLoading(true);
            setError(null);
        };
    }, [userId, limit]); // ✅ IMPORTANT : Dépendances complètes

    // État de chargement
    if (loading) {
        return (
            <div className="recommendations-section">
                <h2>{title}</h2>
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Chargement de vos recommandations personnalisées...</p>
                </div>
            </div>
        );
    }

    // État d'erreur
    if (error) {
        return (
            <div className="recommendations-section">
                <h2>{title}</h2>
                <div className="error-state">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '16px',
                            padding: '10px 20px',
                            background: '#fff',
                            border: '2px solid #fff',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    // Aucune recommandation
    if (recommendations.length === 0) {
        return (
            <div className="recommendations-section">
                <h2>{title}</h2>
                <div className="empty-state">
                    <span className="empty-icon">🔍</span>
                    <p>Commencez à acheter pour recevoir des recommandations personnalisées !</p>
                </div>
            </div>
        );
    }

    // Affichage des recommandations
    return (
        <div className="recommendations-section">
            <h2>{title}</h2>
            <div className="recommendations-grid">
                {recommendations.map((product) => (
                    <RecommendationCard
                        key={product.idProduit}
                        product={product}
                        showScore={showScore}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecommendationsSection;