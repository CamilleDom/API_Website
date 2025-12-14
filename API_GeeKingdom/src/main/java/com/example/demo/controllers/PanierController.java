package com.example.demo.controllers;

import com.example.demo.models.Panier;
import com.example.demo.repositories.PanierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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

@Tag(name = "Panier", description = "Gestion du panier utilisateur")
@SecurityRequirement(name = "JWT")
@RestController
@RequestMapping("/api/panier")
public class PanierController {


    @Autowired
    private PanierRepository panierRepository;

    @Operation(summary = "Récupérer le panier d'un utilisateur")
    @ApiResponse(responseCode = "200", description = "Panier récupéré")
    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<Panier> getByUtilisateur(
            @Parameter(description = "ID de l'utilisateur", required = true)
            @PathVariable Integer idUtilisateur
    ) {
        return panierRepository.findByIdUtilisateur(idUtilisateur);
    }

    @Operation(
            summary = "Ajouter un produit au panier",
            description = "Si le produit existe déjà, la quantité est incrémentée"
    )
    @ApiResponse(responseCode = "200", description = "Produit ajouté au panier")
    @PostMapping
    public ResponseEntity<?> add(
            @Parameter(description = "Informations du produit à ajouter")
            @RequestBody Panier panier
    ) {
        // Vérifier si le produit est déjà dans le panier
        return panierRepository.findByIdUtilisateurAndIdProduit(
            panier.getIdUtilisateur(), 
            panier.getIdProduit()
        )
        .map(existing -> {
            // Mettre à jour la quantité
            existing.setQuantite(existing.getQuantite() + panier.getQuantite());
            existing.setDateModification(LocalDateTime.now());
            panierRepository.save(existing);
            return ResponseEntity.ok(existing);
        })
        .orElseGet(() -> {
            // Ajouter un nouveau produit
            Panier saved = panierRepository.save(panier);
            return ResponseEntity.ok(saved);
        });
    }

    @Operation(summary = "Modifier la quantité d'un produit dans le panier")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Quantité mise à jour"),
            @ApiResponse(responseCode = "404", description = "Article non trouvé")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuantite(
            @Parameter(description = "ID de l'article du panier") @PathVariable Integer id,
            @RequestBody Map<String, Integer> body
    ) {
        Integer quantite = body.get("quantite");
        
        return panierRepository.findById(id)
            .map(panier -> {
                panier.setQuantite(quantite);
                panier.setDateModification(LocalDateTime.now());
                panierRepository.save(panier);
                return ResponseEntity.ok(panier);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Retirer un produit du panier")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produit retiré"),
            @ApiResponse(responseCode = "404", description = "Article non trouvé")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @Parameter(description = "ID de l'article") @PathVariable Integer id
    ) {
        if (panierRepository.existsById(id)) {
            panierRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Produit retiré du panier"));
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(
            summary = "Vider le panier d'un utilisateur",
            description = "Supprime tous les articles du panier"
    )
    @ApiResponse(responseCode = "200", description = "Panier vidé")
    @DeleteMapping("/utilisateur/{idUtilisateur}/vider")
    public ResponseEntity<?> vider(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Integer idUtilisateur
    ) {
        panierRepository.deleteByIdUtilisateur(idUtilisateur);
        return ResponseEntity.ok(Map.of("message", "Panier vidé"));
    }
}