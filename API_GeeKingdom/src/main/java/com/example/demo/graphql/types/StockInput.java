// src/main/java/com/example/demo/graphql/types/StockInput.java

package com.example.demo.graphql.types;

import lombok.Data;

@Data
public class StockInput {
    private Integer idProduit;
    private Integer quantite;
    private String commentaire;
}