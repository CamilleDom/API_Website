// Carrousel de produits similaires pour page produit
// Localisation : GeeKingdom/client/src/components/SimilarProducts.jsx

import React, { useState, useEffect } from 'react';
import RecommendationCard from '../components/Recommendationcard';
import recommendationService from '../services/Recommendationservice';
import '../styles/Similarproducts.css';
/**
 * Carrousel de produits similaires
 * VERSION CORRIGÉE : useEffect se déclenche à chaque changement de productId
 * Usage: <SimilarProducts productId={15} limit={6} />
 */
const SimilarProducts = ({ productId, limit = 6 }) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 🔍 Log pour debug
        console.log('🔄 SimilarProducts useEffect déclenché', { productId, limit });

        const fetchSimilarProducts = async () => {
            if (!productId) {
                console.log('⚠️ Pas de productId, arrêt');
                setLoading(false);
                return;
            }

            try {
                console.log('📡 Chargement produits similaires pour produit', productId);
                setLoading(true);
                setError(null);

                const data = await recommendationService.getSimilarProducts(productId, limit);
                console.log('✅ Produits similaires reçus:', data.similarProducts?.length || 0, 'produits');

                setSimilarProducts(data.similarProducts || []);
            } catch (err) {
                console.error('❌ Erreur produits similaires:', err);
                setError('Impossible de charger les produits similaires');
            } finally {
                console.log('🏁 Chargement produits similaires terminé');
                setLoading(false);
            }
        };

        fetchSimilarProducts();

        // 🧹 Cleanup : réinitialiser l'état au démontage
        return () => {
            setSimilarProducts([]);
            setLoading(true);
            setError(null);
        };
    }, [productId, limit]); // ✅ IMPORTANT : Dépendances complètes

    if (loading) {
        return (
            <div className="similar-products-section">
                <h3>Les clients ont aussi aimé</h3>
                <div className="loading-carousel">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error || similarProducts.length === 0) {
        return null; // Ne rien afficher si erreur ou pas de produits
    }

    return (
        <div className="similar-products-section">
            <h3>
                <span className="icon">🔥</span>
                Les clients qui ont acheté ce produit ont aussi aimé
            </h3>

            <div className="similar-products-carousel">
                {similarProducts.map((product) => (
                    <RecommendationCard
                        key={product.idProduit}
                        product={product}
                        showScore={false}
                    />
                ))}
            </div>

            {similarProducts.length > 3 && (
                <div className="scroll-hint">
                    <span>← Faites défiler pour voir plus →</span>
                </div>
            )}
        </div>
    );
};

export default SimilarProducts;