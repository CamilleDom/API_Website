package com.example.demo.controllers;

import com.example.demo.models.DetailCommande;
import com.example.demo.models.Stock;
import com.example.demo.models.MouvementStock;
import com.example.demo.repositories.DetailCommandeRepository;
import com.example.demo.repositories.StockRepository;
import com.example.demo.repositories.MouvementStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/details-commande")
public class DetailCommandeController {

    @Autowired
    private DetailCommandeRepository detailRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private MouvementStockRepository mouvementRepository;

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

    // ✅ CRÉER UN DÉTAIL DE COMMANDE - WITH AUTOMATIC STOCK RESERVATION
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

            // ✅ STOCK RESERVATION: Vérifier et réserver le stock
            Optional<Stock> stockOpt = stockRepository.findByIdProduit(detail.getIdProduit());

            if (stockOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Stock non trouvé pour ce produit",
                        "idProduit", detail.getIdProduit()
                ));
            }

            Stock stock = stockOpt.get();

            // Vérifier que le stock disponible est suffisant
            if (stock.getQuantiteDisponible() < detail.getQuantite()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Stock insuffisant",
                        "stockDisponible", stock.getQuantiteDisponible(),
                        "quantiteDemandee", detail.getQuantite(),
                        "idProduit", detail.getIdProduit()
                ));
            }

            // ✅ Réserver le stock (diminuer disponible, augmenter réservé)
            Integer quantiteAvant = stock.getQuantiteDisponible();
            stock.setQuantiteDisponible(quantiteAvant - detail.getQuantite());
            stock.setQuantiteReservee(stock.getQuantiteReservee() + detail.getQuantite());
            stockRepository.save(stock);

            // ✅ Enregistrer le mouvement de stock
            MouvementStock mouvement = new MouvementStock();
            mouvement.setIdProduit(detail.getIdProduit());
            mouvement.setTypeMouvement(MouvementStock.TypeMouvement.reservation);
            mouvement.setQuantite(detail.getQuantite());
            mouvement.setQuantiteAvant(quantiteAvant);
            mouvement.setQuantiteApres(stock.getQuantiteDisponible());
            mouvement.setReferenceCommande(detail.getIdCommande());
            mouvement.setCommentaire("Réservation automatique pour commande #" + detail.getIdCommande());
            mouvementRepository.save(mouvement);

            // ✅ Si prixTotal n'est pas fourni, le calculer
            if (detail.getPrixTotal() == null) {
                detail.calculerPrixTotal();
            }

            // ✅ Sauvegarder le détail de commande
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
                        // ✅ Gestion du changement de quantité et ajustement du stock
                        Integer ancienneQuantite = existing.getQuantite();
                        Integer nouvelleQuantite = detail.getQuantite();

                        if (nouvelleQuantite != null && !nouvelleQuantite.equals(ancienneQuantite)) {
                            Optional<Stock> stockOpt = stockRepository.findByIdProduit(existing.getIdProduit());

                            if (stockOpt.isPresent()) {
                                Stock stock = stockOpt.get();
                                Integer difference = nouvelleQuantite - ancienneQuantite;

                                // Si on augmente la quantité, vérifier le stock disponible
                                if (difference > 0 && stock.getQuantiteDisponible() < difference) {
                                    return ResponseEntity.badRequest().body(Map.of(
                                            "error", "Stock insuffisant pour cette modification",
                                            "stockDisponible", stock.getQuantiteDisponible(),
                                            "quantiteSupplementaire", difference
                                    ));
                                }

                                // Ajuster le stock
                                Integer quantiteAvant = stock.getQuantiteDisponible();
                                stock.setQuantiteDisponible(quantiteAvant - difference);
                                stock.setQuantiteReservee(stock.getQuantiteReservee() + difference);
                                stockRepository.save(stock);

                                // Enregistrer le mouvement
                                MouvementStock mouvement = new MouvementStock();
                                mouvement.setIdProduit(existing.getIdProduit());
                                mouvement.setTypeMouvement(difference > 0 ?
                                        MouvementStock.TypeMouvement.reservation :
                                        MouvementStock.TypeMouvement.liberation);
                                mouvement.setQuantite(Math.abs(difference));
                                mouvement.setQuantiteAvant(quantiteAvant);
                                mouvement.setQuantiteApres(stock.getQuantiteDisponible());
                                mouvement.setReferenceCommande(existing.getIdCommande());
                                mouvement.setCommentaire("Ajustement suite modification commande #" + existing.getIdCommande());
                                mouvementRepository.save(mouvement);
                            }
                        }

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

    // ✅ SUPPRIMER UN DÉTAIL - WITH STOCK RELEASE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return detailRepository.findById(id)
                .map(detail -> {
                    try {
                        // ✅ Libérer le stock réservé
                        Optional<Stock> stockOpt = stockRepository.findByIdProduit(detail.getIdProduit());

                        if (stockOpt.isPresent()) {
                            Stock stock = stockOpt.get();
                            Integer quantiteAvant = stock.getQuantiteDisponible();

                            // Remettre la quantité en stock disponible
                            stock.setQuantiteDisponible(quantiteAvant + detail.getQuantite());
                            stock.setQuantiteReservee(Math.max(0, stock.getQuantiteReservee() - detail.getQuantite()));
                            stockRepository.save(stock);

                            // Enregistrer le mouvement de libération
                            MouvementStock mouvement = new MouvementStock();
                            mouvement.setIdProduit(detail.getIdProduit());
                            mouvement.setTypeMouvement(MouvementStock.TypeMouvement.liberation);
                            mouvement.setQuantite(detail.getQuantite());
                            mouvement.setQuantiteAvant(quantiteAvant);
                            mouvement.setQuantiteApres(stock.getQuantiteDisponible());
                            mouvement.setReferenceCommande(detail.getIdCommande());
                            mouvement.setCommentaire("Libération suite suppression détail commande #" + detail.getIdCommande());
                            mouvementRepository.save(mouvement);
                        }

                        detailRepository.deleteById(id);
                        return ResponseEntity.ok(Map.of(
                                "message", "Détail supprimé et stock libéré",
                                "quantiteLiberee", detail.getQuantite()
                        ));

                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Erreur lors de la suppression",
                                "message", e.getMessage()
                        ));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}