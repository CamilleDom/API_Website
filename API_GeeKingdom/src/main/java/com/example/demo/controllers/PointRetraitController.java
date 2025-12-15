package com.example.demo.controllers;

import com.example.demo.models.PointRetrait;
import com.example.demo.repositories.PointRetraitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name = "Points de Retrait", description = "Gestion et localisation des points de retrait")
@RestController
@RequestMapping("/api/points-retrait")
public class PointRetraitController {

    @Autowired
    private PointRetraitRepository pointRetraitRepository;

    @Operation(summary = "Liste tous les points de retrait")
    @ApiResponse(responseCode = "200", description = "Liste des points")
    @GetMapping
    public List<PointRetrait> getAll() {
        return pointRetraitRepository.findAll();
    }

    @Operation(summary = "Points de retrait actifs uniquement")
    @ApiResponse(responseCode = "200", description = "Liste des points actifs")
    @GetMapping("/actifs")
    public List<PointRetrait> getActifs() {
        return pointRetraitRepository.findPointsActifs();
    }

    // ✅ POINT PAR ID
    @GetMapping("/{id}")
    public ResponseEntity<PointRetrait> getById(@PathVariable Integer id) {
        return pointRetraitRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Points de retrait par ville")
    @ApiResponse(responseCode = "200", description = "Points trouvés")
    @GetMapping("/ville/{ville}")
    public List<PointRetrait> getByVille(
            @Parameter(description = "Nom de la ville", example = "Paris")
            @PathVariable String ville
    ) {
        return pointRetraitRepository.findByVille(ville);
    }

    @Operation(summary = "Points de retrait par code postal")
    @ApiResponse(responseCode = "200", description = "Points trouvés")
    @GetMapping("/code-postal/{codePostal}")
    public List<PointRetrait> getByCodePostal(
            @Parameter(description = "Code postal", example = "75001")
            @PathVariable String codePostal
    ) {
        return pointRetraitRepository.findByCodePostal(codePostal);
    }

    @Operation(
            summary = "Points de retrait à proximité",
            description = "Cherche les points dans un rayon donné (en km) autour d'une position GPS"
    )
    @ApiResponse(responseCode = "200", description = "Points trouvés avec distance calculée")
    @GetMapping("/proximite")
    public ResponseEntity<?> getByProximite(
            @Parameter(description = "Latitude GPS", example = "48.8566", required = true)
            @RequestParam BigDecimal latitude,
            @Parameter(description = "Longitude GPS", example = "2.3522", required = true)
            @RequestParam BigDecimal longitude,
            @Parameter(description = "Rayon de recherche en km", example = "10")
            @RequestParam(defaultValue = "10") double rayon
    ) {
        List<PointRetrait> points = pointRetraitRepository.findByProximite(latitude, longitude, rayon);
        
        // Calculer et ajouter la distance pour chaque point
        List<Map<String, Object>> resultat = points.stream()
            .map(point -> {
                double distance = point.distanceFrom(latitude, longitude);
                return Map.of(
                    "point", point,
                    "distance", Math.round(distance * 100.0) / 100.0 // arrondi à 2 décimales
                );
            })
            .sorted(Comparator.comparingDouble(m -> (Double) m.get("distance")))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(resultat);
    }

    // ✅ CRÉER UN POINT DE RETRAIT
    @PostMapping
    public PointRetrait create(@RequestBody PointRetrait pointRetrait) {
        pointRetrait.setStatut(PointRetrait.Statut.actif);
        return pointRetraitRepository.save(pointRetrait);
    }

    // ✅ MODIFIER UN POINT
    @PutMapping("/{id}")
    public ResponseEntity<PointRetrait> update(@PathVariable Integer id, @RequestBody PointRetrait pointRetrait) {
        return pointRetraitRepository.findById(id)
            .map(existing -> {
                pointRetrait.setIdPointRetrait(id);
                return ResponseEntity.ok(pointRetraitRepository.save(pointRetrait));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ CHANGER LE STATUT
    @PutMapping("/{id}/statut")
    public ResponseEntity<?> changerStatut(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String statut = request.get("statut");
        
        return pointRetraitRepository.findById(id)
            .map(point -> {
                point.setStatut(PointRetrait.Statut.valueOf(statut));
                pointRetraitRepository.save(point);
                return ResponseEntity.ok(Map.of(
                    "message", "Statut modifié",
                    "nouveauStatut", statut
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ SUPPRIMER UN POINT
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (pointRetraitRepository.existsById(id)) {
            pointRetraitRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Point de retrait supprimé"));
        }
        return ResponseEntity.notFound().build();
    }
}