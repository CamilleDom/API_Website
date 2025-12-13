// src/main/java/com/example/demo/graphql/types/UtilisateurInput.java

package com.example.demo.graphql.types;

import com.example.demo.models.Utilisateur;
import lombok.Data;

@Data
public class UtilisateurInput {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String ville;
    private String codePostal;
    private String pays;
    private Utilisateur.Statut statut;
    private Utilisateur.Role role;
}