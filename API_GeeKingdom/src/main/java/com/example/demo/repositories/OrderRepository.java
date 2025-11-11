package com.example.demo.repositories;

import com.example.demo.models.Order;
import com.example.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Récupérer toutes les commandes d'un utilisateur
    List<Order> findByUser(User user);
}
