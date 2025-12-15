package com.example.demo.controllers;

import com.example.demo.models.AvisProduit;
import com.example.demo.repositories.AvisProduitRepository;
import com.example.demo.repositories.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;
import java.util.Map;

@Tag(name = "Avis", description = "Gestion des avis et notations produits")
@RestController
@RequestMapping("/api/avis")
public class AvisProduitController {

    @Autowired
    private AvisProduitRepository avisRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Operation(summary = "Liste tous les avis", description = "Admin uniquement")
    @ApiResponse(responseCode = "200", description = "Liste des avis")
    @GetMapping
    public List<AvisProduit> getAll() {
        return avisRepository.findAll();
    }

    @Operation(
            summary = "Avis d'un produit",
            description = "Retourne uniquement les avis approuvés"
    )
    @ApiResponse(responseCode = "200", description = "Liste des avis approuvés")
    @GetMapping("/produit/{idProduit}")
    public List<AvisProduit> getByProduit(
            @Parameter(description = "ID du produit") @PathVariable Integer idProduit
    ) {
        return avisRepository.findByIdProduitAndStatutModeration(
                idProduit,
                AvisProduit.StatutModeration.approuve
        );
    }

    @Operation(summary = "Avis d'un utilisateur")
    @ApiResponse(responseCode = "200", description = "Liste des avis de l'utilisateur")
    @SecurityRequirement(name = "JWT")
    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<AvisProduit> getByUtilisateur(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Integer idUtilisateur
    ) {
        return avisRepository.findByIdUtilisateur(idUtilisateur);
    }

    @Operation(
            summary = "Avis en attente de modération",
            description = "Admin/Modérateur uniquement"
    )
    @ApiResponse(responseCode = "200", description = "Avis en attente")
    @SecurityRequirement(name = "JWT")
    @GetMapping("/moderation")
    public List<AvisProduit> getEnAttente() {
        return avisRepository.findByStatutModeration(AvisProduit.StatutModeration.en_attente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody AvisProduit avisModifie) {
        return avisRepository.findById(id)
                .map(avis -> {
                    // Vérifier que c'est bien le propriétaire qui modifie
                    if (!avis.getIdUtilisateur().equals(avisModifie.getIdUtilisateur())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("error", "Vous ne pouvez modifier que vos propres avis"));
                    }

                    // Mettre à jour les champs modifiables
                    avis.setNote(avisModifie.getNote());
                    avis.setCommentaire(avisModifie.getCommentaire());
                    avis.setStatutModeration(AvisProduit.StatutModeration.approuve); // Repasse en modération

                    AvisProduit saved = avisRepository.save(avis);

                    // Mettre à jour la note moyenne du produit
                    updateProduitNote(avis.getIdProduit());

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Créer un avis",
            description = "Crée l'avis et l'ajoute à la liste des avis a modérer"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Avis créé"),
    })
    @PostMapping
    public ResponseEntity<?> create(@RequestBody AvisProduit avis) {
        // Vérifier que l'utilisateur n'a pas déjà laissé un avis pour ce produit
        if (avisRepository.existsByIdProduitAndIdUtilisateur(
            avis.getIdProduit(), 
            avis.getIdUtilisateur()
        )) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Vous avez déjà laissé un avis pour ce produit")
            );
        }

        avis.setStatutModeration(AvisProduit.StatutModeration.en_attente);
        AvisProduit saved = avisRepository.save(avis);
        
        return ResponseEntity.ok(saved);
    }

    // ✅ APPROUVER UN AVIS
    @PutMapping("/{id}/approuver")
    public ResponseEntity<?> approuver(@PathVariable Integer id) {
        return avisRepository.findById(id)
            .map(avis -> {
                avis.setStatutModeration(AvisProduit.StatutModeration.approuve);
                avisRepository.save(avis);
                
                // Mettre à jour la note moyenne du produit
                updateProduitNote(avis.getIdProduit());
                
                return ResponseEntity.ok(Map.of("message", "Avis approuvé"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ REJETER UN AVIS
    @PutMapping("/{id}/rejeter")
    public ResponseEntity<?> rejeter(@PathVariable Integer id) {
        return avisRepository.findById(id)
            .map(avis -> {
                avis.setStatutModeration(AvisProduit.StatutModeration.rejete);
                avisRepository.save(avis);
                return ResponseEntity.ok(Map.of("message", "Avis rejeté"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ MARQUER UN AVIS COMME UTILE
    @PostMapping("/{id}/utile")
    public ResponseEntity<?> marquerUtile(@PathVariable Integer id) {
        return avisRepository.findById(id)
            .map(avis -> {
                avis.setUtileCount(avis.getUtileCount() + 1);
                avisRepository.save(avis);
                return ResponseEntity.ok(Map.of("utileCount", avis.getUtileCount()));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ SUPPRIMER UN AVIS
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return avisRepository.findById(id)
            .map(avis -> {
                Integer idProduit = avis.getIdProduit();
                avisRepository.deleteById(id);
                
                // Mettre à jour la note moyenne
                updateProduitNote(idProduit);
                
                return ResponseEntity.ok(Map.of("message", "Avis supprimé"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // 🔧 MÉTHODE PRIVÉE : Mettre à jour la note moyenne d'un produit
    private void updateProduitNote(Integer idProduit) {
        Double noteMoyenne = avisRepository.getAverageNoteByProduit(idProduit);
        Long nombreAvis = avisRepository.countApprovedByProduit(idProduit);
        
        produitRepository.findById(idProduit).ifPresent(produit -> {
            produit.setNoteMoyenne(
                noteMoyenne != null ? 
                java.math.BigDecimal.valueOf(noteMoyenne) : 
                java.math.BigDecimal.ZERO
            );
            produit.setNombreAvis(nombreAvis != null ? nombreAvis.intValue() : 0);
            produitRepository.save(produit);
        });
    }
}