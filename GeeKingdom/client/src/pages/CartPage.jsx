import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

function CartPage() {
  const { cart, loading, removeFromCart, updateQuantity, getTotal } = useCart();

  if (loading) return <Loader message="Chargement du panier..." />;

  if (cart.length === 0) {
    return (
      <section className="cart-empty">
        <h2>Votre Panier</h2>
        <div className="empty-cart-message">
          <p>🛒 Votre panier est vide.</p>
          <Link to="/products" className="btn-primary">
            Découvrir nos produits
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h2>Votre Panier</h2>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img 
              src={item.image} 
              alt={item.name}
              onError={(e) => { e.target.src = '/placeholder.jpg'; }}
            />
            
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="item-price">{item.price.toFixed(2)} €</p>
            </div>

            <div className="cart-item-quantity">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
              />
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>

            <p className="cart-item-total">
              {(item.price * item.quantity).toFixed(2)} €
            </p>

            <button 
              onClick={() => removeFromCart(item.id)} 
              className="btn-remove"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Total :</span>
          <span className="total-price">{getTotal().toFixed(2)} €</span>
        </div>
        
        <div className="cart-actions">
          <Link to="/products" className="btn-secondary">
            Continuer les achats
          </Link>
          <Link to="/checkout" className="btn-primary">
            Passer la commande
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CartPage;