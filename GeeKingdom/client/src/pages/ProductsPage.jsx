import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category');

  useEffect(() => {
    const url = category 
      ? `/api/java/products?category=${category}`
      : '/api/java/products';
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Erreur API');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  if (loading) return <p>Chargement des produits...</p>;
  if (!products.length) return <p>Aucun produit trouvé.</p>;

  return (
    <section>
      <h2>Nos Produits</h2>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductsPage;
