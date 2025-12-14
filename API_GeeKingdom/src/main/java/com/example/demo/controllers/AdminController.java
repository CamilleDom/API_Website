package com.example.demo.controllers;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Administration", description = "Endpoints admin (requiert API Key)")
@SecurityRequirement(name = "API Key")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Operation(summary = "Obtenir les statistiques globales")
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return Map.of(
            "totalUsers", 100,
            "totalProducts", 50,
            "totalOrders", 25
        );
    }

    @Operation(summary = "Mettre à jour la configuration")
    @PostMapping("/config")
    public Map<String, String> updateConfig(@RequestBody Map<String, String> config) {
        return Map.of("message", "Configuration mise à jour");
    }
}