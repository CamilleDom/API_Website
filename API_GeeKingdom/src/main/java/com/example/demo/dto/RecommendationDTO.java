package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO pour les recommandations de produits
 * Localisation : src/main/java/com/example/demo/dto/RecommendationDTO.java
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDTO {
    private Integer idProduit;
    private String nomProduit;
    private String description;
    private BigDecimal prix;
    private String imageUrl;
    private Double score; // Score de recommandation (0-100)
    private String raisonRecommandation; // Pourquoi ce produit est recommandé
    private Integer nombreAchats; // Nombre de fois acheté
    private Double notemoyenne; // Note moyenne du produit
}