package com.example.demo.repositories;

import com.example.demo.models.AvisProduit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvisProduitRepository extends JpaRepository<AvisProduit, Integer> {
    
    List<AvisProduit> findByIdProduit(Integer idProduit);
    
    List<AvisProduit> findByIdUtilisateur(Integer idUtilisateur);
    
    List<AvisProduit> findByStatutModeration(AvisProduit.StatutModeration statut);
    
    List<AvisProduit> findByIdProduitAndStatutModeration(Integer idProduit, AvisProduit.StatutModeration statut);
    
    boolean existsByIdProduitAndIdUtilisateur(Integer idProduit, Integer idUtilisateur);
    
    @Query("SELECT AVG(a.note) FROM AvisProduit a WHERE a.idProduit = :idProduit AND a.statutModeration = 'approuve'")
    Double getAverageNoteByProduit(Integer idProduit);
    
    @Query("SELECT COUNT(a) FROM AvisProduit a WHERE a.idProduit = :idProduit AND a.statutModeration = 'approuve'")
    Long countApprovedByProduit(Integer idProduit);
}