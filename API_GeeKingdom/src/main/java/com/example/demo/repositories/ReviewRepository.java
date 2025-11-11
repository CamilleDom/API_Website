package com.example.demo.repositories;

import com.example.demo.models.Review;
import com.example.demo.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Récupérer les avis d’un produit
    List<Review> findByProduct(Product product);
}
