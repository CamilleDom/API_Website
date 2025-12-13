// src/main/java/com/example/demo/graphql/AdminMutationResolver.java

package com.example.demo.graphql;

import com.example.demo.graphql.types.*;
import com.example.demo.models.*;
import com.example.demo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Controller
public class AdminMutationResolver {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private AvisProduitRepository avisRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private MouvementStockRepository mouvementRepository;

    @Autowired
    private CategorieRepository categorieRepository;

    // ============================================
    // MODÉRATION DES AVIS
    // ============================================

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ModerationResult approuverAvis(@Argument Integer id) {
        return avisRepository.findById(id)
                .map(avis -> {
                    avis.setStatutModeration(AvisProduit.StatutModeration.approuve);
                    AvisProduit saved = avisRepository.save(avis);
                    
                    // Mettre à jour la note moyenne du produit
                    updateProduitNote(avis.getIdProduit());
                    
                    return new ModerationResult(true, "Avis approuvé avec succès", saved);
                })
                .orElse(new ModerationResult(false, "Avis non trouvé", null));
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ModerationResult rejeterAvis(@Argument Integer id, @Argument String motif) {
        return avisRepository.findById(id)
                .map(avis -> {
                    avis.setStatutModeration(AvisProduit.StatutModeration.rejete);
                    AvisProduit saved = avisRepository.save(avis);
                    
                    String message = motif != null ? 
                            "Avis rejeté. Motif: " + motif : 
                            "Avis rejeté";
                    
                    return new ModerationResult(true, message, saved);
                })
                .orElse(new ModerationResult(false, "Avis non trouvé", null));
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult supprimerAvis(@Argument Integer id) {
        return avisRepository.findById(id)
                .map(avis -> {
                    Integer idProduit = avis.getIdProduit();
                    avisRepository.deleteById(id);
                    updateProduitNote(idProduit);
                    return new ActionResult(true, "Avis supprimé avec succès", id.toString());
                })
                .orElse(new ActionResult(false, "Avis non trouvé", null));
    }

    // ============================================
    // GESTION DES UTILISATEURS
    // ============================================

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult suspendreUtilisateur(@Argument Integer id, @Argument String motif) {
        return utilisateurRepository.findById(id)
                .map(user -> {
                    if (user.getRole() == Utilisateur.Role.admin) {
                        return new ActionResult(false, "Impossible de suspendre un administrateur", null);
                    }
                    user.setStatut(Utilisateur.Statut.suspendu);
                    utilisateurRepository.save(user);
                    
                    String message = motif != null ? 
                            "Utilisateur suspendu. Motif: " + motif : 
                            "Utilisateur suspendu";
                    
                    return new ActionResult(true, message, id.toString());
                })
                .orElse(new ActionResult(false, "Utilisateur non trouvé", null));
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult activerUtilisateur(@Argument Integer id) {
        return utilisateurRepository.findById(id)
                .map(user -> {
                    user.setStatut(Utilisateur.Statut.actif);
                    utilisateurRepository.save(user);
                    return new ActionResult(true, "Utilisateur activé avec succès", id.toString());
                })
                .orElse(new ActionResult(false, "Utilisateur non trouvé", null));
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult changerRoleUtilisateur(@Argument Integer id, @Argument Utilisateur.Role role) {
        return utilisateurRepository.findById(id)
                .map(user -> {
                    user.setRole(role);
                    utilisateurRepository.save(user);
                    return new ActionResult(true, "Rôle modifié en " + role, id.toString());
                })
                .orElse(new ActionResult(false, "Utilisateur non trouvé", null));
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Utilisateur updateUtilisateur(@Argument Integer id, @Argument UtilisateurInput input) {
        return utilisateurRepository.findById(id)
                .map(user -> {
                    if (input.getNom() != null) user.setNom(input.getNom());
                    if (input.getPrenom() != null) user.setPrenom(input.getPrenom());
                    if (input.getTelephone() != null) user.setTelephone(input.getTelephone());
                    if (input.getAdresse() != null) user.setAdresse(input.getAdresse());
                    if (input.getVille() != null) user.setVille(input.getVille());
                    if (input.getCodePostal() != null) user.setCodePostal(input.getCodePostal());
                    if (input.getPays() != null) user.setPays(input.getPays());
                    if (input.getStatut() != null) user.setStatut(input.getStatut());
                    if (input.getRole() != null) user.setRole(input.getRole());
                    
                    return utilisateurRepository.save(user);
                })
                .orElse(null);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult supprimerUtilisateur(@Argument Integer id) {
        return utilisateurRepository.findById(id)
                .map(user -> {
                    if (user.getRole() == Utilisateur.Role.admin) {
                        return new ActionResult(false, "Impossible de supprimer un administrateur", null);
                    }
                    utilisateurRepository.deleteById(id);
                    return new ActionResult(true, "Utilisateur supprimé avec succès", id.toString());
                })
                .orElse(new ActionResult(false, "Utilisateur non trouvé", null));
    }

    // ============================================
    // GESTION DES COMMANDES
    // ============================================

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult changerStatutCommande(@Argument Integer id, @Argument Commande.Statut statut) {
        return commandeRepository.findById(id)
                .map(commande -> {
                    Commande.Statut ancienStatut = commande.getStatut();
                    commande.setStatut(statut);
                    commande.setDateModification(LocalDateTime.now());
                    commandeRepository.save(commande);
                    
                    return new ActionResult(true, 
                            "Statut modifié de " + ancienStatut + " à " + statut, 
                            id.toString());
                })
                .orElse(new ActionResult(false, "Commande non trouvée", null));
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult annulerCommande(@Argument Integer id, @Argument String motif) {
        return commandeRepository.findById(id)
                .map(commande -> {
                    if (commande.getStatut() == Commande.Statut.livree) {
                        return new ActionResult(false, 
                                "Impossible d'annuler une commande déjà livrée", null);
                    }
                    
                    commande.setStatut(Commande.Statut.annulee);
                    commande.setDateModification(LocalDateTime.now());
                    if (motif != null) {
                        commande.setCommentaires(
                                (commande.getCommentaires() != null ? 
                                        commande.getCommentaires() + "\n" : "") +
                                "Annulation: " + motif
                        );
                    }
                    commandeRepository.save(commande);
                    
                    // TODO: Libérer les stocks réservés
                    
                    return new ActionResult(true, "Commande annulée", id.toString());
                })
                .orElse(new ActionResult(false, "Commande non trouvée", null));
    }

    // ============================================
    // GESTION DES PRODUITS
    // ============================================

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Produit createProduit(@Argument ProduitInput input) {
        Produit produit = new Produit();
        produit.setNomProduit(input.getNomProduit());
        produit.setDescription(input.getDescription());
        produit.setPrix(BigDecimal.valueOf(input.getPrix()));
        produit.setIdCategorie(input.getIdCategorie());
        produit.setMarque(input.getMarque());
        if (input.getPoids() != null) {
            produit.setPoids(BigDecimal.valueOf(input.getPoids()));
        }
        produit.setDimensions(input.getDimensions());
        produit.setStatut(input.getStatut() != null ? input.getStatut() : Produit.Statut.disponible);
        produit.setDateCreation(LocalDateTime.now());
        produit.setDateModification(LocalDateTime.now());
        
        return produitRepository.save(produit);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Produit updateProduit(@Argument Integer id, @Argument ProduitInput input) {
        return produitRepository.findById(id)
                .map(produit -> {
                    if (input.getNomProduit() != null) produit.setNomProduit(input.getNomProduit());
                    if (input.getDescription() != null) produit.setDescription(input.getDescription());
                    if (input.getPrix() != null) produit.setPrix(BigDecimal.valueOf(input.getPrix()));
                    if (input.getIdCategorie() != null) produit.setIdCategorie(input.getIdCategorie());
                    if (input.getMarque() != null) produit.setMarque(input.getMarque());
                    if (input.getPoids() != null) produit.setPoids(BigDecimal.valueOf(input.getPoids()));
                    if (input.getDimensions() != null) produit.setDimensions(input.getDimensions());
                    if (input.getStatut() != null) produit.setStatut(input.getStatut());
                    produit.setDateModification(LocalDateTime.now());
                    
                    return produitRepository.save(produit);
                })
                .orElse(null);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult changerStatutProduit(@Argument Integer id, @Argument Produit.Statut statut) {
        return produitRepository.findById(id)
                .map(produit -> {
                    produit.setStatut(statut);
                    produit.setDateModification(LocalDateTime.now());
                    produitRepository.save(produit);
                    return new ActionResult(true, "Statut du produit modifié en " + statut, id.toString());
                })
                .orElse(new ActionResult(false, "Produit non trouvé", null));
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult supprimerProduit(@Argument Integer id) {
        if (produitRepository.existsById(id)) {
            produitRepository.deleteById(id);
            return new ActionResult(true, "Produit supprimé avec succès", id.toString());
        }
        return new ActionResult(false, "Produit non trouvé", null);
    }

    // ============================================
    // GESTION DES STOCKS
    // ============================================

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult approvisionnerStock(@Argument StockInput input) {
        return stockRepository.findByIdProduit(input.getIdProduit())
                .map(stock -> {
                    Integer quantiteAvant = stock.getQuantiteDisponible();
                    stock.setQuantiteDisponible(quantiteAvant + input.getQuantite());
                    stockRepository.save(stock);
                    
                    // Enregistrer le mouvement
                    MouvementStock mouvement = new MouvementStock();
                    mouvement.setIdProduit(input.getIdProduit());
                    mouvement.setTypeMouvement(MouvementStock.TypeMouvement.entree);
                    mouvement.setQuantite(input.getQuantite());
                    mouvement.setQuantiteAvant(quantiteAvant);
                    mouvement.setQuantiteApres(stock.getQuantiteDisponible());
                    mouvement.setCommentaire(input.getCommentaire() != null ? 
                            input.getCommentaire() : "Approvisionnement via GraphQL Admin");
                    mouvementRepository.save(mouvement);
                    
                    return new ActionResult(true, 
                            "Stock approvisionné: +" + input.getQuantite() + 
                            " (total: " + stock.getQuantiteDisponible() + ")", 
                            stock.getIdStock().toString());
                })
                .orElseGet(() -> {
                    // Créer un nouveau stock si n'existe pas
                    Stock newStock = new Stock(input.getIdProduit(), input.getQuantite());
                    stockRepository.save(newStock);
                    
                    MouvementStock mouvement = new MouvementStock();
                    mouvement.setIdProduit(input.getIdProduit());
                    mouvement.setTypeMouvement(MouvementStock.TypeMouvement.entree);
                    mouvement.setQuantite(input.getQuantite());
                    mouvement.setQuantiteAvant(0);
                    mouvement.setQuantiteApres(input.getQuantite());
                    mouvement.setCommentaire("Initialisation stock via GraphQL Admin");
                    mouvementRepository.save(mouvement);
                    
                    return new ActionResult(true, "Stock créé avec " + input.getQuantite() + " unités", 
                            newStock.getIdStock().toString());
                });
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult ajusterStock(
            @Argument Integer idProduit, 
            @Argument Integer quantite, 
            @Argument String commentaire) {
        
        return stockRepository.findByIdProduit(idProduit)
                .map(stock -> {
                    Integer quantiteAvant = stock.getQuantiteDisponible();
                    stock.setQuantiteDisponible(quantite);
                    stockRepository.save(stock);
                    
                    MouvementStock mouvement = new MouvementStock();
                    mouvement.setIdProduit(idProduit);
                    mouvement.setTypeMouvement(MouvementStock.TypeMouvement.ajustement);
                    mouvement.setQuantite(Math.abs(quantite - quantiteAvant));
                    mouvement.setQuantiteAvant(quantiteAvant);
                    mouvement.setQuantiteApres(quantite);
                    mouvement.setCommentaire(commentaire != null ? commentaire : "Ajustement manuel");
                    mouvementRepository.save(mouvement);
                    
                    return new ActionResult(true, 
                            "Stock ajusté de " + quantiteAvant + " à " + quantite, 
                            stock.getIdStock().toString());
                })
                .orElse(new ActionResult(false, "Stock non trouvé pour ce produit", null));
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult modifierSeuilAlerte(@Argument Integer idProduit, @Argument Integer seuil) {
        return stockRepository.findByIdProduit(idProduit)
                .map(stock -> {
                    stock.setSeuilAlerte(seuil);
                    stockRepository.save(stock);
                    return new ActionResult(true, "Seuil d'alerte modifié à " + seuil, 
                            stock.getIdStock().toString());
                })
                .orElse(new ActionResult(false, "Stock non trouvé pour ce produit", null));
    }

    // ============================================
    // GESTION DES CATÉGORIES
    // ============================================

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Categorie createCategorie(
            @Argument String nom, 
            @Argument String description, 
            @Argument String imageUrl) {
        
        Categorie categorie = new Categorie();
        categorie.setNomCategorie(nom);
        categorie.setDescription(description);
        categorie.setImageUrl(imageUrl);
        categorie.setDateCreation(LocalDateTime.now());
        
        return categorieRepository.save(categorie);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Categorie updateCategorie(
            @Argument Integer id,
            @Argument String nom, 
            @Argument String description, 
            @Argument String imageUrl) {
        
        return categorieRepository.findById(id)
                .map(categorie -> {
                    if (nom != null) categorie.setNomCategorie(nom);
                    if (description != null) categorie.setDescription(description);
                    if (imageUrl != null) categorie.setImageUrl(imageUrl);
                    return categorieRepository.save(categorie);
                })
                .orElse(null);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ActionResult supprimerCategorie(@Argument Integer id) {
        if (categorieRepository.existsById(id)) {
            // Vérifier s'il y a des produits dans cette catégorie
            if (!produitRepository.findByIdCategorie(id).isEmpty()) {
                return new ActionResult(false, 
                        "Impossible de supprimer: des produits utilisent cette catégorie", null);
            }
            categorieRepository.deleteById(id);
            return new ActionResult(true, "Catégorie supprimée avec succès", id.toString());
        }
        return new ActionResult(false, "Catégorie non trouvée", null);
    }

    // ============================================
    // MÉTHODES PRIVÉES
    // ============================================

    private void updateProduitNote(Integer idProduit) {
        Double noteMoyenne = avisRepository.getAverageNoteByProduit(idProduit);
        Long nombreAvis = avisRepository.countApprovedByProduit(idProduit);
        
        produitRepository.findById(idProduit).ifPresent(produit -> {
            produit.setNoteMoyenne(
                    noteMoyenne != null ? 
                    BigDecimal.valueOf(noteMoyenne) : 
                    BigDecimal.ZERO
            );
            produit.setNombreAvis(nombreAvis != null ? nombreAvis.intValue() : 0);
            produitRepository.save(produit);
        });
    }
}