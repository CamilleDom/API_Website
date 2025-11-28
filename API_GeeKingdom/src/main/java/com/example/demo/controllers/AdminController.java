package com.example.demo.controllers;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    // ✅ Cet endpoint nécessite l'API Key
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return Map.of(
            "totalUsers", 100,
            "totalProducts", 50,
            "totalOrders", 25
        );
    }

    @PostMapping("/config")
    public Map<String, String> updateConfig(@RequestBody Map<String, String> config) {
        return Map.of("message", "Configuration mise à jour");
    }
}