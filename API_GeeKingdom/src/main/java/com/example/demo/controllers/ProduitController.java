package com.example.demo.controllers;

import com.example.demo.models.Produit;
import com.example.demo.repositories.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Produits", description = "Gestion du catalogue de produits")
@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    @Autowired
    private ProduitRepository produitRepository;

    @Operation(summary = "Récupérer tous les produits", description = "Liste tous les produits, avec filtre optionnel par catégorie")
    @ApiResponse(responseCode = "200", description = "Liste des produits")
    @GetMapping
    public List<Produit> getAll(
            @Parameter(description = "ID de la catégorie pour filtrer")
            @RequestParam(required = false) Integer categorie) {
        if (categorie != null) {
            return produitRepository.findByIdCategorie(categorie);
        }
        return produitRepository.findAll();
    }

    @Operation(summary = "Récupérer un produit par ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produit trouvé"),
            @ApiResponse(responseCode = "404", description = "Produit non trouvé")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Produit> getById(
            @Parameter(description = "ID du produit", required = true, example = "1")
            @PathVariable Integer id) {
        return produitRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Créer un nouveau produit")
    @ApiResponse(responseCode = "200", description = "Produit créé avec succès")
    @PostMapping
    public Produit create(
            @Parameter(description = "Données du produit à créer")
            @RequestBody Produit produit) {
        return produitRepository.save(produit);
    }

    @Operation(summary = "Mettre à jour un produit")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produit mis à jour"),
            @ApiResponse(responseCode = "404", description = "Produit non trouvé")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Produit> update(
            @Parameter(description = "ID du produit") @PathVariable Integer id,
            @Parameter(description = "Nouvelles données") @RequestBody Produit produit) {
        return produitRepository.findById(id)
                .map(existing -> {
                    produit.setIdProduit(id);
                    return ResponseEntity.ok(produitRepository.save(produit));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Supprimer un produit")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produit supprimé"),
            @ApiResponse(responseCode = "404", description = "Produit non trouvé")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @Parameter(description = "ID du produit") @PathVariable Integer id) {
        if (produitRepository.existsById(id)) {
            produitRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}