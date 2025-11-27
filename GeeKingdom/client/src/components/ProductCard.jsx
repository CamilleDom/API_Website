import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  // Gérer les images JSON
  const getImageUrl = () => {
    if (product.imagesJson) {
      try {
        const images = JSON.parse(product.imagesJson);
        return images[0] || '/placeholder.jpg';
      } catch {
        return '/placeholder.jpg';
      }
    }
    return product.image || '/placeholder.jpg';
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.idProduit || product.id}`}>
        <img 
          src={getImageUrl()} 
          alt={product.nomProduit || product.name} 
          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
        />
      </Link>
      
      <div className="product-info">
        <h3>{product.nomProduit || product.name}</h3>
        
        {product.marque && (
          <p className="product-brand">{product.marque}</p>
        )}
        
        <div className="product-rating">
          {product.noteMoyenne > 0 && (
            <>
              {'⭐'.repeat(Math.round(product.noteMoyenne))}
              <span>({product.nombreAvis} avis)</span>
            </>
          )}
        </div>
        
        <p className="product-price">
          {parseFloat(product.prix || product.price).toFixed(2)} €
        </p>
        
        {product.statut === 'rupture' ? (
          <span className="out-of-stock">Rupture de stock</span>
        ) : (
          <button onClick={handleAddToCart} className="btn-add-cart">
            Ajouter au panier
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;