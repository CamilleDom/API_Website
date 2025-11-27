package com.example.demo.controllers;

import com.example.demo.models.AvisProduit;
import com.example.demo.repositories.AvisProduitRepository;
import com.example.demo.repositories.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avis")
public class AvisProduitController {

    @Autowired
    private AvisProduitRepository avisRepository;

    @Autowired
    private ProduitRepository produitRepository;

    // ✅ LISTE TOUS LES AVIS
    @GetMapping
    public List<AvisProduit> getAll() {
        return avisRepository.findAll();
    }

    // ✅ AVIS D'UN PRODUIT (approuvés seulement)
    @GetMapping("/produit/{idProduit}")
    public List<AvisProduit> getByProduit(@PathVariable Integer idProduit) {
        return avisRepository.findByIdProduitAndStatutModeration(
            idProduit, 
            AvisProduit.StatutModeration.approuve
        );
    }

    // ✅ AVIS D'UN UTILISATEUR
    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<AvisProduit> getByUtilisateur(@PathVariable Integer idUtilisateur) {
        return avisRepository.findByIdUtilisateur(idUtilisateur);
    }

    // ✅ AVIS EN ATTENTE DE MODÉRATION
    @GetMapping("/moderation")
    public List<AvisProduit> getEnAttente() {
        return avisRepository.findByStatutModeration(AvisProduit.StatutModeration.en_attente);
    }

    // ✅ CRÉER UN AVIS
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