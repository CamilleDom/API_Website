package com.example.demo.controllers;

import com.example.demo.models.Utilisateur;
import com.example.demo.repositories.UtilisateurRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class UtilisateurController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    // ✅ INSCRIPTION
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Utilisateur utilisateur) {
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé"));
        }
        
        utilisateur.setDateInscription(LocalDateTime.now());
        utilisateur.setStatut(Utilisateur.Statut.actif);
        utilisateur.setRole(Utilisateur.Role.client);
        
        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok(Map.of(
            "message", "Utilisateur créé avec succès",
            "id", saved.getIdUtilisateur()
        ));
    }

    // ✅ CONNEXION
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Utilisateur user = utilisateurRepository.findByEmail(email).orElse(null);
        
        if (user != null && user.getMotDePasse().equals(password)) {
            // Mettre à jour la dernière connexion
            user.setDateDerniereConnexion(LocalDateTime.now());
            utilisateurRepository.save(user);
            
            String token = JwtUtil.generateToken(
                email, 
                "ROLE_" + user.getRole().name().toUpperCase()
            );
            
            return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                    "id", user.getIdUtilisateur(),
                    "nom", user.getNom(),
                    "prenom", user.getPrenom(),
                    "email", user.getEmail(),
                    "role", user.getRole()
                )
            ));
        }
        
        return ResponseEntity.status(401).body(Map.of("error", "Identifiants invalides"));
    }

    // ✅ PROFIL UTILISATEUR
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Integer id) {
        return utilisateurRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ MISE À JOUR PROFIL
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Integer id, @RequestBody Utilisateur utilisateur) {
        return utilisateurRepository.findById(id)
            .map(existing -> {
                existing.setNom(utilisateur.getNom());
                existing.setPrenom(utilisateur.getPrenom());
                existing.setTelephone(utilisateur.getTelephone());
                existing.setAdresse(utilisateur.getAdresse());
                existing.setVille(utilisateur.getVille());
                existing.setCodePostal(utilisateur.getCodePostal());
                existing.setPays(utilisateur.getPays());
                existing.setLatitude(utilisateur.getLatitude());
                existing.setLongitude(utilisateur.getLongitude());
                
                Utilisateur updated = utilisateurRepository.save(existing);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}