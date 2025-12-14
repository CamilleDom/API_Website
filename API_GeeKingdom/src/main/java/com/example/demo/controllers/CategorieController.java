package com.example.demo.controllers;

import com.example.demo.models.Categorie;
import com.example.demo.repositories.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Catégories", description = "Gestion des catégories de produits")
@RestController
@RequestMapping("/api/categories")
public class CategorieController {

    @Autowired
    private CategorieRepository categorieRepository;

    @Operation(summary = "Liste toutes les catégories")
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    @GetMapping
    public List<Categorie> getAll() {
        return categorieRepository.findAll();
    }

    @Operation(summary = "Récupérer une catégorie par ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catégorie trouvée"),
            @ApiResponse(responseCode = "404", description = "Catégorie non trouvée")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Categorie> getById(
            @Parameter(description = "ID de la catégorie", required = true, example = "1")
            @PathVariable Integer id
    ) {
        return categorieRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Créer une nouvelle catégorie", description = "Nécessite un rôle admin")
    @ApiResponse(responseCode = "200", description = "Catégorie créée")
    @PostMapping
    public Categorie create(
            @Parameter(description = "Données de la catégorie")
            @RequestBody Categorie categorie
    ) {
        return categorieRepository.save(categorie);
    }

    @Operation(summary = "Mettre à jour une catégorie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catégorie mise à jour"),
            @ApiResponse(responseCode = "404", description = "Catégorie non trouvée")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Categorie> update(
            @Parameter(description = "ID de la catégorie") @PathVariable Integer id,
            @Parameter(description = "Nouvelles données") @RequestBody Categorie categorie
    ) {
        return categorieRepository.findById(id)
                .map(existing -> {
                categorie.setIdCategorie(id);
                return ResponseEntity.ok(categorieRepository.save(categorie));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Supprimer une catégorie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catégorie supprimée"),
            @ApiResponse(responseCode = "404", description = "Catégorie non trouvée")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @Parameter(description = "ID de la catégorie") @PathVariable Integer id
    ) {
        if (categorieRepository.existsById(id)) {
            categorieRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}