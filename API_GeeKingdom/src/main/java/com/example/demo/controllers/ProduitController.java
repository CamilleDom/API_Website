package com.example.demo.controllers;

import com.example.demo.models.Produit;
import com.example.demo.repositories.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    @Autowired
    private ProduitRepository produitRepository;

    @GetMapping
    public List<Produit> getAll(@RequestParam(required = false) Integer categorie) {
        if (categorie != null) {
            return produitRepository.findByIdCategorie(categorie);
        }
        return produitRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produit> getById(@PathVariable Integer id) {
        return produitRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Produit create(@RequestBody Produit produit) {
        return produitRepository.save(produit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> update(@PathVariable Integer id, @RequestBody Produit produit) {
        return produitRepository.findById(id)
                .map(existing -> {
                    produit.setIdProduit(id);
                    return ResponseEntity.ok(produitRepository.save(produit));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (produitRepository.existsById(id)) {
            produitRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}