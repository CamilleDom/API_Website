// Grille de produits tendance
// Localisation : GeeKingdom/client/src/components/TrendingProducts.jsx

import React, { useState, useEffect } from 'react';
import RecommendationCard from '../components/Recommendationcard';
import recommendationService from '../services/Recommendationservice';
import '../styles/Trendingproducts.css';

/**
 * Grille de produits tendance avec badges top 3
 * VERSION CORRIGÉE : useEffect se déclenche à chaque changement de limit
 * Usage: <TrendingProducts limit={12} />
 */
const TrendingProducts = ({ limit = 12 }) => {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 🔍 Log pour debug
        console.log('🔄 TrendingProducts useEffect déclenché', { limit });

        const fetchTrendingProducts = async () => {
            try {
                console.log('📡 Chargement produits tendance');
                setLoading(true);
                setError(null);

                const data = await recommendationService.getTrendingProducts(limit);
                console.log('✅ Tendances reçues:', data.trending?.length || 0, 'produits');

                setTrendingProducts(data.trending || []);
            } catch (err) {
                console.error('❌ Erreur produits tendance:', err);
                setError('Impossible de charger les produits tendance');
            } finally {
                console.log('🏁 Chargement tendances terminé');
                setLoading(false);
            }
        };

        fetchTrendingProducts();

        // 🧹 Cleanup : réinitialiser l'état au démontage
        return () => {
            setTrendingProducts([]);
            setLoading(true);
            setError(null);
        };
    }, [limit]); // ✅ IMPORTANT : Dépendance sur limit

    if (loading) {
        return (
            <div className="trending-section">
                <h2>🔥 Tendances du moment</h2>
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Chargement des produits les plus populaires...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="trending-section">
                <h2>🔥 Tendances du moment</h2>
                <div className="error-state">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '16px',
                            padding: '10px 20px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
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

    if (trendingProducts.length === 0) {
        return null;
    }

    return (
        <div className="trending-section">
            <div className="trending-header">
                <h2>
                    <span className="fire-icon">🔥</span>
                    Tendances du moment
                </h2>
                <p className="trending-subtitle">
                    Les produits les plus populaires chez nos clients
                </p>
            </div>

            <div className="trending-grid">
                {trendingProducts.map((product, index) => (
                    <div key={product.idProduit} className="trending-item">
                        {/* Badges top 3 */}
                        {index < 3 && (
                            <div className={`position-badge badge-${index + 1}`}>
                                #{index + 1}
                            </div>
                        )}
                        <RecommendationCard
                            product={product}
                            showScore={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingProducts;