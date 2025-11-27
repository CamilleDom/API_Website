import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { produitsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          produitsAPI.getAll(categoryId),
          categoriesAPI.getAll()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Erreur lors du chargement des produits.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleCategoryChange = (catId) => {
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      setSearchParams({});
    }
  };

  const currentCategory = categories.find(c => c.idCategorie === parseInt(categoryId));

  if (loading) return <Loader message="Chargement des produits..." />;

  return (
    <section className="products-page">
      <div className="products-header">
        <h2>
          {currentCategory ? currentCategory.nomCategorie : 'Tous nos Produits'}
        </h2>
        <span className="products-count">{products.length} produit(s)</span>
      </div>

      {/* Filtres */}
      <div className="products-filters">
        <label>Catégorie :</label>
        <select 
          value={categoryId || ''} 
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.idCategorie} value={cat.idCategorie}>
              {cat.nomCategorie}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}

      {!products.length ? (
        <div className="no-products">
          <p>Aucun produit trouvé dans cette catégorie.</p>
          <button onClick={() => handleCategoryChange('')}>
            Voir tous les produits
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.idProduit} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductsPage;