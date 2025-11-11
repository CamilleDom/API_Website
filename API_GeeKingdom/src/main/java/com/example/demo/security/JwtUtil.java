package com.example.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.security.Key;

public class JwtUtil {

    // --- Clé secrète ---
    private static final String SECRET = "69UM9UWFJ3Y36IZ0IrAWGG-Vds3Gqu2mFf9Bn_PdBz4cO5EtlWAVGRdzLfxUPcXD1gIK00GXWxXRDmb8NxJKnGP3z_NXmvQCgUhOSfLydfR_V2Qoq-mJCD6rnT99oy06dgR66wHJxaqjGV_4jpH2jmmdTA8rrUVSN9MVVVhKNn49iOUkeMqtNgKseVAPuTaUFV4wR7lmDSInHOOZn3Tg6q_022s5Ho5Ikg3xVbg6Lb5rSCbKw4oybN7t_QsjLh-Exugh3aUR0UEvijKqgi6OFq7Ya0ghhI16aydRhzrAZiHziDNGCFzATkVp3tnYL0j_SGYFojNnjCaQlRU2fwdeK_1PIRrd396StE8G3xKFx-skxZ7A4xYJ4VStq5oL9imPEDU85QOVN5zU2PvYAQrnSwukQ5WEhhmeYXplm1MNAqGF5b2TUhnfzwE1q4RZDaM3IQkVfwjgmB7rG2qQMbugn-3wWjjipXN0hYIxnhpyNFo0oZKGoKNCnKvLMeI_bgQ9"; // au moins 256 bits
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Durée de validité du token : ici 1 heure
    private static final long EXPIRATION_TIME = 60 * 60 * 1000;

    // --- Génération du token ---
    public static String generateToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(KEY, SignatureAlgorithm.HS256) // ✅ utilise la clé correcte
                .compact();
    }

    // --- Validation du token ---
    public static boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Vérifie que le token n’est pas expiré
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false; // Token invalide (signature, expiration, format…)
        }
    }

    public static Key getSigningKey() {
        return KEY;
    }

}
