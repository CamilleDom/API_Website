package com.example.demo.controllers;

import com.example.demo.models.DetailCommande;
import com.example.demo.repositories.DetailCommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/details-commande")
public class DetailCommandeController {

    @Autowired
    private DetailCommandeRepository detailRepository;

    // ✅ LISTE TOUS LES DÉTAILS
    @GetMapping
    public List<DetailCommande> getAll() {
        return detailRepository.findAll();
    }

    // ✅ DÉTAILS D'UNE COMMANDE
    @GetMapping("/commande/{idCommande}")
    public List<DetailCommande> getByCommande(@PathVariable Integer idCommande) {
        return detailRepository.findByIdCommande(idCommande);
    }

    // ✅ DÉTAILS D'UN PRODUIT (dans quelles commandes)
    @GetMapping("/produit/{idProduit}")
    public List<DetailCommande> getByProduit(@PathVariable Integer idProduit) {
        return detailRepository.findByIdProduit(idProduit);
    }

    // ✅ TOTAL D'UNE COMMANDE
    @GetMapping("/commande/{idCommande}/total")
    public ResponseEntity<?> getTotalCommande(@PathVariable Integer idCommande) {
        return ResponseEntity.ok(Map.of(
            "idCommande", idCommande,
            "total", detailRepository.getTotalCommande(idCommande)
        ));
    }

    // ✅ PRODUITS LES PLUS VENDUS
    @GetMapping("/stats/best-sellers")
    public ResponseEntity<?> getBestSellers() {
        List<Object[]> results = detailRepository.getProduitsLesPlusVendus();
        
        List<Map<String, Object>> bestSellers = results.stream()
            .limit(10)
            .map(row -> Map.of(
                "idProduit", row[0],
                "quantiteVendue", row[1]
            ))
            .toList();
        
        return ResponseEntity.ok(bestSellers);
    }

    // ✅ CRÉER UN DÉTAIL DE COMMANDE
    @PostMapping
    public DetailCommande create(@RequestBody DetailCommande detail) {
        detail.calculerPrixTotal();
        return detailRepository.save(detail);
    }

    // ✅ MODIFIER UN DÉTAIL
    @PutMapping("/{id}")
    public ResponseEntity<DetailCommande> update(@PathVariable Integer id, @RequestBody DetailCommande detail) {
        return detailRepository.findById(id)
            .map(existing -> {
                detail.setIdDetail(id);
                detail.calculerPrixTotal();
                return ResponseEntity.ok(detailRepository.save(detail));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ SUPPRIMER UN DÉTAIL
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (detailRepository.existsById(id)) {
            detailRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Détail supprimé"));
        }
        return ResponseEntity.notFound().build();
    }
}