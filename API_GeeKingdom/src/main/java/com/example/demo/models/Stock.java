package com.example.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stocks")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_stock")
    private Integer idStock;

    @Column(name = "id_produit", nullable = false, unique = true)
    private Integer idProduit;

    @Column(name = "quantite_disponible", nullable = false)
    private Integer quantiteDisponible = 0;

    @Column(name = "quantite_reservee", nullable = false)
    private Integer quantiteReservee = 0;

    @Column(name = "seuil_alerte", nullable = false)
    private Integer seuilAlerte = 10;

    @Column(length = 100)
    private String emplacement;

    @Column(name = "date_derniere_maj")
    private LocalDateTime dateDerniereMaj = LocalDateTime.now();

    // Constructeurs
    public Stock() {}

    public Stock(Integer idProduit, Integer quantiteDisponible) {
        this.idProduit = idProduit;
        this.quantiteDisponible = quantiteDisponible;
    }

    // Méthodes utilitaires
    public Integer getQuantiteTotale() {
        return quantiteDisponible + quantiteReservee;
    }

    public boolean isEnRuptureStock() {
        return quantiteDisponible <= 0;
    }

    public boolean isAlerteSeuil() {
        return quantiteDisponible <= seuilAlerte;
    }

    // Getters et Setters
    public Integer getIdStock() { return idStock; }
    public void setIdStock(Integer idStock) { this.idStock = idStock; }

    public Integer getIdProduit() { return idProduit; }
    public void setIdProduit(Integer idProduit) { this.idProduit = idProduit; }

    public Integer getQuantiteDisponible() { return quantiteDisponible; }
    public void setQuantiteDisponible(Integer quantiteDisponible) { 
        this.quantiteDisponible = quantiteDisponible; 
        this.dateDerniereMaj = LocalDateTime.now();
    }

    public Integer getQuantiteReservee() { return quantiteReservee; }
    public void setQuantiteReservee(Integer quantiteReservee) { 
        this.quantiteReservee = quantiteReservee; 
        this.dateDerniereMaj = LocalDateTime.now();
    }

    public Integer getSeuilAlerte() { return seuilAlerte; }
    public void setSeuilAlerte(Integer seuilAlerte) { this.seuilAlerte = seuilAlerte; }

    public String getEmplacement() { return emplacement; }
    public void setEmplacement(String emplacement) { this.emplacement = emplacement; }

    public LocalDateTime getDateDerniereMaj() { return dateDerniereMaj; }
    public void setDateDerniereMaj(LocalDateTime dateDerniereMaj) { this.dateDerniereMaj = dateDerniereMaj; }
}