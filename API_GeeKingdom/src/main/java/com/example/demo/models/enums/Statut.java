package com.example.demo.models.enums;

/**
 * Enum pour le statut du compte utilisateur
 * Localisation : API_GeeKingdom/src/main/java/com/example/demo/models/enums/Statut.java
 */
public enum Statut {
    ACTIF("actif"),
    INACTIF("inactif"),
    SUSPENDU("suspendu");

    private final String value;

    Statut(String value) {
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