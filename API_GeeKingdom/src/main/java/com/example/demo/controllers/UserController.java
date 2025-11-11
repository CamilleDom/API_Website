package com.example.demo.controllers;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public Map<String,String> register(@RequestBody User user){
        if(userRepository.existsById(user.getUsername())){
            return Map.of("error","Utilisateur déjà existant");
        }
        userRepository.save(user);
        return Map.of("message","Utilisateur créé");
    }

    @PostMapping("/login")
    public Map<String,String> login(@RequestBody Map<String,String> body){
        String username = body.get("username");
        String password = body.get("password");

        User user = userRepository.findById(username).orElse(null);
        if(user!=null && user.getPassword().equals(password)){
            String token = JwtUtil.generateToken(username, "ROLE_USER");
            return Map.of("token",token);
        }
        return Map.of("error","Identifiants invalides");
    }

    @DeleteMapping("/{username}")
    public Map<String,String> deleteUser(@PathVariable String username){
        userRepository.deleteById(username);
        return Map.of("message","Utilisateur supprimé");
    }
}
