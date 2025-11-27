package com.example.demo.controllers;

import com.example.demo.models.Panier;
import com.example.demo.repositories.PanierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/panier")
public class PanierController {

    @Autowired
    private PanierRepository panierRepository;

    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<Panier> getByUtilisateur(@PathVariable Integer idUtilisateur) {
        return panierRepository.findByIdUtilisateur(idUtilisateur);
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Panier panier) {
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

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuantite(@PathVariable Integer id, @RequestBody Map<String, Integer> body) {
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (panierRepository.existsById(id)) {
            panierRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Produit retiré du panier"));
        }
        return ResponseEntity.notFound().build();
    }

    @Transactional
    @DeleteMapping("/utilisateur/{idUtilisateur}/vider")
    public ResponseEntity<?> vider(@PathVariable Integer idUtilisateur) {
        panierRepository.deleteByIdUtilisateur(idUtilisateur);
        return ResponseEntity.ok(Map.of("message", "Panier vidé"));
    }
}