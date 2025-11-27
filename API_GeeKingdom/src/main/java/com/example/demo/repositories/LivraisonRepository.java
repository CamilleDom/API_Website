package com.example.demo.repositories;

import com.example.demo.models.Livraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivraisonRepository extends JpaRepository<Livraison, Integer> {
    
    Optional<Livraison> findByIdCommande(Integer idCommande);
    
    Optional<Livraison> findByNumeroSuivi(String numeroSuivi);
    
    List<Livraison> findByStatutLivraison(Livraison.StatutLivraison statut);
    
    List<Livraison> findByTransporteur(String transporteur);
}