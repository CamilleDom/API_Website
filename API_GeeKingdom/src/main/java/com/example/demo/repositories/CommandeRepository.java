package com.example.demo.repositories;

import com.example.demo.models.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Integer> {
    List<Commande> findByIdUtilisateur(Integer idUtilisateur);
    Optional<Commande> findByNumeroCommande(String numeroCommande);
}