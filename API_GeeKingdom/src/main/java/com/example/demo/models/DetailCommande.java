package com.example.demo.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "details_commande")
public class DetailCommande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detail")
    private Integer idDetail;

    @Column(name = "id_commande", nullable = false)
    private Integer idCommande;

    @Column(name = "id_produit", nullable = false)
    private Integer idProduit;

    @Column(nullable = false)
    private Integer quantite;

    @Column(name = "prix_unitaire", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    @Column(name = "prix_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixTotal;

    // Constructeurs
    public DetailCommande() {}

    public DetailCommande(Integer idCommande, Integer idProduit, Integer quantite, BigDecimal prixUnitaire) {
        this.idCommande = idCommande;
        this.idProduit = idProduit;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
        // ✅ FIX: Calculer seulement si les valeurs ne sont pas nulles
        if (prixUnitaire != null && quantite != null) {
            this.prixTotal = prixUnitaire.multiply(BigDecimal.valueOf(quantite));
        }
    }

    // ✅ IMPROVED: Méthode utilitaire avec vérification null
    public void calculerPrixTotal() {
        // ✅ FIX: Ne calculer que si prixUnitaire et quantite ne sont pas null
        if (this.prixUnitaire != null && this.quantite != null) {
            this.prixTotal = this.prixUnitaire.multiply(BigDecimal.valueOf(this.quantite));
        }
    }

    // Getters et Setters
    public Integer getIdDetail() { return idDetail; }
    public void setIdDetail(Integer idDetail) { this.idDetail = idDetail; }

    public Integer getIdCommande() { return idCommande; }
    public void setIdCommande(Integer idCommande) { this.idCommande = idCommande; }

    public Integer getIdProduit() { return idProduit; }
    public void setIdProduit(Integer idProduit) { this.idProduit = idProduit; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
        // ✅ FIX: Calculer seulement si possible
        if (this.prixUnitaire != null && quantite != null) {
            calculerPrixTotal();
        }
    }

    public BigDecimal getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(BigDecimal prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
        if (prixUnitaire != null && this.quantite != null) {
            calculerPrixTotal();
        }
    }

    public BigDecimal getPrixTotal() { return prixTotal; }
    public void setPrixTotal(BigDecimal prixTotal) { this.prixTotal = prixTotal; }
}