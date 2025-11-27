package com.example.demo.controllers;

import com.example.demo.models.Stock;
import com.example.demo.models.MouvementStock;
import com.example.demo.repositories.StockRepository;
import com.example.demo.repositories.MouvementStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private MouvementStockRepository mouvementRepository;

    // ✅ LISTE TOUS LES STOCKS
    @GetMapping
    public List<Stock> getAll() {
        return stockRepository.findAll();
    }

    // ✅ STOCK D'UN PRODUIT
    @GetMapping("/produit/{idProduit}")
    public ResponseEntity<Stock> getByProduit(@PathVariable Integer idProduit) {
        return stockRepository.findByIdProduit(idProduit)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ PRODUITS EN RUPTURE
    @GetMapping("/rupture")
    public List<Stock> getEnRupture() {
        return stockRepository.findProduitsEnRupture();
    }

    // ✅ PRODUITS EN ALERTE
    @GetMapping("/alerte")
    public List<Stock> getEnAlerte() {
        return stockRepository.findProduitsEnAlerte();
    }

    // ✅ PRODUITS DISPONIBLES
    @GetMapping("/disponibles")
    public List<Stock> getDisponibles() {
        return stockRepository.findProduitsDisponibles();
    }

    // ✅ CRÉER/INITIALISER UN STOCK
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Stock stock) {
        if (stockRepository.findByIdProduit(stock.getIdProduit()).isPresent()) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Stock déjà existant pour ce produit")
            );
        }
        
        Stock saved = stockRepository.save(stock);
        
        // Enregistrer le mouvement initial
        enregistrerMouvement(
            stock.getIdProduit(),
            MouvementStock.TypeMouvement.entree,
            stock.getQuantiteDisponible(),
            0,
            stock.getQuantiteDisponible(),
            "Initialisation du stock",
            null
        );
        
        return ResponseEntity.ok(saved);
    }

    // ✅ AJOUTER DU STOCK (Approvisionnement)
    @PostMapping("/approvisionner")
    public ResponseEntity<?> approvisionner(@RequestBody Map<String, Object> request) {
        Integer idProduit = (Integer) request.get("idProduit");
        Integer quantite = (Integer) request.get("quantite");
        String commentaire = (String) request.get("commentaire");
        
        return stockRepository.findByIdProduit(idProduit)
            .map(stock -> {
                Integer quantiteAvant = stock.getQuantiteDisponible();
                stock.setQuantiteDisponible(quantiteAvant + quantite);
                stockRepository.save(stock);
                
                enregistrerMouvement(
                    idProduit,
                    MouvementStock.TypeMouvement.entree,
                    quantite,
                    quantiteAvant,
                    stock.getQuantiteDisponible(),
                    commentaire,
                    null
                );
                
                return ResponseEntity.ok(Map.of(
                    "message", "Stock approvisionné",
                    "quantiteAjoutee", quantite,
                    "nouveauStock", stock.getQuantiteDisponible()
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ RETIRER DU STOCK
    @PostMapping("/retirer")
    public ResponseEntity<?> retirer(@RequestBody Map<String, Object> request) {
        Integer idProduit = (Integer) request.get("idProduit");
        Integer quantite = (Integer) request.get("quantite");
        String commentaire = (String) request.get("commentaire");
        
        return stockRepository.findByIdProduit(idProduit)
            .map(stock -> {
                if (stock.getQuantiteDisponible() < quantite) {
                    return ResponseEntity.badRequest().body(
                        Map.of("error", "Stock insuffisant")
                    );
                }
                
                Integer quantiteAvant = stock.getQuantiteDisponible();
                stock.setQuantiteDisponible(quantiteAvant - quantite);
                stockRepository.save(stock);
                
                enregistrerMouvement(
                    idProduit,
                    MouvementStock.TypeMouvement.sortie,
                    quantite,
                    quantiteAvant,
                    stock.getQuantiteDisponible(),
                    commentaire,
                    null
                );
                
                return ResponseEntity.ok(Map.of(
                    "message", "Stock retiré",
                    "quantiteRetiree", quantite,
                    "nouveauStock", stock.getQuantiteDisponible()
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ RÉSERVER DU STOCK (pour commande)
    @PostMapping("/reserver")
    public ResponseEntity<?> reserver(@RequestBody Map<String, Object> request) {
        Integer idProduit = (Integer) request.get("idProduit");
        Integer quantite = (Integer) request.get("quantite");
        Integer idCommande = (Integer) request.get("idCommande");
        
        return stockRepository.findByIdProduit(idProduit)
            .map(stock -> {
                if (stock.getQuantiteDisponible() < quantite) {
                    return ResponseEntity.badRequest().body(
                        Map.of("error", "Stock insuffisant pour réservation")
                    );
                }
                
                Integer quantiteAvant = stock.getQuantiteDisponible();
                stock.setQuantiteDisponible(quantiteAvant - quantite);
                stock.setQuantiteReservee(stock.getQuantiteReservee() + quantite);
                stockRepository.save(stock);
                
                enregistrerMouvement(
                    idProduit,
                    MouvementStock.TypeMouvement.reservation,
                    quantite,
                    quantiteAvant,
                    stock.getQuantiteDisponible(),
                    "Réservation pour commande",
                    idCommande
                );
                
                return ResponseEntity.ok(Map.of(
                    "message", "Stock réservé",
                    "quantiteReservee", quantite
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ LIBÉRER DU STOCK RÉSERVÉ (annulation commande)
    @PostMapping("/liberer")
    public ResponseEntity<?> liberer(@RequestBody Map<String, Object> request) {
        Integer idProduit = (Integer) request.get("idProduit");
        Integer quantite = (Integer) request.get("quantite");
        Integer idCommande = (Integer) request.get("idCommande");
        
        return stockRepository.findByIdProduit(idProduit)
            .map(stock -> {
                Integer quantiteAvant = stock.getQuantiteDisponible();
                stock.setQuantiteDisponible(quantiteAvant + quantite);
                stock.setQuantiteReservee(Math.max(0, stock.getQuantiteReservee() - quantite));
                stockRepository.save(stock);
                
                enregistrerMouvement(
                    idProduit,
                    MouvementStock.TypeMouvement.liberation,
                    quantite,
                    quantiteAvant,
                    stock.getQuantiteDisponible(),
                    "Libération suite annulation",
                    idCommande
                );
                
                return ResponseEntity.ok(Map.of(
                    "message", "Stock libéré",
                    "quantiteLibéree", quantite
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ AJUSTER LE STOCK (correction manuelle)
    @PutMapping("/{id}/ajuster")
    public ResponseEntity<?> ajuster(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        Integer nouvelleQuantite = (Integer) request.get("quantite");
        String commentaire = (String) request.get("commentaire");
        
        return stockRepository.findById(id)
            .map(stock -> {
                Integer quantiteAvant = stock.getQuantiteDisponible();
                Integer difference = nouvelleQuantite - quantiteAvant;
                stock.setQuantiteDisponible(nouvelleQuantite);
                stockRepository.save(stock);
                
                enregistrerMouvement(
                    stock.getIdProduit(),
                    MouvementStock.TypeMouvement.ajustement,
                    Math.abs(difference),
                    quantiteAvant,
                    nouvelleQuantite,
                    commentaire != null ? commentaire : "Ajustement manuel",
                    null
                );
                
                return ResponseEntity.ok(Map.of(
                    "message", "Stock ajusté",
                    "ancienneQuantite", quantiteAvant,
                    "nouvelleQuantite", nouvelleQuantite
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ MODIFIER LE SEUIL D'ALERTE
    @PutMapping("/{id}/seuil")
    public ResponseEntity<?> modifierSeuil(@PathVariable Integer id, @RequestBody Map<String, Integer> request) {
        Integer nouveauSeuil = request.get("seuil");
        
        return stockRepository.findById(id)
            .map(stock -> {
                stock.setSeuilAlerte(nouveauSeuil);
                stockRepository.save(stock);
                return ResponseEntity.ok(Map.of(
                    "message", "Seuil d'alerte modifié",
                    "nouveauSeuil", nouveauSeuil
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // 🔧 MÉTHODE PRIVÉE : Enregistrer un mouvement de stock
    private void enregistrerMouvement(Integer idProduit, MouvementStock.TypeMouvement type,
                                     Integer quantite, Integer quantiteAvant, Integer quantiteApres,
                                     String commentaire, Integer idCommande) {
        MouvementStock mouvement = new MouvementStock(idProduit, type, quantite, quantiteAvant, quantiteApres);
        mouvement.setCommentaire(commentaire);
        mouvement.setReferenceCommande(idCommande);
        mouvementRepository.save(mouvement);
    }
}