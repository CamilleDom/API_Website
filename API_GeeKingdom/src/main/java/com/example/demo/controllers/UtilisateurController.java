package com.example.demo.controllers;

import com.example.demo.models.Utilisateur;
import com.example.demo.repositories.UtilisateurRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Tag(
        name = "Authentification",
        description = "Inscription, connexion et gestion du profil utilisateur"
)
@RestController
@RequestMapping("/auth")
public class UtilisateurController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Operation(
            summary = "Inscription d'un nouvel utilisateur",
            description = """
        Crée un nouveau compte utilisateur.
        - Hash sécurisé du mot de passe avec BCrypt
        - Vérification de l'unicité de l'email
        - Rôle 'client' par défaut
        - Statut 'actif' par défaut
        """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Utilisateur créé avec succès",
                    content = @Content(
                            examples = @ExampleObject(
                                    value = """
                    {
                      "message": "Utilisateur créé avec succès",
                      "id": 15
                    }
                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Données invalides ou email déjà utilisé"
            )
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Données d'inscription de l'utilisateur",
                    required = true,
                    content = @Content(
                            examples = @ExampleObject(
                                    value = """
                    {
                      "nom": "Dupont",
                      "prenom": "Jean",
                      "email": "jean.dupont@email.fr",
                      "motDePasse": "password123",
                      "telephone": "0612345678",
                      "adresse": "10 Rue de la Paix",
                      "ville": "Paris",
                      "codePostal": "75002",
                      "pays": "France"
                    }
                    """
                            )
                    )
            )
            @RequestBody Utilisateur utilisateur
    ) {
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

        // HASHER LE MOT DE PASSE AVEC BCRYPT
        String hashedPassword = passwordEncoder.encode(utilisateur.getMotDePasse());
        utilisateur.setMotDePasse(hashedPassword);

        // Définir les valeurs par défaut
        utilisateur.setDateInscription(LocalDateTime.now());
        utilisateur.setStatut(Utilisateur.Statut.actif);
        utilisateur.setRole(Utilisateur.Role.client);

        // Valeur par défaut pour le pays si non fourni
        if (utilisateur.getPays() == null || utilisateur.getPays().isEmpty()) {
            utilisateur.setPays("France");
        }

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

    @Operation(
            summary = "Connexion utilisateur",
            description = """
        Authentifie un utilisateur et retourne un token JWT.
        - Vérification sécurisée du mot de passe avec BCrypt
        - Génération d'un token JWT valide 24h
        - Mise à jour de la date de dernière connexion
        """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Connexion réussie",
                    content = @Content(
                            examples = @ExampleObject(
                                    value = """
                    {
                      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                      "user": {
                        "id": 3,
                        "nom": "Dubois",
                        "prenom": "Lucas",
                        "email": "lucas.dubois@email.fr",
                        "role": "client",
                        "statut": "actif"
                      }
                    }
                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Identifiants invalides"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Compte désactivé"
            )
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Email et mot de passe",
                    required = true,
                    content = @Content(
                            examples = @ExampleObject(
                                    value = """
                    {
                      "email": "lucas.dubois@email.fr",
                      "password": "password123"
                    }
                    """
                            )
                    )
            )
            @RequestBody Map<String, String> body
    ) {
        String email = body.get("email");
        String password = body.get("password");

        // Validation des entrées
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Email et mot de passe requis")
            );
        }

        try {
            // Rechercher l'utilisateur (retourne Optional)
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

                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getIdUtilisateur());
                userData.put("nom", user.getNom());
                userData.put("prenom", user.getPrenom());
                userData.put("email", user.getEmail());
                userData.put("telephone", user.getTelephone() != null ? user.getTelephone() : "");
                userData.put("adresse", user.getAdresse() != null ? user.getAdresse() : "");
                userData.put("ville", user.getVille() != null ? user.getVille() : "");
                userData.put("codePostal", user.getCodePostal() != null ? user.getCodePostal() : "");
                userData.put("pays", user.getPays() != null ? user.getPays() : "France");
                userData.put("role", user.getRole());
                userData.put("statut", user.getStatut());
                userData.put("dateInscription", user.getDateInscription());

                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "user", userData
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

    @Operation(
            summary = "Récupérer le profil d'un utilisateur",
            description = "Retourne toutes les informations de profil (sauf le mot de passe)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profil récupéré"),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    @SecurityRequirement(name = "JWT")
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(
            @Parameter(description = "ID de l'utilisateur", required = true)
            @PathVariable Integer id
    ) {
        return utilisateurRepository.findById(id)
                .map(user -> {
                    Map<String, Object> profile = new HashMap<>();
                    profile.put("id", user.getIdUtilisateur());
                    profile.put("nom", user.getNom());
                    profile.put("prenom", user.getPrenom());
                    profile.put("email", user.getEmail());
                    profile.put("telephone", user.getTelephone() != null ? user.getTelephone() : "");
                    profile.put("adresse", user.getAdresse() != null ? user.getAdresse() : "");
                    profile.put("ville", user.getVille() != null ? user.getVille() : "");
                    profile.put("codePostal", user.getCodePostal() != null ? user.getCodePostal() : "");
                    profile.put("pays", user.getPays() != null ? user.getPays() : "France");
                    profile.put("role", user.getRole());
                    profile.put("statut", user.getStatut());
                    profile.put("dateInscription", user.getDateInscription());

                    return ResponseEntity.ok(profile);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 🔐 MODIFIER PROFIL (avec gestion sécurisée du mot de passe)
     * ✅ CORRIGÉ: Gérer TOUS les champs y compris adresse, ville, codePostal, pays
     */
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Integer id, @RequestBody Map<String, String> updates) {
        return utilisateurRepository.findById(id)
                .map(user -> {
                    // Mettre à jour les informations personnelles
                    if (updates.containsKey("nom") && updates.get("nom") != null && !updates.get("nom").isEmpty()) {
                        user.setNom(updates.get("nom"));
                    }
                    if (updates.containsKey("prenom") && updates.get("prenom") != null && !updates.get("prenom").isEmpty()) {
                        user.setPrenom(updates.get("prenom"));
                    }
                    if (updates.containsKey("telephone")) {
                        user.setTelephone(updates.get("telephone"));
                    }

                    // ✅ AJOUT: Mettre à jour les champs d'adresse
                    if (updates.containsKey("adresse")) {
                        user.setAdresse(updates.get("adresse"));
                    }
                    if (updates.containsKey("ville")) {
                        user.setVille(updates.get("ville"));
                    }
                    if (updates.containsKey("codePostal")) {
                        user.setCodePostal(updates.get("codePostal"));
                    }
                    if (updates.containsKey("pays")) {
                        user.setPays(updates.get("pays"));
                    }

                    // 🔐 CHANGEMENT DE MOT DE PASSE SÉCURISÉ
                    if (updates.containsKey("motDePasse") && updates.get("motDePasse") != null && !updates.get("motDePasse").isEmpty()) {
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

                    // ✅ CORRIGÉ: Renvoyer TOUTES les données mises à jour
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Profil mis à jour avec succès");
                    response.put("id", user.getIdUtilisateur());
                    response.put("nom", user.getNom());
                    response.put("prenom", user.getPrenom());
                    response.put("email", user.getEmail());
                    response.put("telephone", user.getTelephone() != null ? user.getTelephone() : "");
                    response.put("adresse", user.getAdresse() != null ? user.getAdresse() : "");
                    response.put("ville", user.getVille() != null ? user.getVille() : "");
                    response.put("codePostal", user.getCodePostal() != null ? user.getCodePostal() : "");
                    response.put("pays", user.getPays() != null ? user.getPays() : "France");
                    response.put("role", user.getRole());
                    response.put("statut", user.getStatut());

                    return ResponseEntity.ok(response);
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
     * 🔐 CHANGER MOT DE PASSE (endpoint séparé avec vérification ancien mot de passe)
     */
    @PutMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Ancien et nouveau mot de passe requis")
            );
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Le nouveau mot de passe doit contenir au moins 6 caractères")
            );
        }

        return utilisateurRepository.findById(id)
                .map(user -> {
                    // Vérifier l'ancien mot de passe
                    if (!passwordEncoder.matches(currentPassword, user.getMotDePasse())) {
                        return ResponseEntity.status(401).body(
                                Map.of("error", "Mot de passe actuel incorrect")
                        );
                    }

                    // Hasher et sauvegarder le nouveau mot de passe
                    user.setMotDePasse(passwordEncoder.encode(newPassword));
                    utilisateurRepository.save(user);

                    return ResponseEntity.ok(Map.of("message", "Mot de passe modifié avec succès"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}