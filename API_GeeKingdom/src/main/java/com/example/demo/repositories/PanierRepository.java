package com.example.demo.repositories;

import com.example.demo.models.Panier;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PanierRepository extends JpaRepository<Panier, Integer> {
    
    List<Panier> findByIdUtilisateur(Integer idUtilisateur);
    
    Optional<Panier> findByIdUtilisateurAndIdProduit(Integer idUtilisateur, Integer idProduit);

    @Modifying
    @Transactional
    void deleteByIdUtilisateur(Integer idUtilisateur);
}