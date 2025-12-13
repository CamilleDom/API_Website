import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { produitsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user?.id_utilisateur;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [products, cats] = await Promise.all([
                    produitsAPI.getAll(),
                    categoriesAPI.getAll()
                ]);

                // Prendre les 4 premiers produits comme "featured"
                setFeaturedProducts(products.slice(0, 4));
                setCategories(cats.slice(0, 6));
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loader message="Chargement de GeeKingdom..." />;

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Bienvenue sur GeeKingdom 👑</h1>
                    <p className="hero-subtitle">Découvrez nos meilleurs produits geek 🔥</p>

                    <div className="hero-buttons">
                        <Link to="/products" className="hero-btn hero-btn-primary">
                            <span className="btn-icon">🛍️</span>
                            <span className="btn-text">Voir tous les produits</span>
                        </Link>
                        <Link to="/categories" className="hero-btn hero-btn-secondary">
                            <span className="btn-icon">📂</span>
                            <span className="btn-text">Explorer les catégories</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Points de Retrait Section */}
            <section className="pickup-section">
                <div className="pickup-content">
                    <div className="pickup-icon">📍</div>
                    <div className="pickup-info">
                        <h2>Points de Retrait</h2>
                        <p>Récupérez vos commandes près de chez vous !</p>
                    </div>
                    <Link to="/points-retrait" className="hero-btn hero-btn-accent">
                        <span className="btn-icon">🗺️</span>
                        <span className="btn-text">Trouver un point de retrait</span>
                    </Link>
                </div>
            </section>

            {/* Catégories */}
            {categories.length > 0 && (
                <section className="home-categories">
                    <h2>Nos Catégories</h2>
                    <div className="categories-grid">
                        {categories.map(cat => (
                            <Link
                                key={cat.idCategorie}
                                to={`/products?category=${cat.idCategorie}`}
                                className="category-card"
                            >
                                <div className="category-icon">
                                    {cat.icone || '📦'}
                                </div>
                                <h3>{cat.nomCategorie}</h3>
                                <p>{cat.description || 'Découvrir la catégorie'}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Produits à la une */}
            {featuredProducts.length > 0 && (
                <section className="featured-products">
                    <h2>Produits à la une ⭐</h2>
                    <div className="products-grid">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.idProduit} product={product} />
                        ))}
                    </div>
                    <div className="section-footer">
                        <Link to="/products" className="hero-btn hero-btn-secondary">
                            <span className="btn-text">Voir plus de produits</span>
                            <span className="btn-icon">→</span>
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}

export default HomePage;