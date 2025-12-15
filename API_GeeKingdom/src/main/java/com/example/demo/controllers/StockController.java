package com.example.demo.controllers;

import com.example.demo.models.Stock;
import com.example.demo.models.MouvementStock;
import com.example.demo.repositories.StockRepository;
import com.example.demo.repositories.MouvementStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

@Tag(name = "Stocks", description = "Gestion des stocks et mouvements")
@SecurityRequirement(name = "JWT")
@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private MouvementStockRepository mouvementRepository;

    @Operation(summary = "Liste tous les stocks")
    @ApiResponse(responseCode = "200", description = "Liste des stocks")
    @GetMapping
    public List<Stock> getAll() {
        return stockRepository.findAll();
    }

    @Operation(summary = "Stock d'un produit spécifique")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock trouvé"),
            @ApiResponse(responseCode = "404", description = "Produit sans stock")
    })
    @GetMapping("/produit/{idProduit}")
    public ResponseEntity<Stock> getByProduit(
            @Parameter(description = "ID du produit") @PathVariable Integer idProduit
    ) {
        return stockRepository.findByIdProduit(idProduit)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Produits en rupture de stock",
            description = "Produits avec quantité disponible = 0"
    )
    @ApiResponse(responseCode = "200", description = "Liste des produits en rupture")
    @GetMapping("/rupture")
    public List<Stock> getEnRupture() {
        return stockRepository.findProduitsEnRupture();
    }

    @Operation(
            summary = "Produits sous seuil d'alerte",
            description = "Produits nécessitant un réapprovisionnement"
    )
    @ApiResponse(responseCode = "200", description = "Liste des produits en alerte")
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

    @Operation(
            summary = "Approvisionner un stock",
            description = "Ajoute de la quantité au stock existant et enregistre le mouvement"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock approvisionné"),
            @ApiResponse(responseCode = "404", description = "Produit non trouvé")
    })
    @PostMapping("/approvisionner")
    public ResponseEntity<?> approvisionner(
            @Parameter(description = "ID du produit et quantité à ajouter")
            @RequestBody Map<String, Object> request
    ) {
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

    @Operation(
            summary = "Réserver du stock",
            description = "Réserve du stock pour une commande (diminue disponible, augmente réservé)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock réservé"),
            @ApiResponse(responseCode = "400", description = "Stock insuffisant")
    })
    @PostMapping("/reserver")
    public ResponseEntity<?> reserver(
            @Parameter(description = "ID produit, quantité et ID commande")
            @RequestBody Map<String, Object> request
    ) {
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

    @Operation(
            summary = "Libérer du stock réservé",
            description = "Libère le stock réservé (typiquement lors d'une annulation)"
    )
    @ApiResponse(responseCode = "200", description = "Stock libéré")
    @PostMapping("/liberer")
    public ResponseEntity<?> liberer(
            @Parameter(description = "ID produit, quantité et ID commande")
            @RequestBody Map<String, Object> request
    ) {
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