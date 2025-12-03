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
            const commande = await commandesAPI.create({
                idUtilisateur: user.id,
                montantTotal: getTotal(),
                adresseLivraison: livraison.adresse,
                villeLivraison: livraison.ville,
                codePostalLivraison: livraison.codePostal,
                paysLivraison: livraison.pays,
            });

            for (const item of cart) {
                await detailsCommandeAPI.create({
                    idCommande: commande.idCommande,
                    idProduit: item.idProduit || item.id,
                    quantite: item.quantity,
                    prixUnitaire: item.price,
                    prixTotal: item.price * item.quantity,
                });
            }

            const paiementResult = await paiementsAPI.create({
                idCommande: commande.idCommande,
                montant: getTotal(),
                methodePaiement: paiement.methode,
            });

            await paiementsAPI.traiter(paiementResult.idPaiement);
            await clearCart();

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

    // Calculate progress percentage
    const getProgressPercentage = () => {
        return ((step - 1) / 2) * 100; // 0%, 50%, 100%
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

            {/* Horizontal Progress Bar */}
            <div className="checkout-progress-container">
                <div className="progress-steps">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Livraison</div>
                    </div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Paiement</div>
                    </div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-label">Confirmation</div>
                    </div>
                </div>

                {/* Progress Bar Track */}
                <div className="progress-bar-track">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Step 1: Livraison */}
                {step === 1 && (
                    <div className="checkout-section animate-fadeIn">
                        <div className="section-header">
                            <h3>🚚 Adresse de livraison</h3>
                            <p className="section-subtitle">Où souhaitez-vous recevoir votre commande ?</p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label htmlFor="adresse">Adresse complète *</label>
                                <input
                                    id="adresse"
                                    type="text"
                                    name="adresse"
                                    placeholder="Numéro et nom de rue"
                                    value={livraison.adresse}
                                    onChange={handleLivraisonChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="ville">Ville *</label>
                                <input
                                    id="ville"
                                    type="text"
                                    name="ville"
                                    placeholder="Ville"
                                    value={livraison.ville}
                                    onChange={handleLivraisonChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="codePostal">Code postal *</label>
                                <input
                                    id="codePostal"
                                    type="text"
                                    name="codePostal"
                                    placeholder="Code postal"
                                    value={livraison.codePostal}
                                    onChange={handleLivraisonChange}
                                    required
                                    pattern="[0-9]{5}"
                                    title="Le code postal doit contenir 5 chiffres"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="pays">Pays *</label>
                                <input
                                    id="pays"
                                    type="text"
                                    name="pays"
                                    placeholder="Pays"
                                    value={livraison.pays}
                                    onChange={handleLivraisonChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate('/cart')}>
                                ← Retour au panier
                            </button>
                            <button type="button" className="btn-primary" onClick={() => setStep(2)}>
                                Continuer vers le paiement →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Paiement */}
                {step === 2 && (
                    <div className="checkout-section animate-fadeIn">
                        <div className="section-header">
                            <h3>💳 Méthode de paiement</h3>
                            <p className="section-subtitle">Choisissez votre mode de paiement</p>
                        </div>

                        <div className="payment-methods-grid">
                            <label className={`payment-card ${paiement.methode === 'carte_bancaire' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="methode"
                                    value="carte_bancaire"
                                    checked={paiement.methode === 'carte_bancaire'}
                                    onChange={(e) => setPaiement({ ...paiement, methode: e.target.value })}
                                />
                                <div className="payment-content">
                                    <span className="payment-icon">💳</span>
                                    <span className="payment-name">Carte bancaire</span>
                                    <span className="payment-desc">Visa, Mastercard</span>
                                </div>
                                <span className="payment-check">✓</span>
                            </label>

                            <label className={`payment-card ${paiement.methode === 'paypal' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="methode"
                                    value="paypal"
                                    checked={paiement.methode === 'paypal'}
                                    onChange={(e) => setPaiement({ ...paiement, methode: e.target.value })}
                                />
                                <div className="payment-content">
                                    <span className="payment-icon">🅿️</span>
                                    <span className="payment-name">PayPal</span>
                                    <span className="payment-desc">Paiement sécurisé</span>
                                </div>
                                <span className="payment-check">✓</span>
                            </label>

                            <label className={`payment-card ${paiement.methode === 'virement' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="methode"
                                    value="virement"
                                    checked={paiement.methode === 'virement'}
                                    onChange={(e) => setPaiement({ ...paiement, methode: e.target.value })}
                                />
                                <div className="payment-content">
                                    <span className="payment-icon">🏦</span>
                                    <span className="payment-name">Virement bancaire</span>
                                    <span className="payment-desc">Sous 2-3 jours</span>
                                </div>
                                <span className="payment-check">✓</span>
                            </label>
                        </div>

                        {/* Order Summary */}
                        <div className="checkout-summary">
                            <h4>📋 Récapitulatif de la commande</h4>
                            <table className="order-summary-table">
                                <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Prix unitaire</th>
                                    <th>Quantité</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cart.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.price.toFixed(2)} €</td>
                                        <td>×{item.quantity}</td>
                                        <td>{(item.price * item.quantity).toFixed(2)} €</td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr className="total-row">
                                    <td colSpan="3"><strong>Total du panier</strong></td>
                                    <td><strong>{getTotal().toFixed(2)} €</strong></td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Shipping Address Summary */}
                        <div className="address-summary">
                            <h4>📍 Adresse de livraison</h4>
                            <div className="address-box">
                                <p>{livraison.adresse}</p>
                                <p>{livraison.codePostal} {livraison.ville}</p>
                                <p>{livraison.pays}</p>
                                <button type="button" className="btn-link" onClick={() => setStep(1)}>
                                    Modifier l'adresse
                                </button>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                                ← Retour
                            </button>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Traitement en cours...
                                    </>
                                ) : (
                                    <>
                                        Confirmer et payer {getTotal().toFixed(2)} €
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </section>
    );
}

export default CheckoutPage;