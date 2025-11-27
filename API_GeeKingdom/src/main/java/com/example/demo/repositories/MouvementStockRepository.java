package com.example.demo.repositories;

import com.example.demo.models.MouvementStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MouvementStockRepository extends JpaRepository<MouvementStock, Integer> {
    
    List<MouvementStock> findByIdProduit(Integer idProduit);
    
    List<MouvementStock> findByTypeMouvement(MouvementStock.TypeMouvement type);
    
    List<MouvementStock> findByReferenceCommande(Integer referenceCommande);
    
    List<MouvementStock> findByIdUtilisateur(Integer idUtilisateur);
    
    List<MouvementStock> findByDateMouvementBetween(LocalDateTime debut, LocalDateTime fin);
    
    // Historique d'un produit trié par date
    List<MouvementStock> findByIdProduitOrderByDateMouvementDesc(Integer idProduit);
    
    // Total des entrées pour un produit
    @Query("SELECT SUM(m.quantite) FROM MouvementStock m WHERE m.idProduit = :idProduit AND m.typeMouvement = 'entree'")
    Integer getTotalEntrees(Integer idProduit);
    
    // Total des sorties pour un produit
    @Query("SELECT SUM(m.quantite) FROM MouvementStock m WHERE m.idProduit = :idProduit AND m.typeMouvement = 'sortie'")
    Integer getTotalSorties(Integer idProduit);
}