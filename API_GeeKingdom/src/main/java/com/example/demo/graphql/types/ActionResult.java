// src/main/java/com/example/demo/graphql/types/ActionResult.java

package com.example.demo.graphql.types;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActionResult {
    private Boolean success;
    private String message;
    private String id;
}