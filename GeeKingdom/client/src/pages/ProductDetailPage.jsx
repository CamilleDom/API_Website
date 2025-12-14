import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { produitsAPI, avisAPI, stocksAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import '../styles/Productdetailpage.css';

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Review form state
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewHover, setReviewHover] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

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
            setReviews(reviewsData || []);
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

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        const maxQty = stock?.quantiteDisponible || 99;
        if (newQty >= 1 && newQty <= maxQty) {
            setQuantity(newQty);
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/connexion', { state: { from: `/produit/${id}` } });
            return;
        }
        if (!reviewComment.trim()) return;

        setSubmittingReview(true);
        try {
            await avisAPI.create({
                idProduit: parseInt(id),
                note: reviewRating,
                commentaire: reviewComment
            });
            setReviewComment('');
            setReviewRating(5);
            fetchData();
        } catch (err) {
            console.error('Erreur lors de la soumission:', err);
        } finally {
            setSubmittingReview(false);
        }
    };

    const getImages = () => {
        if (product?.imagesJson) {
            try {
                const parsed = JSON.parse(product.imagesJson);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                return [];
            }
        }
        if (product?.imageUrl) {
            return [product.imageUrl];
        }
        return [];
    };

    const renderStars = (rating, interactive = false) => {
        return [...Array(5)].map((_, i) => {
            const starValue = i + 1;
            if (interactive) {
                return (
                    <span
                        key={i}
                        className={`star interactive ${starValue <= (reviewHover || reviewRating) ? 'filled' : 'empty'}`}
                        onClick={() => setReviewRating(starValue)}
                        onMouseEnter={() => setReviewHover(starValue)}
                        onMouseLeave={() => setReviewHover(0)}
                    >
            ★
          </span>
                );
            }
            return (
                <span key={i} className={`star ${starValue <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
            );
        });
    };

    if (loading) {
        return (
            <div className="product-detail-loading">
                <div className="loading-spinner"></div>
                <p>Chargement du produit...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-error">
                <span className="error-icon">😕</span>
                <h2>Produit non trouvé</h2>
                <p>Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
                <button onClick={() => navigate('/produits')} className="btn-back">
                    ← Retour aux produits
                </button>
            </div>
        );
    }

    const images = getImages();
    const stockDisponible = stock?.quantiteDisponible || 0;
    const isInStock = product.statut === 'disponible' && stockDisponible > 0;

    return (
        <div className="product-detail-page">
            {/* Success Toast */}
            {showSuccessMessage && (
                <div className="success-toast">
                    <span>✓</span> Produit ajouté au panier !
                </div>
            )}

            <div className="product-detail-container">
                {/* Left: Images Section */}
                <div className="product-images-section">
                    <div className="product-main-image">
                        {images.length > 0 ? (
                            <img
                                src={images[selectedImage]}
                                alt={product.nomProduit}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/500x500?text=Image+non+disponible';
                                }}
                            />
                        ) : (
                            <div className="no-image-placeholder">
                                <span>🎮</span>
                                <p>Image non disponible</p>
                            </div>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="product-thumbnails">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.nomProduit} ${index + 1}`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/100x100?text=...';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Info Section */}
                <div className="product-info-section">
                    <div className="product-breadcrumb">
                        <span onClick={() => navigate('/produits')}>Produits</span>
                        <span className="separator">/</span>
                        <span onClick={() => navigate(`/categories/${product.categorie?.idCategorie}`)}>
              {product.categorie?.nomCategorie || 'Catégorie'}
            </span>
                    </div>

                    <h1 className="product-title">{product.nomProduit}</h1>

                    {product.marque && (
                        <p className="product-brand">Marque: <strong>{product.marque}</strong></p>
                    )}

                    <div className="product-rating">
                        <div className="stars">
                            {renderStars(Math.round(product.noteMoyenne || 0))}
                        </div>
                        <span className="rating-count">({product.nombreAvis || reviews.length} avis)</span>
                    </div>

                    <div className="product-price">{parseFloat(product.prix).toFixed(2)} €</div>

                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{product.description || 'Aucune description disponible.'}</p>
                    </div>

                    {(product.poids || product.dimensions) && (
                        <div className="product-specs">
                            {product.poids && <p><strong>Poids:</strong> {product.poids} kg</p>}
                            {product.dimensions && <p><strong>Dimensions:</strong> {product.dimensions}</p>}
                        </div>
                    )}

                    <div className={`product-stock ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                        {isInStock ? (
                            <>✓ En stock <span>({stockDisponible} disponible{stockDisponible > 1 ? 's' : ''})</span></>
                        ) : (
                            <>✗ Rupture de stock</>
                        )}
                    </div>

                    {isInStock && (
                        <div className="product-actions">
                            <div className="quantity-selector">
                                <button
                                    className="qty-btn"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    −
                                </button>
                                <span className="qty-value">{quantity}</span>
                                <button
                                    className="qty-btn"
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= stockDisponible}
                                >
                                    +
                                </button>
                            </div>

                            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                🛒 Ajouter au panier
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
                <h2>Avis clients ({reviews.length})</h2>

                {/* Review Form */}
                <div className="review-form-card">
                    <h3>Laisser un avis</h3>
                    <form onSubmit={handleSubmitReview}>
                        <div className="review-rating-input">
                            <label>Note :</label>
                            <div className="star-rating-selector">
                                {renderStars(reviewRating, true)}
                            </div>
                        </div>

                        <div className="review-comment-input">
                            <label>Commentaire :</label>
                            <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Partagez votre expérience avec ce produit..."
                                rows="4"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="submit-review-btn"
                            disabled={submittingReview || !reviewComment.trim()}
                        >
                            {submittingReview ? 'Envoi...' : 'Soumettre l\'avis'}
                        </button>
                    </form>
                </div>

                {/* Reviews List */}
                <div className="reviews-list">
                    {reviews.length === 0 ? (
                        <div className="no-reviews">
                            <span>💬</span>
                            <p>Aucun avis pour ce produit. Soyez le premier à donner votre avis !</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.idAvis} className="review-card">
                                <div className="review-header">
                                    <div className="review-author">
                                        <div className="author-avatar">
                                            {review.utilisateur?.prenom?.[0]}{review.utilisateur?.nom?.[0]}
                                        </div>
                                        <div className="author-info">
                      <span className="author-name">
                        {review.utilisateur?.prenom} {review.utilisateur?.nom}
                      </span>
                                            <span className="review-date">
                        {new Date(review.dateAvis).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                      </span>
                                        </div>
                                    </div>
                                    <div className="review-rating-display">
                                        {renderStars(review.note)}
                                    </div>
                                </div>
                                <p className="review-content">{review.commentaire}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;