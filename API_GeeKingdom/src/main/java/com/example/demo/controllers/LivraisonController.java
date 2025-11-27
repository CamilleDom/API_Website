package com.example.demo.controllers;

import com.example.demo.models.Livraison;
import com.example.demo.repositories.LivraisonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/livraisons")
public class LivraisonController {

    @Autowired
    private LivraisonRepository livraisonRepository;

    @GetMapping
    public List<Livraison> getAll() {
        return livraisonRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livraison> getById(@PathVariable Integer id) {
        return livraisonRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/commande/{idCommande}")
    public ResponseEntity<Livraison> getByCommande(@PathVariable Integer idCommande) {
        return livraisonRepository.findByIdCommande(idCommande)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/suivi/{numeroSuivi}")
    public ResponseEntity<Livraison> getByNumeroSuivi(@PathVariable String numeroSuivi) {
        return livraisonRepository.findByNumeroSuivi(numeroSuivi)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Livraison create(@RequestBody Livraison livraison) {
        livraison.setNumeroSuivi("TRK-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
        livraison.setStatutLivraison(Livraison.StatutLivraison.en_attente);
        return livraisonRepository.save(livraison);
    }

    @PutMapping("/{id}/expedier")
    public ResponseEntity<?> expedier(@PathVariable Integer id) {
        return livraisonRepository.findById(id)
            .map(livraison -> {
                livraison.setStatutLivraison(Livraison.StatutLivraison.en_transit);
                livraison.setDateExpedition(LocalDateTime.now());
                livraisonRepository.save(livraison);
                return ResponseEntity.ok(Map.of("message", "Colis expédié"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/livrer")
    public ResponseEntity<?> livrer(@PathVariable Integer id) {
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