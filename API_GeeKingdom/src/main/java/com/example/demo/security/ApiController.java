package com.example.demo.security;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@RestController
public class ApiController {

    @GetMapping("/api/data")
    public List<String> getData() {
        return List.of("Item1", "Item2", "Item3");
    }

    @GetMapping("/api/info")
    public String getInfo() {
        return "This is some information from the API.";
    }
    
}
