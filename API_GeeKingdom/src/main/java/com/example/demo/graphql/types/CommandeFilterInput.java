// src/main/java/com/example/demo/graphql/types/CommandeFilterInput.java

package com.example.demo.graphql.types;

import com.example.demo.models.Commande;
import lombok.Data;

@Data
public class CommandeFilterInput {
    private Commande.Statut statut;
    private Integer idUtilisateur;
    private String dateDebut;
    private String dateFin;
}