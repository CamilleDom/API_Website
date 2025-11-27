package com.example.demo.repositories;

import com.example.demo.models.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Integer> {
    
    Optional<Stock> findByIdProduit(Integer idProduit);
    
    // Produits en rupture de stock
    @Query("SELECT s FROM Stock s WHERE s.quantiteDisponible <= 0")
    List<Stock> findProduitsEnRupture();
    
    // Produits sous le seuil d'alerte
    @Query("SELECT s FROM Stock s WHERE s.quantiteDisponible <= s.seuilAlerte AND s.quantiteDisponible > 0")
    List<Stock> findProduitsEnAlerte();
    
    // Produits avec stock disponible
    @Query("SELECT s FROM Stock s WHERE s.quantiteDisponible > 0")
    List<Stock> findProduitsDisponibles();
    
    // Par emplacement
    List<Stock> findByEmplacement(String emplacement);
}