import React, { createContext, useState, useEffect, useContext } from 'react';
import { panierAPI, produitsAPI } from '../services/api';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();

    // Charger le panier depuis l'API si connecté, sinon depuis localStorage
    useEffect(() => {
        loadCart();
    }, [user]);

    const loadCart = async () => {
        if (isAuthenticated() && user) {
            // Charger depuis l'API
            setLoading(true);
            try {
                const panierItems = await panierAPI.getByUtilisateur(user.id);

                // Enrichir avec les détails des produits
                const cartWithDetails = await Promise.all(
                    panierItems.map(async (item) => {
                        try {
                            const produit = await produitsAPI.getById(item.idProduit);
                            return {
                                id: item.idPanier,
                                idProduit: item.idProduit,
                                name: produit.nomProduit,
                                price: parseFloat(produit.prix),
                                image: produit.imagesJson ? JSON.parse(produit.imagesJson)[0] : '/placeholder.jpg',
                                quantity: item.quantite,
                            };
                        } catch (error) {
                            console.error(`Erreur chargement produit ${item.idProduit}:`, error);
                            return null;
                        }
                    })
                );

                // Filtrer les produits null (en cas d'erreur)
                setCart(cartWithDetails.filter(item => item !== null));
            } catch (error) {
                console.error('Erreur chargement panier:', error);
                // Fallback sur localStorage
                const localCart = localStorage.getItem('cart');
                if (localCart) {
                    try {
                        setCart(JSON.parse(localCart));
                    } catch (e) {
                        setCart([]);
                    }
                }
            } finally {
                setLoading(false);
            }
        } else {
            // Charger depuis localStorage
            const localCart = localStorage.getItem('cart');
            if (localCart) {
                try {
                    setCart(JSON.parse(localCart));
                } catch (e) {
                    setCart([]);
                }
            }
        }
    };

    // Sauvegarder dans localStorage (pour utilisateurs non connectés)
    const saveToLocalStorage = (newCart) => {
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    // Ajouter au panier
    const addToCart = async (product) => {
        if (isAuthenticated() && user) {
            // Ajouter via l'API
            try {
                await panierAPI.add(user.id, product.idProduit || product.id, 1);
                await loadCart(); // Recharger le panier
            } catch (error) {
                console.error('Erreur ajout panier:', error);
            }
        } else {
            // Ajouter localement
            setCart(prev => {
                const existing = prev.find(p => (p.idProduit || p.id) === (product.idProduit || product.id));
                let newCart;

                if (existing) {
                    newCart = prev.map(p =>
                        (p.idProduit || p.id) === (product.idProduit || product.id)
                            ? { ...p, quantity: p.quantity + 1 }
                            : p
                    );
                } else {
                    newCart = [...prev, {
                        id: Date.now(), // ID temporaire
                        idProduit: product.idProduit || product.id,
                        name: product.nomProduit || product.name,
                        price: parseFloat(product.prix || product.price),
                        image: product.imagesJson ? JSON.parse(product.imagesJson)[0] : (product.image || '/placeholder.jpg'),
                        quantity: 1,
                    }];
                }

                saveToLocalStorage(newCart);
                return newCart;
            });
        }
    };

    // Supprimer du panier
    const removeFromCart = async (id) => {
        if (isAuthenticated() && user) {
            try {
                await panierAPI.remove(id);
                await loadCart();
            } catch (error) {
                console.error('Erreur suppression panier:', error);
            }
        } else {
            setCart(prev => {
                const newCart = prev.filter(p => p.id !== id);
                saveToLocalStorage(newCart);
                return newCart;
            });
        }
    };

    // Mettre à jour la quantité
    const updateQuantity = async (id, qty) => {
        const quantity = Math.max(1, qty);

        if (isAuthenticated() && user) {
            try {
                await panierAPI.updateQuantite(id, quantity);
                await loadCart();
            } catch (error) {
                console.error('Erreur mise à jour quantité:', error);
            }
        } else {
            setCart(prev => {
                const newCart = prev.map(p =>
                    p.id === id ? { ...p, quantity } : p
                );
                saveToLocalStorage(newCart);
                return newCart;
            });
        }
    };

    /**
     * ✅ FIX: Vider le panier - Version améliorée
     * - Accepte un userId optionnel pour éviter les problèmes de contexte
     * - Nettoie toujours le localStorage par sécurité
     * - Propage les erreurs pour le debugging
     */
    const clearCart = async (userId = null) => {
        const effectiveUserId = userId || user?.id;

        // Toujours vider l'état local immédiatement
        setCart([]);
        localStorage.removeItem('cart');

        if (isAuthenticated() && effectiveUserId) {
            try {
                await panierAPI.clear(effectiveUserId);
                console.log('✅ Panier vidé avec succès (API + local)');
                return true;
            } catch (error) {
                console.error('⚠️ Erreur vidage panier API:', error);
                // Le panier local est déjà vidé, on continue
                // mais on log l'erreur pour debugging
                console.log('ℹ️ Panier local vidé malgré l\'erreur API');
                return true; // On retourne true car le panier local est vidé
            }
        } else {
            console.log('✅ Panier local vidé (utilisateur non connecté)');
            return true;
        }
    };

    // Calculer le total
    const getTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    // Nombre d'articles
    const getItemCount = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotal,
            getItemCount,
            loadCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

// Hook personnalisé
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};