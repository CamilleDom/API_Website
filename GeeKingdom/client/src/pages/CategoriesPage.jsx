import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../services/api';
import Loader from '../components/Loader';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data);
      } catch (err) {
        setError('Erreur lors du chargement des catégories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Loader message="Chargement des catégories..." />;
  
  if (error) return <p className="error-message">{error}</p>;

  if (!categories.length) {
    return (
      <section>
        <h2>Catégories</h2>
        <p>Aucune catégorie trouvée.</p>
      </section>
    );
  }

  return (
    <section className="categories-page">
      <h2>Nos Catégories</h2>
      
      <div className="categories-list">
        {categories.map(cat => (
          <Link 
            key={cat.idCategorie} 
            to={`/products?category=${cat.idCategorie}`}
            className="category-item"
          >
            <div className="category-content">
              {cat.imageUrl && (
                <img src={cat.imageUrl} alt={cat.nomCategorie} />
              )}
              <div className="category-info">
                <h3>{cat.nomCategorie}</h3>
                {cat.description && <p>{cat.description}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoriesPage;