package com.example.demo.controllers;

import com.example.demo.models.PointRetrait;
import com.example.demo.repositories.PointRetraitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/points-retrait")
public class PointRetraitController {

    @Autowired
    private PointRetraitRepository pointRetraitRepository;

    // ✅ LISTE TOUS LES POINTS
    @GetMapping
    public List<PointRetrait> getAll() {
        return pointRetraitRepository.findAll();
    }

    // ✅ POINTS ACTIFS
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

    // ✅ POINTS PAR VILLE
    @GetMapping("/ville/{ville}")
    public List<PointRetrait> getByVille(@PathVariable String ville) {
        return pointRetraitRepository.findByVille(ville);
    }

    // ✅ POINTS PAR CODE POSTAL
    @GetMapping("/code-postal/{codePostal}")
    public List<PointRetrait> getByCodePostal(@PathVariable String codePostal) {
        return pointRetraitRepository.findByCodePostal(codePostal);
    }

    // ✅ POINTS À PROXIMITÉ (rayon en km)
    @GetMapping("/proximite")
    public ResponseEntity<?> getByProximite(
        @RequestParam BigDecimal latitude,
        @RequestParam BigDecimal longitude,
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