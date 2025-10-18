import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  if (cart.length === 0)
    return (
      <section>
        <h2>Votre Panier</h2>
        <p>Votre panier est vide.</p>
        <Link to="/products">Voir les produits</Link>
      </section>
    );

  return (
    <section>
      <h2>Votre Panier</h2>
      {cart.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.price} €</p>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          />
          <button onClick={() => removeFromCart(item.id)}>Supprimer</button>
        </div>
      ))}
      <Link to="/checkout">Passer à la commande</Link>
    </section>
  );
}

export default CartPage;
