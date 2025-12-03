package com.example.demo.controllers;

import com.example.demo.models.Utilisateur;
import com.example.demo.repositories.UtilisateurRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Contrôleur d'authentification SÉCURISÉ
 * Utilise BCrypt pour le hachage des mots de passe
 *
 * @version 2.0 - Sécurité renforcée
 */
@RestController
@RequestMapping("/auth")
public class UtilisateurController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // ✅ Injection du BCrypt configuré

    /**
     * 🔐 INSCRIPTION SÉCURISÉE
     * Hache le mot de passe avec BCrypt avant sauvegarde
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Utilisateur utilisateur) {
        // Validation de l'email
        if (utilisateur.getEmail() == null || utilisateur.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email requis"));
        }

        // Vérifier si l'email existe déjà
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé"));
        }

        // Validation du mot de passe
        if (utilisateur.getMotDePasse() == null || utilisateur.getMotDePasse().length() < 6) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Le mot de passe doit contenir au moins 6 caractères")
            );
        }

        // 🔐 HASHER LE MOT DE PASSE AVEC BCRYPT
        String hashedPassword = passwordEncoder.encode(utilisateur.getMotDePasse());
        utilisateur.setMotDePasse(hashedPassword);

        // Définir les valeurs par défaut
        utilisateur.setDateInscription(LocalDateTime.now());
        utilisateur.setStatut(Utilisateur.Statut.actif);
        utilisateur.setRole(Utilisateur.Role.client);

        try {
            Utilisateur saved = utilisateurRepository.save(utilisateur);

            return ResponseEntity.ok(Map.of(
                    "message", "Utilisateur créé avec succès",
                    "id", saved.getIdUtilisateur()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Erreur lors de la création du compte")
            );
        }
    }

    /**
     * 🔐 CONNEXION SÉCURISÉE
     * Vérifie le mot de passe avec BCrypt
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        // Validation des entrées
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Email et mot de passe requis")
            );
        }

        try {
            // Rechercher l'utilisateur
            Utilisateur user = utilisateurRepository.findByEmail(email).orElse(null);

            // 🔐 VÉRIFICATION SÉCURISÉE DU MOT DE PASSE
            if (user != null && passwordEncoder.matches(password, user.getMotDePasse())) {
                // Vérifier que le compte est actif
                if (user.getStatut() != Utilisateur.Statut.actif) {
                    return ResponseEntity.status(403).body(
                            Map.of("error", "Compte désactivé")
                    );
                }

                // Mettre à jour la dernière connexion
                user.setDateDerniereConnexion(LocalDateTime.now());
                utilisateurRepository.save(user);

                // Générer le token JWT
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

            // Identifiants invalides (ne pas préciser si email ou password est faux)
            return ResponseEntity.status(401).body(
                    Map.of("error", "Identifiants invalides")
            );

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Erreur lors de la connexion")
            );
        }
    }

    /**
     * RÉCUPÉRER LE PROFIL UTILISATEUR
     */
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Integer id) {
        return utilisateurRepository.findById(id)
                .map(user -> ResponseEntity.ok(Map.of(
                        "id", user.getIdUtilisateur(),
                        "nom", user.getNom(),
                        "prenom", user.getPrenom(),
                        "email", user.getEmail(),
                        "telephone", user.getTelephone() != null ? user.getTelephone() : "",
                        "role", user.getRole(),
                        "statut", user.getStatut(),
                        "dateInscription", user.getDateInscription()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 🔐 MODIFIER PROFIL (avec gestion sécurisée du mot de passe)
     */
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Integer id, @RequestBody Map<String, String> updates) {
        return utilisateurRepository.findById(id)
                .map(user -> {
                    // Mettre à jour les champs non sensibles
                    if (updates.containsKey("nom") && !updates.get("nom").isEmpty()) {
                        user.setNom(updates.get("nom"));
                    }
                    if (updates.containsKey("prenom") && !updates.get("prenom").isEmpty()) {
                        user.setPrenom(updates.get("prenom"));
                    }
                    if (updates.containsKey("telephone")) {
                        user.setTelephone(updates.get("telephone"));
                    }

                    // 🔐 CHANGEMENT DE MOT DE PASSE SÉCURISÉ
                    if (updates.containsKey("motDePasse") && !updates.get("motDePasse").isEmpty()) {
                        String newPassword = updates.get("motDePasse");

                        // Validation de la longueur
                        if (newPassword.length() < 6) {
                            return ResponseEntity.badRequest().body(
                                    Map.of("error", "Le mot de passe doit contenir au moins 6 caractères")
                            );
                        }

                        // Hasher le nouveau mot de passe
                        String newHashedPassword = passwordEncoder.encode(newPassword);
                        user.setMotDePasse(newHashedPassword);
                    }

                    utilisateurRepository.save(user);

                    return ResponseEntity.ok(Map.of(
                            "message", "Profil mis à jour avec succès",
                            "id", user.getIdUtilisateur(),
                            "nom", user.getNom(),
                            "prenom", user.getPrenom(),
                            "email", user.getEmail()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * SUPPRIMER COMPTE
     */
    @DeleteMapping("/profile/{id}")
    public ResponseEntity<?> deleteProfile(@PathVariable Integer id) {
        if (utilisateurRepository.existsById(id)) {
            utilisateurRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Compte supprimé avec succès"));
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * 🔐 CHANGER MOT DE PASSE (avec vérification de l'ancien)
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        Integer userId = Integer.parseInt(body.get("userId"));
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");

        return utilisateurRepository.findById(userId)
                .map(user -> {
                    // Vérifier l'ancien mot de passe
                    if (!passwordEncoder.matches(oldPassword, user.getMotDePasse())) {
                        return ResponseEntity.status(401).body(
                                Map.of("error", "Ancien mot de passe incorrect")
                        );
                    }

                    // Valider le nouveau mot de passe
                    if (newPassword.length() < 6) {
                        return ResponseEntity.badRequest().body(
                                Map.of("error", "Le nouveau mot de passe doit contenir au moins 6 caractères")
                        );
                    }

                    // Hasher et sauvegarder
                    user.setMotDePasse(passwordEncoder.encode(newPassword));
                    utilisateurRepository.save(user);

                    return ResponseEntity.ok(Map.of("message", "Mot de passe changé avec succès"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}