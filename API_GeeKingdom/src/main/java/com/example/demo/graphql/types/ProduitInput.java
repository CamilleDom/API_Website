// src/main/java/com/example/demo/graphql/types/ProduitInput.java

package com.example.demo.graphql.types;

import com.example.demo.models.Produit;
import lombok.Data;

@Data
public class ProduitInput {
    private String nomProduit;
    private String description;
    private Double prix;
    private Integer idCategorie;
    private String marque;
    private Double poids;
    private String dimensions;
    private Produit.Statut statut;
}