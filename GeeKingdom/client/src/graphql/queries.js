import { gql } from '@apollo/client';

// DASHBOARD
export const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    adminStats {
      totalUtilisateurs
      utilisateursActifs
      utilisateursSuspendus
      totalProduits
      produitsDisponibles
      produitsEnRupture
      totalCommandes
      commandesEnAttente
      commandesExpediees
      commandesLivrees
      chiffreAffaires
      avisEnAttente
      stocksEnAlerte
    }
  }
`;

// AVIS
export const GET_AVIS_EN_ATTENTE = gql`
  query GetAvisEnAttente($page: Int, $size: Int) {
    avisEnAttente(page: $page, size: $size) {
      content {
        idAvis
        idProduit
        idUtilisateur
        note
        commentaire
        dateAvis
        statutModeration
        utileCount
        utilisateur {
          idUtilisateur
          nom
          prenom
          email
        }
        produit {
          idProduit
          nomProduit
          prix
        }
      }
      pageInfo {
        totalElements
        totalPages
        currentPage
        pageSize
        hasNext
        hasPrevious
      }
    }
  }
`;

export const GET_AVIS_PAR_STATUT = gql`
  query GetAvisParStatut($statut: StatutModeration!, $page: Int, $size: Int) {
    avisParStatut(statut: $statut, page: $page, size: $size) {
      content {
        idAvis
        idProduit
        idUtilisateur
        note
        commentaire
        dateAvis
        statutModeration
        utilisateur {
          nom
          prenom
          email
        }
        produit {
          nomProduit
        }
      }
      pageInfo {
        totalElements
        totalPages
        currentPage
        hasNext
        hasPrevious
      }
    }
  }
`;

// UTILISATEURS
export const GET_UTILISATEURS = gql`
  query GetUtilisateurs($page: Int, $size: Int) {
    utilisateurs(page: $page, size: $size) {
      content {
        idUtilisateur
        nom
        prenom
        email
        telephone
        ville
        dateInscription
        dateDerniereConnexion
        statut
        role
      }
      pageInfo {
        totalElements
        totalPages
        currentPage
        hasNext
        hasPrevious
      }
    }
  }
`;

export const SEARCH_UTILISATEURS = gql`
  query SearchUtilisateurs($query: String!) {
    searchUtilisateurs(query: $query) {
      idUtilisateur
      nom
      prenom
      email
      statut
      role
    }
  }
`;

// COMMANDES
export const GET_COMMANDES = gql`
  query GetCommandes($page: Int, $size: Int, $filter: CommandeFilterInput) {
    commandes(page: $page, size: $size, filter: $filter) {
      content {
        idCommande
        numeroCommande
        montantTotal
        statut
        dateCommande
        villeLivraison
        utilisateur {
          nom
          prenom
          email
        }
      }
      pageInfo {
        totalElements
        totalPages
        currentPage
        hasNext
        hasPrevious
      }
    }
  }
`;

export const GET_COMMANDE = gql`
  query GetCommande($id: ID!) {
    commande(id: $id) {
      idCommande
      numeroCommande
      montantTotal
      montantLivraison
      montantTaxe
      statut
      adresseLivraison
      villeLivraison
      codePostalLivraison
      paysLivraison
      dateCommande
      commentaires
      codePromo
      reduction
      utilisateur {
        idUtilisateur
        nom
        prenom
        email
        telephone
      }
    }
  }
`;

export const GET_COMMANDES_RECENTES = gql`
  query GetCommandesRecentes($limit: Int) {
    commandesRecentes(limit: $limit) {
      idCommande
      numeroCommande
      montantTotal
      statut
      dateCommande
      utilisateur {
        nom
        prenom
      }
    }
  }
`;

// PRODUITS
export const GET_PRODUITS_ADMIN = gql`
  query GetProduitsAdmin($page: Int, $size: Int) {
    produits(page: $page, size: $size) {
      content {
        idProduit
        nomProduit
        description
        prix
        idCategorie
        marque
        statut
        dateCreation
        noteMoyenne
        nombreAvis
      }
      pageInfo {
        totalElements
        totalPages
        currentPage
        hasNext
        hasPrevious
      }
    }
  }
`;

// STOCKS
export const GET_STOCKS = gql`
  query GetStocks {
    stocks {
      idStock
      idProduit
      quantiteDisponible
      quantiteReservee
      seuilAlerte
      emplacement
      dateDerniereMaj
      produit {
        idProduit
        nomProduit
        prix
        statut
      }
    }
  }
`;

export const GET_STOCKS_EN_ALERTE = gql`
  query GetStocksEnAlerte {
    stocksEnAlerte {
      produit {
        idProduit
        nomProduit
        prix
      }
      stock {
        idStock
        quantiteDisponible
        quantiteReservee
        seuilAlerte
      }
      alertLevel
    }
  }
`;

// CATÉGORIES
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      idCategorie
      nomCategorie
      description
      imageUrl
      dateCreation
    }
  }
`;