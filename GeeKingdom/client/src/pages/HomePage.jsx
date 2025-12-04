import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { produitsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import RecommendationsSection from '../components/RecommendationsSection';
import TrendingProducts from '../components/TrendingProducts';

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
        <h1>Bienvenue sur GeeKingdom 👑</h1>
        <p>Découvrez nos meilleurs produits geek 🔥</p>
          {/* Recommandations personnalisées */}
          {user && user.id_utilisateur && (
              <RecommendationsSection
                  userId={user.id_utilisateur}
                  limit={8}
                  title="🎯 Recommandé pour vous"
              />
          )}

          {/* Produits tendance */}
          <TrendingProducts limit={12} />
        <div className="hero-buttons">
          <Link to="/products" className="btn-primary">
            Voir tous les produits
          </Link>
          <Link to="/categories" className="btn-secondary">
            Explorer les catégories
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
                {cat.imageUrl && (
                  <img src={cat.imageUrl} alt={cat.nomCategorie} />
                )}
                <h3>{cat.nomCategorie}</h3>
              </Link>
            ))}
          </div>
          <Link to="/categories" className="see-all">
            Voir toutes les catégories →
          </Link>
        </section>
      )}

      {/* Produits vedettes */}
      {featuredProducts.length > 0 && (
        <section className="home-products">
          <h2>Produits Populaires</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.idProduit} product={product} />
            ))}
          </div>
          <Link to="/products" className="see-all">
            Voir tous les produits →
          </Link>
        </section>
      )}

      {/* Points de retrait */}
      <section className="home-pickup">
        <h2>📍 Points de Retrait</h2>
        <p>Récupérez vos commandes près de chez vous !</p>
        <Link to="/points-retrait" className="btn-primary">
          Trouver un point de retrait
        </Link>
      </section>
    </div>
  );
}

export default HomePage;