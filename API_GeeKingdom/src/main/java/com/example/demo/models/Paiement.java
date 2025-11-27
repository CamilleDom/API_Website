package com.example.demo.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiements")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paiement")
    private Integer idPaiement;

    @Column(name = "id_commande", nullable = false)
    private Integer idCommande;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

    @Enumerated(EnumType.STRING)
    @Column(name = "methode_paiement", nullable = false)
    private MethodePaiement methodePaiement;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_paiement", nullable = false)
    private StatutPaiement statutPaiement = StatutPaiement.en_attente;

    @Column(name = "transaction_id", unique = true, length = 100)
    private String transactionId;

    @Column(name = "date_paiement")
    private LocalDateTime datePaiement = LocalDateTime.now();

    @Column(name = "informations_json", columnDefinition = "JSON")
    private String informationsJson;

    // Enums
    public enum MethodePaiement {
        carte_bancaire, paypal, virement, especes, cheque
    }

    public enum StatutPaiement {
        en_attente, reussi, echoue, rembourse
    }

    // Constructeurs
    public Paiement() {}

    // Getters et Setters
    public Integer getIdPaiement() { return idPaiement; }
    public void setIdPaiement(Integer idPaiement) { this.idPaiement = idPaiement; }

    public Integer getIdCommande() { return idCommande; }
    public void setIdCommande(Integer idCommande) { this.idCommande = idCommande; }

    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }

    public MethodePaiement getMethodePaiement() { return methodePaiement; }
    public void setMethodePaiement(MethodePaiement methodePaiement) { this.methodePaiement = methodePaiement; }

    public StatutPaiement getStatutPaiement() { return statutPaiement; }
    public void setStatutPaiement(StatutPaiement statutPaiement) { this.statutPaiement = statutPaiement; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public LocalDateTime getDatePaiement() { return datePaiement; }
    public void setDatePaiement(LocalDateTime datePaiement) { this.datePaiement = datePaiement; }

    public String getInformationsJson() { return informationsJson; }
    public void setInformationsJson(String informationsJson) { this.informationsJson = informationsJson; }
}