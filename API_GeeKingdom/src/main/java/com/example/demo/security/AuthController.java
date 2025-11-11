package com.example.demo.security;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        // ✅ Exemple simple : un seul utilisateur autorisé
        if ("admin".equals(username) && "password".equals(password)) {
            String token = JwtUtil.generateToken(username, "ROLE_ADMIN");
            return Map.of("token", token);
        }

        return Map.of("error", "Invalid credentials");
    }
}
