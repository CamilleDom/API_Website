package com.example.demo.controllers;

import com.example.demo.models.MouvementStock;
import com.example.demo.repositories.MouvementStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mouvements-stock")
public class MouvementStockController {

    @Autowired
    private MouvementStockRepository mouvementRepository;

    // ✅ LISTE TOUS LES MOUVEMENTS
    @GetMapping
    public List<MouvementStock> getAll() {
        return mouvementRepository.findAll();
    }

    // ✅ MOUVEMENTS D'UN PRODUIT
    @GetMapping("/produit/{idProduit}")
    public List<MouvementStock> getByProduit(@PathVariable Integer idProduit) {
        return mouvementRepository.findByIdProduitOrderByDateMouvementDesc(idProduit);
    }

    // ✅ MOUVEMENTS PAR TYPE
    @GetMapping("/type/{type}")
    public List<MouvementStock> getByType(@PathVariable MouvementStock.TypeMouvement type) {
        return mouvementRepository.findByTypeMouvement(type);
    }

    // ✅ MOUVEMENTS D'UNE COMMANDE
    @GetMapping("/commande/{idCommande}")
    public List<MouvementStock> getByCommande(@PathVariable Integer idCommande) {
        return mouvementRepository.findByReferenceCommande(idCommande);
    }

    // ✅ MOUVEMENTS PAR PÉRIODE
    @GetMapping("/periode")
    public List<MouvementStock> getByPeriode(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin
    ) {
        return mouvementRepository.findByDateMouvementBetween(debut, fin);
    }

    // ✅ STATISTIQUES D'UN PRODUIT
    @GetMapping("/stats/produit/{idProduit}")
    public ResponseEntity<?> getStatsProduit(@PathVariable Integer idProduit) {
        Integer totalEntrees = mouvementRepository.getTotalEntrees(idProduit);
        Integer totalSorties = mouvementRepository.getTotalSorties(idProduit);
        
        return ResponseEntity.ok(Map.of(
            "idProduit", idProduit,
            "totalEntrees", totalEntrees != null ? totalEntrees : 0,
            "totalSorties", totalSorties != null ? totalSorties : 0,
            "stockTheorique", (totalEntrees != null ? totalEntrees : 0) - (totalSorties != null ? totalSorties : 0)
        ));
    }

    // ✅ MOUVEMENTS PAR UTILISATEUR
    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<MouvementStock> getByUtilisateur(@PathVariable Integer idUtilisateur) {
        return mouvementRepository.findByIdUtilisateur(idUtilisateur);
    }

    // ✅ DÉTAILS D'UN MOUVEMENT
    @GetMapping("/{id}")
    public ResponseEntity<MouvementStock> getById(@PathVariable Integer id) {
        return mouvementRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}