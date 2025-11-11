package com.example.demo.controllers;

import com.example.demo.models.Order;
import com.example.demo.models.User;
import com.example.demo.repositories.OrderRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Order create(@RequestBody Order order){
        User user = userRepository.findById(order.getUser().getUsername()).orElse(null);
        order.setUser(user);
        order.setStatus("CREATED");
        return orderRepository.save(order);
    }

    @GetMapping("/{id}")
    public Order get(@PathVariable Long id){
        return orderRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Order update(@PathVariable Long id,@RequestBody Order order){
        order.setId(id);
        return orderRepository.save(order);
    }

    @DeleteMapping("/{id}")
    public void cancel(@PathVariable Long id){
        orderRepository.deleteById(id);
    }

    @GetMapping("/user/{username}")
    public List<Order> getUserOrders(@PathVariable String username){
        return orderRepository.findAll().stream()
                .filter(o -> o.getUser().getUsername().equals(username))
                .toList();
    }
}
