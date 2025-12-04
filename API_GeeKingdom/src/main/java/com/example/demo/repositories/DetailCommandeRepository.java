package com.example.demo.repositories;

import com.example.demo.models.DetailCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DetailCommandeRepository extends JpaRepository<DetailCommande, Integer> {
    
    List<DetailCommande> findByIdCommande(Integer idCommande);
    
    List<DetailCommande> findByIdProduit(Integer idProduit);

    /* Obtenir les produits les plus vendus (pour les tendances)
     * Retourne : [idProduit, quantitéTotale]*/

    /**
     * Obtenir les produits fréquemment achetés ensemble
     * Trouve les produits souvent dans les mêmes commandes qu'un produit donné
     * Retourne : [idProduit, fréquence]
     */
    @Query("SELECT d2.idProduit, COUNT(DISTINCT d2.idCommande) as frequency " +
            "FROM DetailCommande d1 " +
            "JOIN DetailCommande d2 ON d1.idCommande = d2.idCommande " +
            "WHERE d1.idProduit = :idProduit " +
            "AND d2.idProduit != :idProduit " +
            "GROUP BY d2.idProduit " +
            "ORDER BY frequency DESC")
    List<Object[]> getProduitsAchetesEnsemble(@Param("idProduit") Integer idProduit);
    
    // Total d'une commande
    @Query("SELECT SUM(d.prixTotal) FROM DetailCommande d WHERE d.idCommande = :idCommande")
    BigDecimal getTotalCommande(Integer idCommande);
    
    // Produits les plus vendus
    @Query("SELECT d.idProduit, SUM(d.quantite) as total FROM DetailCommande d GROUP BY d.idProduit ORDER BY total DESC")
    List<Object[]> getProduitsLesPlusVendus();
    
    // Vérifier si un produit a été acheté par un utilisateur (via commande)
    @Query("""
        SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END 
        FROM DetailCommande d 
        JOIN Commande c ON d.idCommande = c.idCommande 
        WHERE d.idProduit = :idProduit AND c.idUtilisateur = :idUtilisateur
    """)
    boolean hasUserBoughtProduct(Integer idProduit, Integer idUtilisateur);

}