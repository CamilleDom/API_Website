package com.example.demo.models.enums;

/**
 * Enum pour les rôles utilisateur
 * Localisation : API_GeeKingdom/src/main/java/com/example/demo/models/enums/Role.java
 */
public enum Role {
    CLIENT("client"),
    VENDEUR("vendeur"),
    ADMIN("admin");

    private final String value;

    Role(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}