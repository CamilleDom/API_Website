package com.example.demo.controllers;

import com.example.demo.dto.RecommendationDTO;
import com.example.demo.services.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Contrôleur REST pour les recommandations de produits
 * Localisation : src/main/java/com/example/demo/controllers/RecommendationController.java
 *
 * Endpoints disponibles :
 * - GET /api/recommendations/user/{id}
 * - GET /api/recommendations/similar/{id}
 * - GET /api/recommendations/trending
 * - GET /api/recommendations/for-you
 * - GET /api/recommendations/health
 */
@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    /**
     * GET /api/recommendations/user/{idUtilisateur}?limit=10
     * Recommandations personnalisées pour un utilisateur
     */
    @GetMapping("/user/{idUtilisateur}")
    public ResponseEntity<Map<String, Object>> getPersonalizedRecommendations(
            @PathVariable Integer idUtilisateur,
            @RequestParam(defaultValue = "10") Integer limit) {

        List<RecommendationDTO> recommendations = recommendationService.getRecommendationsForUser(idUtilisateur, limit);

        return ResponseEntity.ok(Map.of(
                "userId", idUtilisateur,
                "count", recommendations.size(),
                "recommendations", recommendations,
                "message", "Recommandations générées avec succès basées sur votre historique"
        ));
    }

    /**
     * GET /api/recommendations/similar/{idProduit}?limit=6
     * Produits similaires à un produit donné
     */
    @GetMapping("/similar/{idProduit}")
    public ResponseEntity<Map<String, Object>> getSimilarProducts(
            @PathVariable Integer idProduit,
            @RequestParam(defaultValue = "6") Integer limit) {

        List<RecommendationDTO> similarProducts = recommendationService.getSimilarProducts(idProduit, limit);

        return ResponseEntity.ok(Map.of(
                "productId", idProduit,
                "count", similarProducts.size(),
                "similarProducts", similarProducts,
                "message", "Les clients qui ont acheté ce produit ont aussi aimé"
        ));
    }

    /**
     * GET /api/recommendations/trending?limit=12
     * Produits tendance du moment
     */
    @GetMapping("/trending")
    public ResponseEntity<Map<String, Object>> getTrendingProducts(
            @RequestParam(defaultValue = "12") Integer limit) {

        List<RecommendationDTO> trending = recommendationService.getTrendingProducts(limit);

        return ResponseEntity.ok(Map.of(
                "count", trending.size(),
                "trending", trending,
                "message", "Les produits les plus populaires du moment"
        ));
    }

    /**
     * GET /api/recommendations/for-you?userId=5&limit=8
     * Section "Pour vous" adaptative
     */
    @GetMapping("/for-you")
    public ResponseEntity<List<RecommendationDTO>> getForYouSection(
            @RequestParam(required = false) Integer userId,
            @RequestParam(defaultValue = "8") Integer limit) {

        if (userId != null) {
            return ResponseEntity.ok(recommendationService.getRecommendationsForUser(userId, limit));
        } else {
            return ResponseEntity.ok(recommendationService.getTrendingProducts(limit));
        }
    }

    /**
     * GET /api/recommendations/health
     * Vérifier le statut du service
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Recommendation Service",
                "algorithms", List.of(
                        "Collaborative Filtering",
                        "Category Preferences",
                        "Frequently Bought Together",
                        "Trending Products",
                        "High Rated Products"
                ),
                "message", "Le moteur de recommandation IA est opérationnel"
        ));
    }
}