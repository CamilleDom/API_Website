package com.example.demo.controllers;

import com.example.demo.models.Commande;
import com.example.demo.repositories.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {

    @Autowired
    private CommandeRepository commandeRepository;

    @GetMapping
    public List<Commande> getAll() {
        return commandeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commande> getById(@PathVariable Integer id) {
        return commandeRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<Commande> getByUtilisateur(@PathVariable Integer idUtilisateur) {
        return commandeRepository.findByIdUtilisateur(idUtilisateur);
    }

    @PostMapping
    public Commande create(@RequestBody Commande commande) {
        // Générer un numéro de commande unique
        commande.setNumeroCommande("CMD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        commande.setStatut(Commande.Statut.en_attente);
        return commandeRepository.save(commande);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Commande> update(@PathVariable Integer id, @RequestBody Commande commande) {
        return commandeRepository.findById(id)
            .map(existing -> {
                commande.setIdCommande(id);
                return ResponseEntity.ok(commandeRepository.save(commande));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (commandeRepository.existsById(id)) {
            commandeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}