package com.example.demo.controllers;

import com.example.demo.models.Paiement;
import com.example.demo.models.Commande;
import com.example.demo.repositories.PaiementRepository;
import com.example.demo.repositories.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {

    @Autowired
    private PaiementRepository paiementRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    // ✅ LISTE TOUS LES PAIEMENTS
    @GetMapping
    public List<Paiement> getAll() {
        return paiementRepository.findAll();
    }

    // ✅ PAIEMENT PAR ID
    @GetMapping("/{id}")
    public ResponseEntity<Paiement> getById(@PathVariable Integer id) {
        return paiementRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ PAIEMENTS D'UNE COMMANDE
    @GetMapping("/commande/{idCommande}")
    public List<Paiement> getByCommande(@PathVariable Integer idCommande) {
        return paiementRepository.findByIdCommande(idCommande);
    }

    // ✅ PAIEMENT PAR TRANSACTION ID
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Paiement> getByTransactionId(@PathVariable String transactionId) {
        return paiementRepository.findByTransactionId(transactionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ CRÉER UN PAIEMENT
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Paiement paiement) {
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

    // ✅ TRAITER LE PAIEMENT (simulation) - FIXED VERSION
    @PostMapping("/{id}/traiter")
    public ResponseEntity<?> traiter(@PathVariable Integer id) {
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

    // ✅ REMBOURSER UN PAIEMENT
    @PostMapping("/{id}/rembourser")
    public ResponseEntity<?> rembourser(@PathVariable Integer id) {
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

    // ✅ STATISTIQUES DES PAIEMENTS
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