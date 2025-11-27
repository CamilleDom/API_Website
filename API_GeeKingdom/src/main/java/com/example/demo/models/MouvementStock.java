package com.example.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mouvements_stock")
public class MouvementStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mouvement")
    private Integer idMouvement;

    @Column(name = "id_produit", nullable = false)
    private Integer idProduit;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_mouvement", nullable = false)
    private TypeMouvement typeMouvement;

    @Column(nullable = false)
    private Integer quantite;

    @Column(name = "quantite_avant", nullable = false)
    private Integer quantiteAvant;

    @Column(name = "quantite_apres", nullable = false)
    private Integer quantiteApres;

    @Column(name = "reference_commande")
    private Integer referenceCommande;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @Column(name = "id_utilisateur")
    private Integer idUtilisateur;

    @Column(name = "date_mouvement")
    private LocalDateTime dateMouvement = LocalDateTime.now();

    // Enum
    public enum TypeMouvement {
        entree,         // Approvisionnement
        sortie,         // Vente
        reservation,    // Réservation pour commande
        liberation,     // Annulation de réservation
        ajustement      // Correction manuelle
    }

    // Constructeurs
    public MouvementStock() {}

    public MouvementStock(Integer idProduit, TypeMouvement typeMouvement, Integer quantite, 
                          Integer quantiteAvant, Integer quantiteApres) {
        this.idProduit = idProduit;
        this.typeMouvement = typeMouvement;
        this.quantite = quantite;
        this.quantiteAvant = quantiteAvant;
        this.quantiteApres = quantiteApres;
    }

    // Getters et Setters
    public Integer getIdMouvement() { return idMouvement; }
    public void setIdMouvement(Integer idMouvement) { this.idMouvement = idMouvement; }

    public Integer getIdProduit() { return idProduit; }
    public void setIdProduit(Integer idProduit) { this.idProduit = idProduit; }

    public TypeMouvement getTypeMouvement() { return typeMouvement; }
    public void setTypeMouvement(TypeMouvement typeMouvement) { this.typeMouvement = typeMouvement; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }

    public Integer getQuantiteAvant() { return quantiteAvant; }
    public void setQuantiteAvant(Integer quantiteAvant) { this.quantiteAvant = quantiteAvant; }

    public Integer getQuantiteApres() { return quantiteApres; }
    public void setQuantiteApres(Integer quantiteApres) { this.quantiteApres = quantiteApres; }

    public Integer getReferenceCommande() { return referenceCommande; }
    public void setReferenceCommande(Integer referenceCommande) { this.referenceCommande = referenceCommande; }

    public String getCommentaire() { return commentaire; }
    public void setCommentaire(String commentaire) { this.commentaire = commentaire; }

    public Integer getIdUtilisateur() { return idUtilisateur; }
    public void setIdUtilisateur(Integer idUtilisateur) { this.idUtilisateur = idUtilisateur; }

    public LocalDateTime getDateMouvement() { return dateMouvement; }
    public void setDateMouvement(LocalDateTime dateMouvement) { this.dateMouvement = dateMouvement; }
}