package com.example.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "avis_produits")
public class AvisProduit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_avis")
    private Integer idAvis;

    @Column(name = "id_produit", nullable = false)
    private Integer idProduit;

    @Column(name = "id_utilisateur", nullable = false)
    private Integer idUtilisateur;

    @Column(nullable = false)
    private Integer note;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @Column(name = "date_avis")
    private LocalDateTime dateAvis = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_moderation", nullable = false)
    private StatutModeration statutModeration = StatutModeration.en_attente;

    @Column(name = "utile_count")
    private Integer utileCount = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_utilisateur", insertable = false, updatable = false)
    @JsonIgnoreProperties({"motDePasse", "email", "telephone", "adresse", "codePostal", "ville", "dateInscription", "statut", "role"})
    private Utilisateur utilisateur;

    // Enum
    public enum StatutModeration {
        en_attente, approuve, rejete
    }

    // Constructeurs
    public AvisProduit() {}

    // Getters et Setters
    public Integer getIdAvis() { return idAvis; }
    public void setIdAvis(Integer idAvis) { this.idAvis = idAvis; }

    public Integer getIdProduit() { return idProduit; }
    public void setIdProduit(Integer idProduit) { this.idProduit = idProduit; }

    public Integer getIdUtilisateur() { return idUtilisateur; }
    public void setIdUtilisateur(Integer idUtilisateur) { this.idUtilisateur = idUtilisateur; }

    public Integer getNote() { return note; }
    public void setNote(Integer note) { 
        if (note < 1 || note > 5) {
            throw new IllegalArgumentException("La note doit être entre 1 et 5");
        }
        this.note = note; 
    }

    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }

    public String getCommentaire() { return commentaire; }
    public void setCommentaire(String commentaire) { this.commentaire = commentaire; }

    public LocalDateTime getDateAvis() { return dateAvis; }
    public void setDateAvis(LocalDateTime dateAvis) { this.dateAvis = dateAvis; }

    public StatutModeration getStatutModeration() { return statutModeration; }
    public void setStatutModeration(StatutModeration statutModeration) { this.statutModeration = statutModeration; }

    public Integer getUtileCount() { return utileCount; }
    public void setUtileCount(Integer utileCount) { this.utileCount = utileCount; }
}