// Configuration de base de l'API
const API_BASE_URL = 'http://localhost:8080';
export const API_URL = API_BASE_URL;  // ✅ AJOUT de l'export

// Token JWT pour l'authentification
const getToken = () => localStorage.getItem('token');

// Headers par défaut
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Fonction générique pour les requêtes
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    // Si la réponse est vide
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// AUTHENTIFICATION
// ============================================
export const authAPI = {
  login: (email, password) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getProfile: (id) => 
    apiRequest(`/auth/profile/${id}`),

  updateProfile: (id, userData) =>
    apiRequest(`/auth/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

// ============================================
// CATEGORIES
// ============================================
export const categoriesAPI = {
  getAll: () => 
    apiRequest('/api/categories'),

  getById: (id) => 
    apiRequest(`/api/categories/${id}`),

  create: (data) =>
    apiRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// PRODUITS
// ============================================
export const produitsAPI = {
  getAll: (categorieId = null) => {
    const url = categorieId 
      ? `/api/produits?categorie=${categorieId}`
      : '/api/produits';
    return apiRequest(url);
  },

  getById: (id) => 
    apiRequest(`/api/produits/${id}`),

  create: (data) =>
    apiRequest('/api/produits', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiRequest(`/api/produits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiRequest(`/api/produits/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================
// PANIER
// ============================================
export const panierAPI = {
  getByUtilisateur: (idUtilisateur) => 
    apiRequest(`/api/panier/utilisateur/${idUtilisateur}`),

  add: (idUtilisateur, idProduit, quantite) =>
    apiRequest('/api/panier', {
      method: 'POST',
      body: JSON.stringify({ idUtilisateur, idProduit, quantite }),
    }),

  updateQuantite: (id, quantite) =>
    apiRequest(`/api/panier/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantite }),
    }),

  remove: (id) =>
    apiRequest(`/api/panier/${id}`, {
      method: 'DELETE',
    }),

  clear: (idUtilisateur) =>
    apiRequest(`/api/panier/utilisateur/${idUtilisateur}/vider`, {
      method: 'DELETE',
    }),
};

// ============================================
// COMMANDES
// ============================================
export const commandesAPI = {

    // Récupérer toutes les commandes
    getAll: () =>
        apiRequest('/api/commandes'),

    // Récupérer une commande par ID
    getById: (id) =>
        apiRequest(`/api/commandes/${id}`),

    // Récupérer les commandes d'un utilisateur
    getByUtilisateur: (idUtilisateur) =>
        apiRequest(`/api/commandes/utilisateur/${idUtilisateur}`),

    // Récupérer les commandes par statut
    getByStatut: (statut) =>
        apiRequest(`/api/commandes/statut/${statut}`),

    // Rechercher par numéro de commande
    getByNumero: (numeroCommande) =>
        apiRequest(`/api/commandes/numero/${numeroCommande}`),

    // Créer une nouvelle commande
    create: (data) =>
        apiRequest('/api/commandes', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // Mettre à jour une commande (adresse, etc.)
    update: (id, data) =>
        apiRequest(`/api/commandes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    // Changer le statut d'une commande
    updateStatut: (id, statut) =>
        apiRequest(`/api/commandes/${id}/statut`, {
            method: 'PUT',
            body: JSON.stringify({ statut }),
        }),

    // Annuler une commande
    annuler: (id, motif = null) =>
        apiRequest(`/api/commandes/${id}/annuler`, {
            method: 'POST',
            body: JSON.stringify({ motif }),
        }),

    // Suivre une commande (tracking)
    suivre: (id) =>
        apiRequest(`/api/commandes/${id}/suivi`),

    // Historique des commandes avec filtres
    getHistorique: (idUtilisateur, filters = {}) => {
        const params = new URLSearchParams();
        if (filters.statut) params.append('statut', filters.statut);
        if (filters.dateDebut) params.append('dateDebut', filters.dateDebut);
        if (filters.dateFin) params.append('dateFin', filters.dateFin);

        const queryString = params.toString();
        return apiRequest(`/api/commandes/utilisateur/${idUtilisateur}/historique${queryString ? '?' + queryString : ''}`);
    },

    // Statistiques des commandes d'un utilisateur
    getStats: (idUtilisateur) =>
        apiRequest(`/api/commandes/utilisateur/${idUtilisateur}/stats`),

    // Supprimer une commande (admin)
    delete: (id) =>
        apiRequest(`/api/commandes/${id}`, {
            method: 'DELETE',

        }),
};

// ============================================
// DÉTAILS COMMANDE
// ============================================
export const detailsCommandeAPI = {
  getByCommande: (idCommande) => 
    apiRequest(`/api/details-commande/commande/${idCommande}`),

  create: (data) =>
    apiRequest('/api/details-commande', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// PAIEMENTS
// ============================================
export const paiementsAPI = {
  create: (data) =>
    apiRequest('/api/paiements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  traiter: (id) =>
    apiRequest(`/api/paiements/${id}/traiter`, {
      method: 'POST',
    }),

  getByCommande: (idCommande) => 
    apiRequest(`/api/paiements/commande/${idCommande}`),
};

// ============================================
// AVIS
// ============================================
export const avisAPI = {
    getByProduit: (idProduit) =>
        apiRequest(`/api/avis/produit/${idProduit}`),

    create: (data) =>
        apiRequest('/api/avis', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // ✅ NOUVEAU : Modifier un avis
    update: (id, data) =>
        apiRequest(`/api/avis/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    // ✅ NOUVEAU : Supprimer un avis
    delete: (id) =>
        apiRequest(`/api/avis/${id}`, {
            method: 'DELETE',
        }),

    marquerUtile: (id) =>
        apiRequest(`/api/avis/${id}/utile`, {
            method: 'POST',
        }),
};

// ============================================
// POINTS DE RETRAIT
// ============================================
export const pointsRetraitAPI = {
  getActifs: () => 
    apiRequest('/api/points-retrait/actifs'),

  getProximite: (latitude, longitude, rayon = 10) => 
    apiRequest(`/api/points-retrait/proximite?latitude=${latitude}&longitude=${longitude}&rayon=${rayon}`),

  getById: (id) => 
    apiRequest(`/api/points-retrait/${id}`),

  getByVille: (ville) => 
    apiRequest(`/api/points-retrait/ville/${ville}`),
};

// ============================================
// STOCKS
// ============================================
export const stocksAPI = {
  getByProduit: (idProduit) => 
    apiRequest(`/api/stocks/produit/${idProduit}`),

  getDisponibles: () => 
    apiRequest('/api/stocks/disponibles'),
};

// ============================================
// LIVRAISONS
// ============================================
export const livraisonsAPI = {
  getByCommande: (idCommande) => 
    apiRequest(`/api/livraisons/commande/${idCommande}`),

  getBySuivi: (numeroSuivi) => 
    apiRequest(`/api/livraisons/suivi/${numeroSuivi}`),
};

// ✅ NOUVEAU
const api = {
  auth: authAPI,
  categories: categoriesAPI,
  produits: produitsAPI,
  panier: panierAPI,
  commandes: commandesAPI,
  detailsCommande: detailsCommandeAPI,
  paiements: paiementsAPI,
  avis: avisAPI,
  pointsRetrait: pointsRetraitAPI,
  stocks: stocksAPI,
  livraisons: livraisonsAPI,
};

export default api;