package com.example.demo.controllers;

import com.example.demo.models.Payment;
import com.example.demo.repositories.PaymentRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping
    public List<Payment> getAll(){
        return paymentRepository.findAll();
    }

    @PostMapping
    public Payment add(@RequestBody Payment payment){
        return paymentRepository.save(payment);
    }

    @PutMapping("/{id}")
    public Payment update(@PathVariable Long id,@RequestBody Payment payment){
        payment.setId(id);
        return paymentRepository.save(payment);
    }
}
