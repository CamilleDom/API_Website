package com.example.demo.repositories;

import com.example.demo.models.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Integer> {
    
    List<Paiement> findByIdCommande(Integer idCommande);
    
    Optional<Paiement> findByTransactionId(String transactionId);
    
    List<Paiement> findByStatutPaiement(Paiement.StatutPaiement statut);
    
    List<Paiement> findByMethodePaiement(Paiement.MethodePaiement methode);
}