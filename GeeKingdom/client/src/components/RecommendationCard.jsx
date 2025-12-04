import React from 'react';
import { Link } from 'react-router-dom';

const RecommendationCard = ({ product, showScore = true }) => {
  if (!product) return null;

  return (
    <Link to={`/product/${product.idProduit}`} className="recommendation-card">
      <div className="card-image">
        <img 
          src={product.imageUrl || '/placeholder.png'} 
          alt={product.nomProduit || 'Produit'}
          onError={(e) => e.target.src = '/placeholder.png'}
        />
      </div>
      <div className="card-content">
        <h4>{product.nomProduit || 'Nom non disponible'}</h4>
        <p className="price">{product.prix || 0} €</p>
        {showScore && product.score && (
          <p className="score">Score: {Math.round(product.score)}%</p>
        )}
      </div>
    </Link>
  );
};

export default RecommendationCard;