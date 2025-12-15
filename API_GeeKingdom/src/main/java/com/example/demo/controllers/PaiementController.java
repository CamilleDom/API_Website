package com.example.demo.controllers;

import com.example.demo.models.Paiement;
import com.example.demo.models.Commande;
import com.example.demo.repositories.PaiementRepository;
import com.example.demo.repositories.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "Paiements", description = "Gestion des paiements et transactions")
@SecurityRequirement(name = "JWT")
@RestController
@RequestMapping("/api/paiements")
public class PaiementController {

    @Autowired
    private PaiementRepository paiementRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    @Operation(summary = "Liste tous les paiements", description = "Admin uniquement")
    @ApiResponse(responseCode = "200", description = "Liste des paiements")
    @GetMapping
    public List<Paiement> getAll() {
        return paiementRepository.findAll();
    }

    @Operation(summary = "Détails d'un paiement")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paiement trouvé"),
            @ApiResponse(responseCode = "404", description = "Paiement non trouvé")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Paiement> getById(
            @Parameter(description = "ID du paiement") @PathVariable Integer id
    ) {
        return paiementRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Paiements d'une commande",
            description = "Retourne tous les paiements liés à une commande"
    )
    @ApiResponse(responseCode = "200", description = "Liste des paiements")
    @GetMapping("/commande/{idCommande}")
    public List<Paiement> getByCommande(
            @Parameter(description = "ID de la commande") @PathVariable Integer idCommande
    ) {
        return paiementRepository.findByIdCommande(idCommande);
    }

    @Operation(summary = "Rechercher un paiement par ID de transaction")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paiement trouvé"),
            @ApiResponse(responseCode = "404", description = "Transaction introuvable")
    })
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Paiement> getByTransactionId(
            @Parameter(description = "ID de transaction", example = "TXN-ABC123DEF456")
            @PathVariable String transactionId
    ) {
        return paiementRepository.findByTransactionId(transactionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Créer un paiement",
            description = "Génère automatiquement un ID de transaction unique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paiement créé"),
            @ApiResponse(responseCode = "400", description = "Commande introuvable")
    })
    @PostMapping
    public ResponseEntity<?> create(
            @Parameter(description = "Données du paiement")
            @RequestBody Paiement paiement
    ) {
        // Vérifier que la commande existe
        if (!commandeRepository.existsById(paiement.getIdCommande())) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Commande introuvable")
            );
        }

        // Générer un ID de transaction unique
        paiement.setTransactionId("TXN-" + UUID.randomUUID().toString().toUpperCase().substring(0, 16));
        paiement.setStatutPaiement(Paiement.StatutPaiement.en_attente);
        paiement.setDatePaiement(LocalDateTime.now());

        Paiement saved = paiementRepository.save(paiement);
        return ResponseEntity.ok(saved);
    }

    @Operation(
            summary = "Traiter un paiement",
            description = "Simule le traitement du paiement (90% de succès). Met à jour le statut de la commande si réussi."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paiement réussi"),
            @ApiResponse(responseCode = "400", description = "Paiement échoué"),
            @ApiResponse(responseCode = "404", description = "Paiement non trouvé")
    })
    @PostMapping("/{id}/traiter")
    public ResponseEntity<?> traiter(
            @Parameter(description = "ID du paiement") @PathVariable Integer id
    ) {
        return paiementRepository.findById(id)
                .map(paiement -> {
                    // Simulation du traitement (dans la vraie vie, appel à une API de paiement)
                    boolean paiementReussi = Math.random() > 0.1; // 90% de succès

                    if (paiementReussi) {
                        paiement.setStatutPaiement(Paiement.StatutPaiement.reussi);

                        // ⚠️ CRITICAL FIX: Save the updated payment before updating the order
                        paiementRepository.save(paiement);

                        // Mettre à jour le statut de la commande
                        commandeRepository.findById(paiement.getIdCommande()).ifPresent(commande -> {
                            commande.setStatut(Commande.Statut.confirmee);
                            commandeRepository.save(commande);
                        });

                        return ResponseEntity.ok(Map.of(
                                "message", "Paiement réussi",
                                "transactionId", paiement.getTransactionId()
                        ));
                    } else {
                        paiement.setStatutPaiement(Paiement.StatutPaiement.echoue);

                        // ⚠️ CRITICAL FIX: Save the payment status even on failure
                        paiementRepository.save(paiement);

                        return ResponseEntity.status(400).body(Map.of(
                                "error", "Paiement échoué"
                        ));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Rembourser un paiement",
            description = "Annule la commande associée"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paiement remboursé"),
            @ApiResponse(responseCode = "400", description = "Seuls les paiements réussis peuvent être remboursés"),
            @ApiResponse(responseCode = "404", description = "Paiement non trouvé")
    })
    @PostMapping("/{id}/rembourser")
    public ResponseEntity<?> rembourser(
            @Parameter(description = "ID du paiement") @PathVariable Integer id
    ) {
        return paiementRepository.findById(id)
                .map(paiement -> {
                    if (paiement.getStatutPaiement() != Paiement.StatutPaiement.reussi) {
                        return ResponseEntity.badRequest().body(
                                Map.of("error", "Seuls les paiements réussis peuvent être remboursés")
                        );
                    }

                    paiement.setStatutPaiement(Paiement.StatutPaiement.rembourse);
                    paiementRepository.save(paiement);

                    // Mettre à jour le statut de la commande
                    commandeRepository.findById(paiement.getIdCommande()).ifPresent(commande -> {
                        commande.setStatut(Commande.Statut.annulee);
                        commandeRepository.save(commande);
                    });

                    return ResponseEntity.ok(Map.of("message", "Paiement remboursé"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Statistiques des paiements",
            description = "Retourne le total, les paiements réussis, échoués, en attente et le taux de réussite"
    )
    @ApiResponse(responseCode = "200", description = "Statistiques calculées")
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long total = paiementRepository.count();
        long reussis = paiementRepository.findByStatutPaiement(Paiement.StatutPaiement.reussi).size();
        long echoues = paiementRepository.findByStatutPaiement(Paiement.StatutPaiement.echoue).size();
        long enAttente = paiementRepository.findByStatutPaiement(Paiement.StatutPaiement.en_attente).size();

        return ResponseEntity.ok(Map.of(
                "total", total,
                "reussis", reussis,
                "echoues", echoues,
                "enAttente", enAttente,
                "tauxReussite", total > 0 ? (reussis * 100.0 / total) : 0
        ));
    }
}