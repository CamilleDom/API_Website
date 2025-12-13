// src/main/java/com/example/demo/graphql/types/StockAlert.java

package com.example.demo.graphql.types;

import com.example.demo.models.Produit;
import com.example.demo.models.Stock;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockAlert {
    private Produit produit;
    private Stock stock;
    private String alertLevel;
}