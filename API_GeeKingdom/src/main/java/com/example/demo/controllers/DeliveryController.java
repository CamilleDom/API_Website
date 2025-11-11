package com.example.demo.controllers;

import com.example.demo.models.Delivery;
import com.example.demo.repositories.DeliveryRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @GetMapping
    public List<Delivery> getAll() { return deliveryRepository.findAll(); }

    @PostMapping
    public Delivery add(@RequestBody Delivery delivery) {
        return deliveryRepository.save(delivery);
    }

    @PutMapping("/{id}")
    public Delivery update(@PathVariable Long id,@RequestBody Delivery delivery){
        delivery.setId(id);
        return deliveryRepository.save(delivery);
    }
}
