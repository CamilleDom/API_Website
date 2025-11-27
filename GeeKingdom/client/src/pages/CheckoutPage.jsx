import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { commandesAPI, detailsCommandeAPI, paiementsAPI } from '../services/api';
import Loader from '../components/Loader';

function CheckoutPage() {
  const { cart, getTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  const [livraison, setLivraison] = useState({
    adresse: user?.adresse || '',
    ville: user?.ville || '',
    codePostal: user?.codePostal || '',
    pays: user?.pays || 'France',
  });
  
  const [paiement, setPaiement] = useState({
    methode: 'carte_bancaire',
  });

  const handleLivraisonChange = (e) => {
    setLivraison({ ...livraison, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Créer la commande
      const commande = await commandesAPI.create({
        idUtilisateur: user.id,
        montantTotal: getTotal(),
        adresseLivraison: livraison.adresse,
        villeLivraison: livraison.ville,
        codePostalLivraison: livraison.codePostal,
        paysLivraison: livraison.pays,
      });

      // 2. Créer les détails de commande
      for (const item of cart) {
        await detailsCommandeAPI.create({
          idCommande: commande.idCommande,
          idProduit: item.idProduit || item.id,
          quantite: item.quantity,
          prixUnitaire: item.price,
          prixTotal: item.price * item.quantity,
        });
      }

      // 3. Créer le paiement
      const paiementResult = await paiementsAPI.create({
        idCommande: commande.idCommande,
        montant: getTotal(),
        methodePaiement: paiement.methode,
      });

      // 4. Traiter le paiement
      await paiementsAPI.traiter(paiementResult.idPaiement);

      // 5. Vider le panier
      await clearCart();

      // 6. Rediriger vers confirmation
      navigate('/order-confirmation', { 
        state: { 
          orderId: commande.idCommande,
          orderNumber: commande.numeroCommande,
        } 
      });

    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la commande.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <section className="checkout-login-required">
        <h2>Finaliser la commande</h2>
        <p>Veuillez vous connecter pour continuer.</p>
        <button onClick={() => navigate('/login', { state: { from: '/checkout' } })}>
          Se connecter
        </button>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="checkout-empty">
        <h2>Votre panier est vide</h2>
        <button onClick={() => navigate('/products')}>
          Voir les produits
        </button>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <h2>Finaliser la commande</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="checkout-steps">
        <span className={step >= 1 ? 'active' : ''}>1. Livraison</span>
        <span className={step >= 2 ? 'active' : ''}>2. Paiement</span>
        <span className={step >= 3 ? 'active' : ''}>3. Confirmation</span>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="checkout-section">
            <h3>Adresse de livraison</h3>
            <input
              type="text"
              name="adresse"
              placeholder="Adresse"
              value={livraison.adresse}
              onChange={handleLivraisonChange}
              required
            />
            <div className="input-row">
              <input
                type="text"
                name="ville"
                placeholder="Ville"
                value={livraison.ville}
                onChange={handleLivraisonChange}
                required
              />
              <input
                type="text"
                name="codePostal"
                placeholder="Code postal"
                value={livraison.codePostal}
                onChange={handleLivraisonChange}
                required
              />
            </div>
            <input
              type="text"
              name="pays"
              placeholder="Pays"
              value={livraison.pays}
              onChange={handleLivraisonChange}
              required
            />
            <button type="button" onClick={() => setStep(2)}>
              Continuer vers le paiement
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-section">
            <h3>Méthode de paiement</h3>
            <div className="payment-methods">
              {['carte_bancaire', 'paypal', 'virement'].map(method => (
                <label key={method} className="payment-option">
                  <input
                    type="radio"
                    name="methode"
                    value={method}
                    checked={paiement.methode === method}
                    onChange={(e) => setPaiement({ ...paiement, methode: e.target.value })}
                  />
                  <span>{method.replace('_', ' ').toUpperCase()}</span>
                </label>
              ))}
            </div>

            <div className="checkout-summary">
              <h4>Récapitulatif</h4>
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
              <div className="summary-total">
                <strong>Total :</strong>
                <strong>{getTotal().toFixed(2)} €</strong>
              </div>
            </div>

            <div className="checkout-buttons">
              <button type="button" onClick={() => setStep(1)}>
                Retour
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Traitement...' : 'Confirmer et payer'}
              </button>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}

export default CheckoutPage;