import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI, produitsAPI } from '../services/api';
import Loader from '../components/Loader';

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [productCounts, setProductCounts] = useState({});
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesAPI.getAll();
                setCategories(data);

                // Fetch all products to count them
                const products = await produitsAPI.getAll();
                setAllProducts(products);

                // Count products for each category
                const counts = {};
                data.forEach(cat => {
                    // Count products that match this category
                    const categoryProducts = products.filter(
                        product => product.idCategorie === cat.idCategorie
                    );
                    counts[cat.idCategorie] = categoryProducts.length;
                });

                setProductCounts(counts);
            } catch (err) {
                setError('Erreur lors du chargement des catégories.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Parse image URL from JSON if needed
    const getImageUrl = (category) => {
        if (category.imageUrl) {
            try {
                // If imageUrl is a JSON string
                if (category.imageUrl.startsWith('[') || category.imageUrl.startsWith('{')) {
                    const images = JSON.parse(category.imageUrl);
                    return Array.isArray(images) ? images[0] : images;
                }
                return category.imageUrl;
            } catch {
                return category.imageUrl;
            }
        }
        // Default placeholder based on category name
        return `/placeholder-category.jpg`;
    };

    // Get category icon based on name
    const getCategoryIcon = (categoryName) => {
        const icons = {
            'consoles': '🎮',
            'jeux vidéo': '🎯',
            'jeux': '🎯',
            'accessoires': '🎧',
            'pc gaming': '💻',
            'figurines': '🎨',
            'cartes': '🃏',
            'retro': '👾',
            'merchandising': '👕',
            'mangas': '📚',
            'livres': '📖',
            'gaming': '🕹️',
            'art': '🎨',
            'société': '🎯',
            'création': '📦',
        };

        const name = categoryName.toLowerCase();
        for (const [key, icon] of Object.entries(icons)) {
            if (name.includes(key)) {
                return icon;
            }
        }
        return '📦'; // Default icon
    };

    if (loading) return <Loader message="Chargement des catégories..." />;

    if (error) return <p className="error-message">{error}</p>;

    if (!categories.length) {
        return (
            <section className="categories-page">
                <div className="page-header">
                    <h2>Nos Catégories</h2>
                </div>
                <div className="no-categories">
                    <div className="no-categories-icon">📂</div>
                    <h3>Aucune catégorie disponible</h3>
                    <p>Les catégories seront bientôt ajoutées</p>
                </div>
            </section>
        );
    }

    // Calculate stats
    const totalProducts = allProducts.length;
    const activeCategories = categories.filter(
        c => (productCounts[c.idCategorie] || 0) > 0
    ).length;

    return (
        <section className="categories-page">
            <div className="page-header">
                <h2>Explorez nos Catégories</h2>
                <p className="page-subtitle">
                    Découvrez notre sélection de {categories.length} catégories geek
                </p>
            </div>

            <div className="categories-grid">
                {categories.map(category => {
                    const productCount = productCounts[category.idCategorie] || 0;
                    const icon = getCategoryIcon(category.nomCategorie);

                    return (
                        <Link
                            key={category.idCategorie}
                            to={`/products?category=${category.idCategorie}`}
                            className="category-card"
                        >
                            {/* Category Image */}
                            <div className="category-image-container">
                                <img
                                    src={getImageUrl(category)}
                                    alt={category.nomCategorie}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-category.jpg';
                                    }}
                                />
                                <div className="category-overlay">
                                    <span className="category-icon">{icon}</span>
                                </div>
                            </div>

                            {/* Category Info */}
                            <div className="category-info">
                                <h3>{category.nomCategorie}</h3>

                                {category.description && (
                                    <p className="category-description">
                                        {category.description.length > 100
                                            ? `${category.description.substring(0, 100)}...`
                                            : category.description}
                                    </p>
                                )}

                                <div className="category-footer">
                  <span className="product-count">
                    {productCount} produit{productCount !== 1 ? 's' : ''}
                  </span>
                                    <span className="view-category">
                    Voir les produits →
                  </span>
                                </div>
                            </div>

                            {/* Hover Effect Badge */}
                            <div className="category-badge">
                                <span>{icon}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Stats */}
            <div className="categories-stats">
                <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <div className="stat-info">
                        <p className="stat-value">{categories.length}</p>
                        <p className="stat-label">Catégories</p>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🎮</span>
                    <div className="stat-info">
                        <p className="stat-value">{totalProducts}</p>
                        <p className="stat-label">Produits Total</p>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">⭐</span>
                    <div className="stat-info">
                        <p className="stat-value">{activeCategories}</p>
                        <p className="stat-label">Catégories Actives</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CategoriesPage;