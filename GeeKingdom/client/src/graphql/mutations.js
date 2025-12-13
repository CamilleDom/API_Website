import { gql } from '@apollo/client';

// MODÉRATION AVIS
export const APPROUVER_AVIS = gql`
  mutation ApprouverAvis($id: ID!) {
    approuverAvis(id: $id) {
      success
      message
      avis {
        idAvis
        statutModeration
      }
    }
  }
`;

export const REJETER_AVIS = gql`
  mutation RejeterAvis($id: ID!, $motif: String) {
    rejeterAvis(id: $id, motif: $motif) {
      success
      message
    }
  }
`;

export const SUPPRIMER_AVIS = gql`
  mutation SupprimerAvis($id: ID!) {
    supprimerAvis(id: $id) {
      success
      message
    }
  }
`;

// UTILISATEURS
export const SUSPENDRE_UTILISATEUR = gql`
  mutation SuspendreUtilisateur($id: ID!, $motif: String) {
    suspendreUtilisateur(id: $id, motif: $motif) {
      success
      message
    }
  }
`;

export const ACTIVER_UTILISATEUR = gql`
  mutation ActiverUtilisateur($id: ID!) {
    activerUtilisateur(id: $id) {
      success
      message
    }
  }
`;

export const CHANGER_ROLE_UTILISATEUR = gql`
  mutation ChangerRoleUtilisateur($id: ID!, $role: RoleUtilisateur!) {
    changerRoleUtilisateur(id: $id, role: $role) {
      success
      message
    }
  }
`;

export const SUPPRIMER_UTILISATEUR = gql`
  mutation SupprimerUtilisateur($id: ID!) {
    supprimerUtilisateur(id: $id) {
      success
      message
    }
  }
`;

// COMMANDES
export const CHANGER_STATUT_COMMANDE = gql`
  mutation ChangerStatutCommande($id: ID!, $statut: StatutCommande!) {
    changerStatutCommande(id: $id, statut: $statut) {
      success
      message
    }
  }
`;

export const ANNULER_COMMANDE = gql`
  mutation AnnulerCommande($id: ID!, $motif: String) {
    annulerCommande(id: $id, motif: $motif) {
      success
      message
    }
  }
`;

// PRODUITS
export const CREATE_PRODUIT = gql`
  mutation CreateProduit($input: ProduitInput!) {
    createProduit(input: $input) {
      idProduit
      nomProduit
      prix
      statut
    }
  }
`;

export const UPDATE_PRODUIT = gql`
  mutation UpdateProduit($id: ID!, $input: ProduitInput!) {
    updateProduit(id: $id, input: $input) {
      idProduit
      nomProduit
      prix
      statut
    }
  }
`;

export const CHANGER_STATUT_PRODUIT = gql`
  mutation ChangerStatutProduit($id: ID!, $statut: StatutProduit!) {
    changerStatutProduit(id: $id, statut: $statut) {
      success
      message
    }
  }
`;

export const SUPPRIMER_PRODUIT = gql`
  mutation SupprimerProduit($id: ID!) {
    supprimerProduit(id: $id) {
      success
      message
    }
  }
`;

// STOCKS
export const APPROVISIONNER_STOCK = gql`
  mutation ApprovisionnerStock($input: StockInput!) {
    approvisionnerStock(input: $input) {
      success
      message
    }
  }
`;

export const AJUSTER_STOCK = gql`
  mutation AjusterStock($idProduit: Int!, $quantite: Int!, $commentaire: String) {
    ajusterStock(idProduit: $idProduit, quantite: $quantite, commentaire: $commentaire) {
      success
      message
    }
  }
`;

export const MODIFIER_SEUIL_ALERTE = gql`
  mutation ModifierSeuilAlerte($idProduit: Int!, $seuil: Int!) {
    modifierSeuilAlerte(idProduit: $idProduit, seuil: $seuil) {
      success
      message
    }
  }
`;

// CATÉGORIES
export const CREATE_CATEGORIE = gql`
  mutation CreateCategorie($nom: String!, $description: String, $imageUrl: String) {
    createCategorie(nom: $nom, description: $description, imageUrl: $imageUrl) {
      idCategorie
      nomCategorie
    }
  }
`;

export const UPDATE_CATEGORIE = gql`
  mutation UpdateCategorie($id: ID!, $nom: String, $description: String, $imageUrl: String) {
    updateCategorie(id: $id, nom: $nom, description: $description, imageUrl: $imageUrl) {
      idCategorie
      nomCategorie
    }
  }
`;

export const SUPPRIMER_CATEGORIE = gql`
  mutation SupprimerCategorie($id: ID!) {
    supprimerCategorie(id: $id) {
      success
      message
    }
  }
`;