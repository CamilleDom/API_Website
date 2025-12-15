import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import '../styles/cartStyle.css';

function CartPage() {
    const { cart, loading, removeFromCart, updateQuantity, getTotal, getItemCount } = useCart();

    if (loading) return <Loader message="Chargement du panier..." />;

    // État panier vide
    if (cart.length === 0) {
        return (
            <section className="cart-page">
                <div className="cart-container">
                    <h2>🛒 Votre Panier</h2>

                    <div className="cart-empty-state">
                        <div className="empty-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </div>

                        <h3>Votre panier est vide</h3>
                        <p>Vous n'avez pas encore ajouté de produits à votre panier.</p>

                        <Link to="/products" className="cart-empty-btn">
                            <span className="btn-icon">🎮</span>
                            <span className="btn-text">Découvrir nos produits</span>
                        </Link>

                        <div className="empty-suggestions">
                            <p>Catégories populaires :</p>
                            <div className="suggestion-tags">
                                <Link to="/products?category=1" className="suggestion-tag">Manga</Link>
                                <Link to="/products?category=2" className="suggestion-tag">Jeux Vidéo</Link>
                                <Link to="/products?category=3" className="suggestion-tag">Figurines</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // État panier avec articles
    return (
        <section className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h2>🛒 Votre Panier</h2>
                    <span className="cart-count">{getItemCount()} article{getItemCount() > 1 ? 's' : ''}</span>
                </div>

                <div className="cart-content">
                    {/* Liste des articles */}
                    <div className="cart-items-section">
                        <div className="cart-items">
                            {cart.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="cart-item"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="cart-item-image">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                                        />
                                    </div>

                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        <p className="cart-item-price">{item.price.toFixed(2)} €</p>
                                    </div>

                                    <div className="cart-item-quantity">
                                        <button
                                            className="qty-btn qty-minus"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn qty-plus"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item-total">
                                        <span className="total-label">Total</span>
                                        <span className="total-value">{(item.price * item.quantity).toFixed(2)} €</span>
                                    </div>

                                    {/* ✅ FIX: Bouton de suppression avec icône visible */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="cart-item-remove"
                                        aria-label="Supprimer l'article"
                                        title="Supprimer du panier"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ width: '20px', height: '20px' }}
                                        >
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Résumé de la commande */}
                    <div className="cart-summary-section">
                        <div className="cart-summary">
                            <h3>Récapitulatif</h3>

                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Sous-total</span>
                                    <span>{getTotal().toFixed(2)} €</span>
                                </div>
                                <div className="summary-row">
                                    <span>Livraison</span>
                                    <span className="free-shipping">Gratuite</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>{getTotal().toFixed(2)} €</span>
                                </div>
                            </div>

                            <div className="cart-actions">
                                <Link to="/checkout" className="btn-checkout">
                                    <span>💳</span>
                                    <span>Passer la commande</span>
                                </Link>
                                <Link to="/products" className="btn-continue">
                                    <span>🛍️</span>
                                    <span>Continuer les achats</span>
                                </Link>
                            </div>

                            <div className="cart-security">
                                <span className="security-icon">🔒</span>
                                <span className="security-text">Paiement 100% sécurisé</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CartPage;