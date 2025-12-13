// src/main/java/com/example/demo/graphql/types/ModerationResult.java

package com.example.demo.graphql.types;

import com.example.demo.models.AvisProduit;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModerationResult {
    private Boolean success;
    private String message;
    private AvisProduit avis;
}