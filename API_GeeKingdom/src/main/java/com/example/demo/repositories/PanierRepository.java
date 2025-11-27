package com.example.demo.repositories;

import com.example.demo.models.Panier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PanierRepository extends JpaRepository<Panier, Integer> {
    
    List<Panier> findByIdUtilisateur(Integer idUtilisateur);
    
    Optional<Panier> findByIdUtilisateurAndIdProduit(Integer idUtilisateur, Integer idProduit);
    
    void deleteByIdUtilisateur(Integer idUtilisateur);
}