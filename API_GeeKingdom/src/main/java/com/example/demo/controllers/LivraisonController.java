package com.example.demo.controllers;

import com.example.demo.models.Livraison;
import com.example.demo.repositories.LivraisonRepository;
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

@Tag(name = "Livraisons", description = "Gestion et suivi des livraisons")
@SecurityRequirement(name = "JWT")
@RestController
@RequestMapping("/api/livraisons")
public class LivraisonController {

    @Autowired
    private LivraisonRepository livraisonRepository;

    @Operation(summary = "Liste toutes les livraisons")
    @ApiResponse(responseCode = "200", description = "Liste des livraisons")
    @GetMapping
    public List<Livraison> getAll() {
        return livraisonRepository.findAll();
    }

    @Operation(summary = "Détails d'une livraison")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livraison trouvée"),
            @ApiResponse(responseCode = "404", description = "Livraison non trouvée")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Livraison> getById(
            @Parameter(description = "ID de la livraison") @PathVariable Integer id
    ) {
        return livraisonRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Livraison d'une commande")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livraison trouvée"),
            @ApiResponse(responseCode = "404", description = "Pas de livraison pour cette commande")
    })
    @GetMapping("/commande/{idCommande}")
    public ResponseEntity<Livraison> getByCommande(
            @Parameter(description = "ID de la commande") @PathVariable Integer idCommande
    ) {
        return livraisonRepository.findByIdCommande(idCommande)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Suivi de colis par numéro de suivi",
            description = "Permet au client de suivre son colis sans être connecté"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Colis trouvé"),
            @ApiResponse(responseCode = "404", description = "Numéro de suivi invalide")
    })
    @GetMapping("/suivi/{numeroSuivi}")
    public ResponseEntity<Livraison> getByNumeroSuivi(
            @Parameter(description = "Numéro de suivi", example = "TRK-ABC123DEF456")
            @PathVariable String numeroSuivi
    ) {
        return livraisonRepository.findByNumeroSuivi(numeroSuivi)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Créer une livraison",
            description = "Génère automatiquement un numéro de suivi"
    )
    @ApiResponse(responseCode = "200", description = "Livraison créée")
    @PostMapping
    public Livraison create(
            @Parameter(description = "Données de la livraison")
            @RequestBody Livraison livraison
    ) {
        livraison.setNumeroSuivi("TRK-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
        livraison.setStatutLivraison(Livraison.StatutLivraison.en_attente);
        return livraisonRepository.save(livraison);
    }

    @Operation(
            summary = "Marquer comme expédiée",
            description = "Passe le statut à 'en_transit' et enregistre la date d'expédition"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Colis expédié"),
            @ApiResponse(responseCode = "404", description = "Livraison non trouvée")
    })
    @PutMapping("/{id}/expedier")
    public ResponseEntity<?> expedier(
            @Parameter(description = "ID de la livraison") @PathVariable Integer id
    ) {
        return livraisonRepository.findById(id)
            .map(livraison -> {
                livraison.setStatutLivraison(Livraison.StatutLivraison.en_transit);
                livraison.setDateExpedition(LocalDateTime.now());
                livraisonRepository.save(livraison);
                return ResponseEntity.ok(Map.of("message", "Colis expédié"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Marquer comme livrée",
            description = "Passe le statut à 'livree' et enregistre la date de livraison réelle"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Colis livré"),
            @ApiResponse(responseCode = "404", description = "Livraison non trouvée")
    })
    @PutMapping("/{id}/livrer")
    public ResponseEntity<?> livrer(
            @Parameter(description = "ID de la livraison") @PathVariable Integer id
    ) {
        return livraisonRepository.findById(id)
            .map(livraison -> {
                livraison.setStatutLivraison(Livraison.StatutLivraison.livree);
                livraison.setDateLivraisonReelle(LocalDateTime.now());
                livraisonRepository.save(livraison);
                return ResponseEntity.ok(Map.of("message", "Colis livré"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}