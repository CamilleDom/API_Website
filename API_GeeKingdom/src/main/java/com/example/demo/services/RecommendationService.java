package com.example.demo.services;

import com.example.demo.dto.RecommendationDTO;
import com.example.demo.models.Commande;
import com.example.demo.models.DetailCommande;
import com.example.demo.models.Produit;
import com.example.demo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service de recommandation de produits basé sur l'IA
 * Localisation : src/main/java/com/example/demo/services/RecommendationService.java
 *
 * Utilise 5 algorithmes :
 * 1. Filtrage collaboratif (utilisateurs similaires)
 * 2. Analyse des catégories préférées
 * 3. Produits fréquemment achetés ensemble
 * 4. Tendances et popularité
 * 5. Produits bien notés
 */
@Service
public class RecommendationService {

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private DetailCommandeRepository detailCommandeRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private AvisProduitRepository avisRepository;

    /**
     * Obtenir des recommandations personnalisées pour un utilisateur
     */
    public List<RecommendationDTO> getRecommendationsForUser(Integer idUtilisateur, Integer limit) {
        Map<Integer, Double> scoresProduits = new HashMap<>();
        Set<Integer> produitsAchetes = getProduitsAchetesByUser(idUtilisateur);

        // 1. Filtrage collaboratif - Utilisateurs similaires
        addScoresFromSimilarUsers(idUtilisateur, scoresProduits, produitsAchetes);

        // 2. Catégories préférées de l'utilisateur
        addScoresFromPreferredCategories(idUtilisateur, scoresProduits, produitsAchetes);

        // 3. Produits fréquemment achetés ensemble
        addScoresFromFrequentlyBoughtTogether(idUtilisateur, scoresProduits, produitsAchetes);

        // 4. Produits tendance et populaires
        addScoresFromTrendingProducts(scoresProduits, produitsAchetes);

        // 5. Produits bien notés
        addScoresFromHighRatedProducts(scoresProduits, produitsAchetes);

        // Convertir les scores en recommandations
        return convertScoresToRecommendations(scoresProduits, limit);
    }

    /**
     * Obtenir des produits similaires à un produit donné
     */
    public List<RecommendationDTO> getSimilarProducts(Integer idProduit, Integer limit) {
        Optional<Produit> produitOpt = produitRepository.findById(idProduit);
        if (produitOpt.isEmpty()) {
            return Collections.emptyList();
        }

        Produit produit = produitOpt.get();
        Map<Integer, Double> scores = new HashMap<>();

        // Produits de la même catégorie
        List<Produit> produitsMemecategorie = produitRepository.findByIdCategorie(produit.getIdCategorie());
        for (Produit p : produitsMemecategorie) {
            if (!p.getIdProduit().equals(idProduit)) {
                scores.put(p.getIdProduit(), 50.0);
            }
        }

        // Produits fréquemment achetés avec ce produit
        List<Object[]> frequentPairs = detailCommandeRepository.getProduitsAchetesEnsemble(idProduit);
        for (Object[] pair : frequentPairs) {
            Integer autreProduitId = (Integer) pair[0];
            Long count = (Long) pair[1];
            scores.merge(autreProduitId, count * 10.0, Double::sum);
        }

        return convertScoresToRecommendations(scores, limit);
    }

    /**
     * Obtenir les tendances actuelles
     */
    public List<RecommendationDTO> getTrendingProducts(Integer limit) {
        Map<Integer, Double> scores = new HashMap<>();

        // Produits les plus vendus récemment
        List<Object[]> bestSellers = detailCommandeRepository.getProduitsLesPlusVendus();
        int rank = 1;
        for (Object[] row : bestSellers) {
            Integer idProduit = (Integer) row[0];
            Long quantite = (Long) row[1];
            double score = (100.0 / rank) + (quantite * 2.0);
            scores.put(idProduit, score);
            rank++;
        }

        // Bonus pour les produits bien notés
        List<Produit> allProducts = produitRepository.findAll();
        for (Produit p : allProducts) {
            if (p.getNoteMoyenne() != null && p.getNoteMoyenne().doubleValue() >= 4.0) {
                scores.merge(p.getIdProduit(), p.getNoteMoyenne().doubleValue() * 5.0, Double::sum);
            }
        }

        return convertScoresToRecommendations(scores, limit);
    }

    // ==================== MÉTHODES PRIVÉES ====================

    /**
     * Obtenir les produits déjà achetés par l'utilisateur
     */
    private Set<Integer> getProduitsAchetesByUser(Integer idUtilisateur) {
        List<Commande> commandes = commandeRepository.findByIdUtilisateur(idUtilisateur);
        Set<Integer> produits = new HashSet<>();

        for (Commande cmd : commandes) {
            List<DetailCommande> details = detailCommandeRepository.findByIdCommande(cmd.getIdCommande());
            for (DetailCommande detail : details) {
                produits.add(detail.getIdProduit());
            }
        }

        return produits;
    }

    /**
     * Algorithme 1 : Filtrage collaboratif
     */
    private void addScoresFromSimilarUsers(Integer idUtilisateur, Map<Integer, Double> scores, Set<Integer> produitsAchetes) {
        List<Integer> similarUsers = findSimilarUsers(idUtilisateur, produitsAchetes);

        for (Integer similarUserId : similarUsers) {
            Set<Integer> theirProducts = getProduitsAchetesByUser(similarUserId);
            for (Integer produitId : theirProducts) {
                if (!produitsAchetes.contains(produitId)) {
                    scores.merge(produitId, 30.0, Double::sum);
                }
            }
        }
    }

    /**
     * Trouver les utilisateurs avec des goûts similaires (Jaccard similarity)
     */
    private List<Integer> findSimilarUsers(Integer idUtilisateur, Set<Integer> userProducts) {
        List<Commande> allCommandes = commandeRepository.findAll();
        Map<Integer, Double> similarityScores = new HashMap<>();

        for (Commande cmd : allCommandes) {
            if (!cmd.getIdUtilisateur().equals(idUtilisateur)) {
                Set<Integer> otherUserProducts = getProduitsAchetesByUser(cmd.getIdUtilisateur());

                // Calculer la similarité de Jaccard
                Set<Integer> intersection = new HashSet<>(userProducts);
                intersection.retainAll(otherUserProducts);

                Set<Integer> union = new HashSet<>(userProducts);
                union.addAll(otherUserProducts);

                if (!union.isEmpty()) {
                    double similarity = (double) intersection.size() / union.size();
                    similarityScores.merge(cmd.getIdUtilisateur(), similarity, Double::max);
                }
            }
        }

        // Retourner les 5 utilisateurs les plus similaires
        return similarityScores.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    /**
     * Algorithme 2 : Catégories préférées
     */
    private void addScoresFromPreferredCategories(Integer idUtilisateur, Map<Integer, Double> scores, Set<Integer> produitsAchetes) {
        Map<Integer, Integer> categoryCounts = new HashMap<>();
        for (Integer produitId : produitsAchetes) {
            produitRepository.findById(produitId).ifPresent(p -> {
                categoryCounts.merge(p.getIdCategorie(), 1, Integer::sum);
            });
        }

        // Top 3 catégories préférées
        List<Integer> preferredCategories = categoryCounts.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // Recommander des produits de ces catégories
        for (Integer catId : preferredCategories) {
            List<Produit> produits = produitRepository.findByIdCategorie(catId);
            for (Produit p : produits) {
                if (!produitsAchetes.contains(p.getIdProduit())) {
                    scores.merge(p.getIdProduit(), 25.0, Double::sum);
                }
            }
        }
    }

    /**
     * Algorithme 3 : Produits fréquemment achetés ensemble
     */
    private void addScoresFromFrequentlyBoughtTogether(Integer idUtilisateur, Map<Integer, Double> scores, Set<Integer> produitsAchetes) {
        for (Integer produitId : produitsAchetes) {
            List<Object[]> pairs = detailCommandeRepository.getProduitsAchetesEnsemble(produitId);
            for (Object[] pair : pairs) {
                Integer autreProduit = (Integer) pair[0];
                Long frequency = (Long) pair[1];

                if (!produitsAchetes.contains(autreProduit)) {
                    scores.merge(autreProduit, frequency * 15.0, Double::sum);
                }
            }
        }
    }

    /**
     * Algorithme 4 : Produits tendance
     */
    private void addScoresFromTrendingProducts(Map<Integer, Double> scores, Set<Integer> produitsAchetes) {
        List<Object[]> trending = detailCommandeRepository.getProduitsLesPlusVendus();
        int rank = 1;
        for (Object[] row : trending) {
            Integer produitId = (Integer) row[0];
            if (!produitsAchetes.contains(produitId)) {
                double score = 50.0 / rank;
                scores.merge(produitId, score, Double::sum);
            }
            rank++;
            if (rank > 20) break;
        }
    }

    /**
     * Algorithme 5 : Produits bien notés
     * ⚠️ CORRECTION BIGDECIMAL : Utilise .doubleValue() pour convertir
     */
    private void addScoresFromHighRatedProducts(Map<Integer, Double> scores, Set<Integer> produitsAchetes) {
        List<Produit> allProducts = produitRepository.findAll();
        for (Produit p : allProducts) {
            if (!produitsAchetes.contains(p.getIdProduit())
                    && p.getNoteMoyenne() != null
                    && p.getNoteMoyenne().doubleValue() >= 4.0) {
                scores.merge(p.getIdProduit(), p.getNoteMoyenne().doubleValue() * 10.0, Double::sum);
            }
        }
    }

    /**
     * Convertir les scores en DTOs de recommandation
     */
    private List<RecommendationDTO> convertScoresToRecommendations(Map<Integer, Double> scores, Integer limit) {
        return scores.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(limit != null ? limit : 10)
                .map(entry -> {
                    Integer produitId = entry.getKey();
                    Double score = entry.getValue();

                    return produitRepository.findById(produitId)
                            .map(p -> createRecommendationDTO(p, score))
                            .orElse(null);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Créer un DTO de recommandation à partir d'un produit
     * ⚠️ CORRECTION BIGDECIMAL : Convertit getNoteMoyenne() en Double
     */
    private RecommendationDTO createRecommendationDTO(Produit produit, Double rawScore) {
        RecommendationDTO dto = new RecommendationDTO();
        dto.setIdProduit(produit.getIdProduit());
        dto.setNomProduit(produit.getNomProduit());
        dto.setDescription(produit.getDescription());
        dto.setPrix(produit.getPrix());
        dto.setImageUrl(produit.getImageUrl());

        // Normaliser le score entre 0 et 100
        double normalizedScore = Math.min(100.0, (rawScore / 200.0) * 100.0);
        dto.setScore(BigDecimal.valueOf(normalizedScore).setScale(1, RoundingMode.HALF_UP).doubleValue());

        // Raison de la recommandation
        dto.setRaisonRecommandation(getRaisonRecommandation(rawScore));

        // ⚠️ CORRECTION BIGDECIMAL : Convertir BigDecimal en Double avec gestion null
        dto.setNotemoyenne(produit.getNoteMoyenne() != null ? produit.getNoteMoyenne().doubleValue() : null);

        return dto;
    }

    /**
     * Générer un message explicatif
     */
    private String getRaisonRecommandation(Double score) {
        if (score > 150) {
            return "Très populaire auprès des clients similaires";
        } else if (score > 100) {
            return "Fréquemment acheté avec vos produits préférés";
        } else if (score > 50) {
            return "Correspond à vos préférences";
        } else {
            return "Tendance du moment";
        }
    }
}