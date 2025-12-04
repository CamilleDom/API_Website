// src/main/java/com/example/demo/graphql/types/AdminStats.java

package com.example.demo.graphql.types;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStats {
    private Integer totalUtilisateurs;
    private Integer utilisateursActifs;
    private Integer utilisateursSuspendus;
    private Integer totalProduits;
    private Integer produitsDisponibles;
    private Integer produitsEnRupture;
    private Integer totalCommandes;
    private Integer commandesEnAttente;
    private Integer commandesExpediees;
    private Integer commandesLivrees;
    private Double chiffreAffaires;
    private Integer avisEnAttente;
    private Integer stocksEnAlerte;
}