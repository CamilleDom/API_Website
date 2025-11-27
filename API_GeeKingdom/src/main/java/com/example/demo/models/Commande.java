package com.example.demo.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "commandes")
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_commande")
    private Integer idCommande;

    @Column(name = "id_utilisateur", nullable = false)
    private Integer idUtilisateur;

    @Column(name = "numero_commande", nullable = false, unique = true, length = 50)
    private String numeroCommande;

    @Column(name = "montant_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montantTotal;

    @Column(name = "montant_livraison", precision = 10, scale = 2)
    private BigDecimal montantLivraison = BigDecimal.ZERO;

    @Column(name = "montant_taxe", precision = 10, scale = 2)
    private BigDecimal montantTaxe = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Statut statut = Statut.en_attente;

    @Column(name = "adresse_livraison", nullable = false, columnDefinition = "TEXT")
    private String adresseLivraison;

    @Column(name = "ville_livraison", nullable = false, length = 100)
    private String villeLivraison;

    @Column(name = "code_postal_livraison", nullable = false, length = 10)
    private String codePostalLivraison;

    @Column(name = "pays_livraison", length = 100)
    private String paysLivraison = "France";

    @Column(name = "date_commande")
    private LocalDateTime dateCommande = LocalDateTime.now();

    @Column(name = "date_modification")
    private LocalDateTime dateModification = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String commentaires;

    @Column(name = "code_promo", length = 50)
    private String codePromo;

    @Column(precision = 10, scale = 2)
    private BigDecimal reduction = BigDecimal.ZERO;

    // Enum
    public enum Statut {
        en_attente, confirmee, en_preparation, expediee, livree, annulee
    }

    // Constructeurs
    public Commande() {}

    // Getters et Setters
    public Integer getIdCommande() { return idCommande; }
    public void setIdCommande(Integer idCommande) { this.idCommande = idCommande; }

    public Integer getIdUtilisateur() { return idUtilisateur; }
    public void setIdUtilisateur(Integer idUtilisateur) { this.idUtilisateur = idUtilisateur; }

    public String getNumeroCommande() { return numeroCommande; }
    public void setNumeroCommande(String numeroCommande) { this.numeroCommande = numeroCommande; }

    public BigDecimal getMontantTotal() { return montantTotal; }
    public void setMontantTotal(BigDecimal montantTotal) { this.montantTotal = montantTotal; }

    public BigDecimal getMontantLivraison() { return montantLivraison; }
    public void setMontantLivraison(BigDecimal montantLivraison) { this.montantLivraison = montantLivraison; }

    public BigDecimal getMontantTaxe() { return montantTaxe; }
    public void setMontantTaxe(BigDecimal montantTaxe) { this.montantTaxe = montantTaxe; }

    public Statut getStatut() { return statut; }
    public void setStatut(Statut statut) { this.statut = statut; }

    public String getAdresseLivraison() { return adresseLivraison; }
    public void setAdresseLivraison(String adresseLivraison) { this.adresseLivraison = adresseLivraison; }

    public String getVilleLivraison() { return villeLivraison; }
    public void setVilleLivraison(String villeLivraison) { this.villeLivraison = villeLivraison; }

    public String getCodePostalLivraison() { return codePostalLivraison; }
    public void setCodePostalLivraison(String codePostalLivraison) { this.codePostalLivraison = codePostalLivraison; }

    public String getPaysLivraison() { return paysLivraison; }
    public void setPaysLivraison(String paysLivraison) { this.paysLivraison = paysLivraison; }

    public LocalDateTime getDateCommande() { return dateCommande; }
    public void setDateCommande(LocalDateTime dateCommande) { this.dateCommande = dateCommande; }

    public LocalDateTime getDateModification() { return dateModification; }
    public void setDateModification(LocalDateTime dateModification) { this.dateModification = dateModification; }

    public String getCommentaires() { return commentaires; }
    public void setCommentaires(String commentaires) { this.commentaires = commentaires; }

    public String getCodePromo() { return codePromo; }
    public void setCodePromo(String codePromo) { this.codePromo = codePromo; }

    public BigDecimal getReduction() { return reduction; }
    public void setReduction(BigDecimal reduction) { this.reduction = reduction; }
}