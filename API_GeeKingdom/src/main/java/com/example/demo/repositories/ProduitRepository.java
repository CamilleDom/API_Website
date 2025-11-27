package com.example.demo.repositories;

import com.example.demo.models.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Integer> {
    List<Produit> findByIdCategorie(Integer idCategorie);
    List<Produit> findByStatut(Produit.Statut statut);
}