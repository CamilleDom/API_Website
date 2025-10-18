import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    alert('Paiement sécurisé effectué ✅ Merci pour votre commande !');
    clearCart();
  };

  return (
    <section>
      <h2>Finaliser la commande</h2>
      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.name} x{item.quantity} — {item.price * item.quantity} €
              </li>
            ))}
          </ul>
          <h3>Total : {total} €</h3>
          <button onClick={handlePayment}>Payer maintenant</button>
        </>
      )}
    </section>
  );
}

export default CheckoutPage;
