import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`/api/java/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Produit introuvable');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement du produit...</p>;
  if (!product) return <p>Produit introuvable.</p>;

  return (
    <section>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} style={{ width: '300px' }} />
      <p>{product.description}</p>
      <p><strong>{product.price} €</strong></p>
      <button onClick={() => addToCart(product)}>Ajouter au panier</button>
    </section>
  );
}

export default ProductDetailPage;
