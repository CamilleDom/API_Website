package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration de sécurité Spring
 * Localisation : API_GeeKingdom/src/main/java/com/example/demo/config/SecurityConfig.java
 *
 * Ce fichier est NÉCESSAIRE pour que le PasswordEncoder fonctionne
 */
@Configuration
public class SecurityConfig {

    /**
     * Bean PasswordEncoder pour hasher les mots de passe avec bcrypt
     * Utilisé par UtilisateurController pour :
     * - Hasher les mots de passe lors de l'inscription
     * - Vérifier les mots de passe lors de la connexion
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}