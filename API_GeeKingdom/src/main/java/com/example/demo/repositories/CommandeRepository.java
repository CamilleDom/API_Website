package com.example.demo.repositories;

import com.example.demo.models.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Integer> {

    // Commandes d'un utilisateur
    List<Commande> findByIdUtilisateur(Integer idUtilisateur);

    // Rechercher par numéro de commande
    Optional<Commande> findByNumeroCommande(String numeroCommande);

    // Commandes par statut
    List<Commande> findByStatut(Commande.Statut statut);

    // Commandes d'un utilisateur par statut
    List<Commande> findByIdUtilisateurAndStatut(Integer idUtilisateur, Commande.Statut statut);

    // Commandes entre deux dates
    List<Commande> findByDateCommandeBetween(LocalDateTime debut, LocalDateTime fin);

    // Commandes d'un utilisateur entre deux dates
    List<Commande> findByIdUtilisateurAndDateCommandeBetween(Integer idUtilisateur, LocalDateTime debut, LocalDateTime fin);

    // Compter les commandes par statut pour un utilisateur
    @Query("SELECT COUNT(c) FROM Commande c WHERE c.idUtilisateur = :idUtilisateur AND c.statut = :statut")
    long countByIdUtilisateurAndStatut(Integer idUtilisateur, Commande.Statut statut);

    // Commandes récentes (derniers 30 jours)
    @Query("SELECT c FROM Commande c WHERE c.dateCommande >= :depuis ORDER BY c.dateCommande DESC")
    List<Commande> findRecentOrders(LocalDateTime depuis);
}