package com.example.demo.repositories;

import com.example.demo.models.Delivery;
import com.example.demo.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    // Récupérer la livraison d’une commande
    Delivery findByOrder(Order order);
}
