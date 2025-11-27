package com.example.demo.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "livraisons")
public class Livraison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_livraison")
    private Integer idLivraison;

    @Column(name = "id_commande", nullable = false)
    private Integer idCommande;

    @Column(length = 100)
    private String transporteur;

    @Column(name = "numero_suivi", unique = true, length = 100)
    private String numeroSuivi;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_livraison", nullable = false)
    private StatutLivraison statutLivraison = StatutLivraison.en_attente;

    @Column(name = "date_expedition")
    private LocalDateTime dateExpedition;

    @Column(name = "date_livraison_estimee")
    private LocalDate dateLivraisonEstimee;

    @Column(name = "date_livraison_reelle")
    private LocalDateTime dateLivraisonReelle;

    @Column(name = "signature_destinataire")
    private String signatureDestinataire;

    @Column(columnDefinition = "TEXT")
    private String commentaires;

    // Enum
    public enum StatutLivraison {
        en_attente, en_transit, en_cours_de_livraison, livree, echec, retournee
    }

    // Constructeurs
    public Livraison() {}

    // Getters et Setters
    public Integer getIdLivraison() { return idLivraison; }
    public void setIdLivraison(Integer idLivraison) { this.idLivraison = idLivraison; }

    public Integer getIdCommande() { return idCommande; }
    public void setIdCommande(Integer idCommande) { this.idCommande = idCommande; }

    public String getTransporteur() { return transporteur; }
    public void setTransporteur(String transporteur) { this.transporteur = transporteur; }

    public String getNumeroSuivi() { return numeroSuivi; }
    public void setNumeroSuivi(String numeroSuivi) { this.numeroSuivi = numeroSuivi; }

    public StatutLivraison getStatutLivraison() { return statutLivraison; }
    public void setStatutLivraison(StatutLivraison statutLivraison) { this.statutLivraison = statutLivraison; }

    public LocalDateTime getDateExpedition() { return dateExpedition; }
    public void setDateExpedition(LocalDateTime dateExpedition) { this.dateExpedition = dateExpedition; }

    public LocalDate getDateLivraisonEstimee() { return dateLivraisonEstimee; }
    public void setDateLivraisonEstimee(LocalDate dateLivraisonEstimee) { this.dateLivraisonEstimee = dateLivraisonEstimee; }

    public LocalDateTime getDateLivraisonReelle() { return dateLivraisonReelle; }
    public void setDateLivraisonReelle(LocalDateTime dateLivraisonReelle) { this.dateLivraisonReelle = dateLivraisonReelle; }

    public String getSignatureDestinataire() { return signatureDestinataire; }
    public void setSignatureDestinataire(String signatureDestinataire) { this.signatureDestinataire = signatureDestinataire; }

    public String getCommentaires() { return commentaires; }
    public void setCommentaires(String commentaires) { this.commentaires = commentaires; }
}