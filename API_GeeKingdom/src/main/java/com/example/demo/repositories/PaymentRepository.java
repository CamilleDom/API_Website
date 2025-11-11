package com.example.demo.repositories;

import com.example.demo.models.Payment;
import com.example.demo.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Récupérer les paiements d'une commande
    List<Payment> findByOrder(Order order);
}
