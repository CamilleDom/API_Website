package com.example.demo.controllers;

import com.example.demo.models.DetailCommande;
import com.example.demo.repositories.DetailCommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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

    // ✅ CRÉER UN DÉTAIL DE COMMANDE - FIXED VERSION WITH VALIDATION
    @PostMapping
    public ResponseEntity<?> create(@RequestBody DetailCommande detail) {
        try {
            // ✅ Validation: Vérifier que les champs obligatoires sont présents
            if (detail.getIdCommande() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "idCommande est obligatoire"));
            }

            if (detail.getIdProduit() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "idProduit est obligatoire"));
            }

            if (detail.getQuantite() == null || detail.getQuantite() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "quantite doit être supérieur à 0"));
            }

            // ✅ CRITICAL FIX: Vérifier que prixUnitaire n'est pas null avant de calculer
            if (detail.getPrixUnitaire() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "prixUnitaire est obligatoire"));
            }

            if (detail.getPrixUnitaire().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "prixUnitaire doit être supérieur à 0"));
            }

            // ✅ Si prixTotal n'est pas fourni, le calculer
            if (detail.getPrixTotal() == null) {
                detail.calculerPrixTotal();
            }

            DetailCommande saved = detailRepository.save(detail);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Erreur lors de la création du détail de commande",
                    "message", e.getMessage()
            ));
        }
    }

    // ✅ MODIFIER UN DÉTAIL
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody DetailCommande detail) {
        return detailRepository.findById(id)
                .map(existing -> {
                    try {
                        detail.setIdDetail(id);

                        // ✅ Validation avant de calculer
                        if (detail.getPrixUnitaire() != null && detail.getQuantite() != null) {
                            detail.calculerPrixTotal();
                        }

                        DetailCommande saved = detailRepository.save(detail);
                        return ResponseEntity.ok(saved);

                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Erreur lors de la modification",
                                "message", e.getMessage()
                        ));
                    }
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