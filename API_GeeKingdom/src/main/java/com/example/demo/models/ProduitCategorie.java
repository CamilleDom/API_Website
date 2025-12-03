package com.example.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "produit_categories")
public class ProduitCategorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produit_categorie")
    private Integer idProduitCategorie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produit", nullable = false)
    private Produit produit;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_categorie", nullable = false)
    private Categorie categorie;

    @Column(name = "ordre_affichage")
    private Integer ordreAffichage = 0;

    @Column(name = "est_categorie_principale")
    private Boolean estCategoriePrincipale = false;

    @Column(name = "date_ajout")
    private LocalDateTime dateAjout = LocalDateTime.now();

    // Constructeurs
    public ProduitCategorie() {}

    public ProduitCategorie(Produit produit, Categorie categorie, Boolean principale) {
        this.produit = produit;
        this.categorie = categorie;
        this.estCategoriePrincipale = principale;
        this.dateAjout = LocalDateTime.now();
    }

    // Getters et Setters
    public Integer getIdProduitCategorie() {
        return idProduitCategorie;
    }

    public void setIdProduitCategorie(Integer idProduitCategorie) {
        this.idProduitCategorie = idProduitCategorie;
    }

    public Produit getProduit() {
        return produit;
    }

    public void setProduit(Produit produit) {
        this.produit = produit;
    }

    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }

    public Integer getOrdreAffichage() {
        return ordreAffichage;
    }

    public void setOrdreAffichage(Integer ordreAffichage) {
        this.ordreAffichage = ordreAffichage;
    }

    public Boolean getEstCategoriePrincipale() {
        return estCategoriePrincipale;
    }

    public void setEstCategoriePrincipale(Boolean estCategoriePrincipale) {
        this.estCategoriePrincipale = estCategoriePrincipale;
    }

    public LocalDateTime getDateAjout() {
        return dateAjout;
    }

    public void setDateAjout(LocalDateTime dateAjout) {
        this.dateAjout = dateAjout;
    }
}
