package com.example.demo.repositories;

import com.example.demo.models.PointRetrait;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PointRetraitRepository extends JpaRepository<PointRetrait, Integer> {
    
    List<PointRetrait> findByStatut(PointRetrait.Statut statut);
    
    List<PointRetrait> findByVille(String ville);
    
    List<PointRetrait> findByCodePostal(String codePostal);
    
    // Points de retrait actifs
    @Query("SELECT p FROM PointRetrait p WHERE p.statut = 'actif'")
    List<PointRetrait> findPointsActifs();
    
    // Recherche par rayon (en kilomètres) - nécessite une fonction native MySQL
    @Query(value = """
        SELECT *, 
        (6371 * acos(
            cos(radians(:lat)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians(:lon)) + 
            sin(radians(:lat)) * sin(radians(latitude))
        )) AS distance 
        FROM points_retrait 
        WHERE statut = 'actif'
        HAVING distance <= :rayon 
        ORDER BY distance
        """, nativeQuery = true)
    List<PointRetrait> findByProximite(
        @Param("lat") BigDecimal latitude,
        @Param("lon") BigDecimal longitude,
        @Param("rayon") double rayonKm
    );
}