import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { produitsAPI, avisAPI, stocksAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import Loader from '../components/Loader';
import SimilarProducts from '../components/SimilarProducts';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productData, reviewsData, stockData] = await Promise.all([
        produitsAPI.getById(id),
        avisAPI.getByProduit(id),
        stocksAPI.getByProduit(id).catch(() => null)
      ]);
      
      setProduct(productData);
      setReviews(reviewsData);
      setStock(stockData);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const getImages = () => {
    if (product?.imagesJson) {
      try {
        return JSON.parse(product.imagesJson);
      } catch {
        return ['/placeholder.jpg'];
      }
    }
    return ['/placeholder.jpg'];
  };

  if (loading) return <Loader message="Chargement du produit..." />;
  
  if (!product) {
    return (
      <section className="product-not-found">
        <h2>Produit introuvable</h2>
        <p>Le produit que vous recherchez n'existe pas.</p>
        <Link to="/products">Retour aux produits</Link>
      </section>
    );
  }

  const images = getImages();
  const isAvailable = product.statut === 'disponible' && stock?.quantiteDisponible > 0;

  return (
    <section className="product-detail">
      <div className="product-detail-main">
        {/* Images */}
        <div className="product-images">
          <img 
            src={images[0]} 
            alt={product.nomProduit}
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((img, index) => (
                <img key={index} src={img} alt={`${product.nomProduit} ${index + 1}`} />
              ))}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="product-info">
          <h1>{product.nomProduit}</h1>
          
          {product.marque && (
            <p className="product-brand">Marque: {product.marque}</p>
          )}

          <div className="product-rating">
            {product.noteMoyenne > 0 ? (
              <>
                {'⭐'.repeat(Math.round(product.noteMoyenne))}
                <span>({product.nombreAvis} avis)</span>
              </>
            ) : (
              <span>Aucun avis pour le moment</span>
            )}
          </div>

          <p className="product-price">
            {parseFloat(product.prix).toFixed(2)} €
          </p>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || 'Pas de description disponible.'}</p>
          </div>

          {product.poids && (
            <p className="product-weight">Poids: {product.poids} kg</p>
          )}

          {product.dimensions && (
            <p className="product-dimensions">Dimensions: {product.dimensions}</p>
          )}

          {/* Stock */}
          <div className="product-stock">
            {isAvailable ? (
              <>
                <span className="in-stock">
                  ✓ En stock ({stock?.quantiteDisponible} disponible(s))
                </span>
                
                <div className="product-actions">
                  <div className="quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                  
                  <button onClick={handleAddToCart} className="btn-add-cart">
                    Ajouter au panier
                  </button>

                </div>
              </>
            ) : (
              <span className="out-of-stock">✗ Rupture de stock</span>
            )}
          </div>
        </div>
      </div>

      {/* Avis */}
      <div className="product-reviews">
        <h2>Avis clients ({reviews.length})</h2>
        
        <ReviewForm idProduit={id} onReviewAdded={fetchData} />

        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map(review => (
              <ReviewCard key={review.idAvis} review={review} onUpdate={fetchData} />
            ))}
          </div>
        ) : (
          <p>Aucun avis pour ce produit.</p>
        )}

          <SimilarProducts productId={parseInt(id)} limit={6} />
      </div>
    </section>
  );
}

export default ProductDetailPage;